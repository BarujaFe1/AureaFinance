import * as XLSX from "xlsx";
import type { WorkBook } from "xlsx";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, creditCardBills, creditCards, importBatches, importIssues, importMappings, importRawRows, netWorthSummaries, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { isoMonth, nowTs, parseBrazilianDate } from "@/lib/dates";
import { repairMojibake, sanitizeText, normalizeLooseText } from "@/lib/text";
import { fromJson, slugify, toJson, uid } from "@/lib/utils";
import { normalizeBatchMeta, normalizeDryRunReport } from "@/lib/import-meta";
import type { BatchMeta, BatchSheetInventory, DryRunReport, ImportSheetTarget } from "@/types/domain";

const MONEY_AGGREGATE_ACCOUNT_NAME = "Saldo Bancos (Agregado)";

function normalizeHeader(value: string) {
  return normalizeLooseText(value).trim();
}

function isMoneyMonthlySheet(sheetName: string) {
  const normalized = normalizeHeader(sheetName);
  return normalized.includes("acompanhamento mensal");
}

function isMoneyTradeSheet(sheetName: string, headers: string[]) {
  const joined = `${normalizeHeader(sheetName)} ${headers.map(normalizeHeader).join(" ")}`;
  return joined.includes("transacoes") && (joined.includes("acao") || joined.includes("criptomoeda") || joined.includes("valor inicial"));
}

function inferTarget(headers: string[], sheetName: string): ImportSheetTarget {
  if (isMoneyMonthlySheet(sheetName)) return "transactions";
  if (isMoneyTradeSheet(sheetName, headers)) return "ignore";
  const joined = normalizeHeader(`${sheetName} ${headers.join(" ")}`);
  if (joined.includes("cart") && (joined.includes("fatura") || joined.includes("venc") || joined.includes("fechamento") || joined.includes("a pagar"))) return "card_bills";
  if (joined.includes("cart") && (joined.includes("limite") || joined.includes("bandeira") || joined.includes("fech"))) return "credit_cards";
  if (joined.includes("patrimonio") || joined.includes("invest") || joined.includes("reserva") || joined.includes("divida")) return "net_worth";
  if (joined.includes("saldo") || joined.includes("conta")) return "accounts";
  if (joined.includes("data") && (joined.includes("valor") || joined.includes("descr") || joined.includes("lanc") || joined.includes("transa"))) return "transactions";
  return "ignore";
}

function makeSyntheticHeaders(columnCount: number) {
  return Array.from({ length: columnCount }, (_, index) => `__col_${index}`);
}

function inventory(workbook: WorkBook): BatchSheetInventory[] {
  return workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json(workbook.Sheets[name], { header: 1, defval: null, raw: false }) as Array<Array<string | number | boolean | null>>;
    const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const headers = isMoneyMonthlySheet(name)
      ? makeSyntheticHeaders(columnCount)
      : (rows[0] ?? []).map((cell) => sanitizeText(cell)).filter(Boolean);
    const rowOffset = isMoneyMonthlySheet(name) ? 0 : 1;
    return { name, rowCount: Math.max(rows.length - rowOffset, 0), headers, suggestedTarget: inferTarget(headers, name) };
  });
}

function inferDefaultColumnMap(headers: string[], target: ImportSheetTarget, sheetName = "") {
  if (isMoneyMonthlySheet(sheetName)) {
    return {
      date: "__col_0",
      description: "__col_2",
      amount: "__col_3",
      direction: "__col_4",
      runningBalance: "__col_5",
      account: ""
    };
  }

  const normalizedHeaders = headers.map((header) => ({ raw: header, normalized: normalizeHeader(header) }));
  const pick = (...patterns: string[]) => normalizedHeaders.find((header) => patterns.some((pattern) => header.normalized.includes(pattern)))?.raw ?? "";

  switch (target) {
    case "accounts":
      return {
        name: pick("nome", "conta"),
        balance: pick("saldo", "valor"),
        type: pick("tipo"),
        institution: pick("instit", "banco"),
        includeInNetWorth: pick("patrimonio", "incluir")
      };
    case "transactions":
      return {
        description: pick("descricao", "descri", "nome", "historico"),
        amount: pick("valor", "amount"),
        date: pick("data", "date"),
        account: pick("conta", "account"),
        direction: pick("tipo", "direcao", "natureza"),
        counterparty: pick("favorecido", "contraparte", "counterparty"),
        notes: pick("obs", "nota")
      };
    case "credit_cards":
      return {
        name: pick("nome", "cartao"),
        brand: pick("bandeira", "brand"),
        network: pick("network"),
        limitAmount: pick("limite", "valor"),
        closeDay: pick("fech"),
        dueDay: pick("venc"),
        settlementAccount: pick("conta", "pagadora")
      };
    case "card_bills":
      return {
        cardName: pick("cartao", "card"),
        billMonth: pick("mes", "compet"),
        dueOn: pick("venc", "due"),
        closesOn: pick("fech"),
        totalAmount: pick("total", "valor"),
        paidAmount: pick("pago")
      };
    case "net_worth":
    case "investment_snapshots":
      return {
        month: pick("mes", "month", "compet"),
        reserves: pick("reserva"),
        investments: pick("invest"),
        debts: pick("divida", "debt"),
        notes: pick("obs", "nota")
      };
    default:
      return {};
  }
}

function getCell(payload: Record<string, unknown>, key: string): string | number | null | undefined {
  if (!key) return undefined;
  const value = payload[key];
  if (value == null) return undefined;
  if (typeof value === "string" || typeof value === "number") return value;
  if (typeof value === "boolean") return value ? "1" : "0";
  return undefined;
}

function toText(value: unknown) {
  return sanitizeText(value);
}

function toBoolean(value: unknown) {
  const normalized = toText(value).toLowerCase();
  return ["1", "true", "sim", "yes", "y", "ok", "x"].includes(normalized);
}

function normalizeTransactionDirection(value: unknown) {
  const normalized = normalizeLooseText(value);
  if (["r", "receita", "recebimento", "entrada", "income"].includes(normalized) || normalized.startsWith("rec")) return "income" as const;
  if (["transferencia entrada", "transfer in", "transfer_in"].includes(normalized)) return "transfer_in" as const;
  if (normalized.includes("transfer")) return "transfer_out" as const;
  return "expense" as const;
}

function normalizeDateText(value: unknown) {
  const text = toText(value);
  if (!text) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) return parseBrazilianDate(text).toISOString().slice(0, 10);
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function findAccountByLooseName(name: string) {
  const normalized = slugify(name);
  return db.select().from(accounts).all().find((item) => slugify(item.name) === normalized || item.slug === normalized) ?? null;
}

function ensureAggregateCashAccount(now = nowTs()) {
  const existing = findAccountByLooseName(MONEY_AGGREGATE_ACCOUNT_NAME);
  if (existing) return existing;
  const id = uid("acc");
  db.insert(accounts).values({
    id,
    name: MONEY_AGGREGATE_ACCOUNT_NAME,
    slug: slugify(MONEY_AGGREGATE_ACCOUNT_NAME),
    type: "checking",
    institution: "Money",
    openingBalanceCents: 0,
    color: "#5b7cfa",
    notes: "Conta sintética criada para consolidar lançamentos importados da aba Acompanhamento Mensal quando a planilha não explicita a conta pagadora.",
    includeInNetWorth: true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(accounts).where(eq(accounts.id, id)).get()!;
}

function buildTransactionSignature(input: {
  accountId: string | null;
  description: string;
  amountCents: number;
  occurredOn: string;
  direction: string;
}) {
  return [input.accountId ?? "", slugify(input.description), input.amountCents, input.occurredOn, input.direction].join("|");
}

export function listImportBatches() {
  return db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt);
}

export function getImportBatch(batchId: string) {
  const batch = db.select().from(importBatches).where(eq(importBatches.id, batchId)).get();
  if (!batch) return null;
  return {
    ...batch,
    meta: normalizeBatchMeta(fromJson<unknown>(batch.workbookSummaryJson, null)),
    dryRunReport: normalizeDryRunReport(fromJson<unknown>(batch.dryRunReportJson, null)),
    mappings: db.select().from(importMappings).all().filter((row) => row.batchId === batchId),
    issues: db.select().from(importIssues).all().filter((row) => row.batchId === batchId),
    rows: db.select().from(importRawRows).all().filter((row) => row.batchId === batchId)
  };
}

export async function ingestWorkbook(fileName: string, arrayBuffer: ArrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true, raw: false });
  const now = nowTs();
  const batchId = uid("batch");
  const sheets = inventory(workbook);
  const meta: BatchMeta = { sheets };
  db.insert(importBatches).values({
    id: batchId,
    filename: repairMojibake(fileName),
    status: "uploaded",
    workbookSummaryJson: toJson(meta),
    dryRunReportJson: null,
    createdAt: now,
    updatedAt: now
  }).run();

  for (const sheet of sheets) {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | boolean | null>>(workbook.Sheets[sheet.name], { header: 1, defval: null, raw: false });
    const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const isMoneyMonthly = isMoneyMonthlySheet(sheet.name);
    const headers = isMoneyMonthly ? makeSyntheticHeaders(columnCount) : (rows[0] ?? []).map((cell) => sanitizeText(cell));
    const startIndex = isMoneyMonthly ? 0 : 1;

    if (sheet.suggestedTarget !== "ignore") {
      const targetEntity: ImportSheetTarget = sheet.suggestedTarget ?? "ignore";
      db.insert(importMappings).values({
        id: uid("map"),
        batchId,
        sheetName: sheet.name,
        targetEntity,
        columnMapJson: toJson(inferDefaultColumnMap(headers, targetEntity, sheet.name)),
        optionsJson: toJson({ autoSuggested: true, isMoneyMonthly }),
        createdAt: now,
        updatedAt: now
      }).run();
    }

    for (let index = startIndex; index < rows.length; index += 1) {
      const row = rows[index] ?? [];
      if (!row || row.every((cell) => cell == null || sanitizeText(cell) === "")) continue;
      const payload: Record<string, unknown> = {};
      headers.forEach((header, headerIndex) => {
        if (!header) return;
        payload[header] = row[headerIndex] ?? null;
      });
      db.insert(importRawRows).values({
        id: uid("raw"),
        batchId,
        sheetName: sheet.name,
        rowNumber: index + 1,
        rowHash: JSON.stringify(payload),
        payloadJson: toJson(payload),
        validationStatus: "pending",
        createdAt: now
      }).run();
    }
  }

  return batchId;
}

export function saveSheetMapping(batchId: string, sheetName: string, targetEntity: ImportSheetTarget, columnMap: Record<string, string>) {
  const existing = db.select().from(importMappings).all().find((row) => row.batchId === batchId && row.sheetName === sheetName);
  const now = nowTs();
  if (existing) {
    db.update(importMappings).set({ targetEntity, columnMapJson: toJson(columnMap), updatedAt: now }).where(eq(importMappings.id, existing.id)).run();
    return existing.id;
  }
  const id = uid("map");
  db.insert(importMappings).values({
    id,
    batchId,
    sheetName,
    targetEntity,
    columnMapJson: toJson(columnMap),
    optionsJson: toJson({ autoSuggested: false }),
    createdAt: now,
    updatedAt: now
  }).run();
  return id;
}

function addIssue(batchId: string, rawRowId: string | null, sheetName: string, severity: "error" | "warning", issueCode: string, message: string) {
  db.insert(importIssues).values({ id: uid("issue"), batchId, rawRowId, sheetName, severity, issueCode, message: repairMojibake(message), createdAt: nowTs() }).run();
}

export function validateBatch(batchId: string) {
  db.select().from(importIssues).all().filter((row) => row.batchId === batchId).forEach((row) => {
    db.delete(importIssues).where(eq(importIssues.id, row.id)).run();
  });

  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote não encontrado.");

  const summary: DryRunReport["summary"] = { accounts: 0, transactions: 0, creditCards: 0, purchases: 0, installments: 0, issues: 0 };
  const warnings: string[] = [];

  for (const mapping of batch.mappings) {
    const rows = batch.rows.filter((row) => row.sheetName === mapping.sheetName);
    const map = fromJson<Record<string, string>>(mapping.columnMapJson, {});
    if (Object.keys(map).length === 0) {
      warnings.push(`A aba ${mapping.sheetName} ainda está sem mapeamento.`);
      continue;
    }

    for (const row of rows) {
      const payload = fromJson<Record<string, unknown>>(row.payloadJson, {});
      if (mapping.targetEntity === "accounts") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "account_missing_name", `Linha ${row.rowNumber}: nome da conta ausente.`);
        } else summary.accounts += 1;
      }

      if (mapping.targetEntity === "transactions") {
        const description = toText(getCell(payload, map.description ?? ""));
        const amount = toText(getCell(payload, map.amount ?? ""));
        const date = normalizeDateText(getCell(payload, map.date ?? ""));
        const isMoneyMonthly = isMoneyMonthlySheet(mapping.sheetName);
        if ((isMoneyMonthly && (!date || !amount)) || (!isMoneyMonthly && (!description || !amount || !date))) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "transaction_missing_required", `Linha ${row.rowNumber}: faltam descrição, valor ou data.`);
        } else summary.transactions += 1;
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "card_missing_name", `Linha ${row.rowNumber}: nome do cartão ausente.`);
        } else summary.creditCards += 1;
      }

      if (mapping.targetEntity === "card_bills") {
        const cardName = toText(getCell(payload, map.cardName ?? ""));
        const dueOn = normalizeDateText(getCell(payload, map.dueOn ?? ""));
        if (!cardName || !dueOn) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "warning", "bill_missing_required", `Linha ${row.rowNumber}: faltam cartão ou vencimento.`);
        } else summary.installments += 1;
      }
    }
  }

  const report: DryRunReport = { summary, warnings };
  db.update(importBatches).set({ status: summary.issues > 0 ? "validated_with_issues" : "validated", dryRunReportJson: toJson(report), updatedAt: nowTs() }).where(eq(importBatches.id, batchId)).run();
  return report;
}

export function commitBatch(batchId: string, dryRun = false) {
  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote não encontrado.");
  const now = nowTs();
  const report = validateBatch(batchId);
  if (dryRun) return report;

  const existingTxnSignatures = new Set(
    db.select().from(transactions).all().map((item) => buildTransactionSignature({
      accountId: item.accountId ?? null,
      description: item.description,
      amountCents: item.amountCents,
      occurredOn: item.occurredOn,
      direction: item.direction
    }))
  );

  for (const mapping of batch.mappings) {
    const rows = batch.rows.filter((row) => row.sheetName === mapping.sheetName);
    const map = fromJson<Record<string, string>>(mapping.columnMapJson, {});

    for (const row of rows) {
      const payload = fromJson<Record<string, unknown>>(row.payloadJson, {});

      if (mapping.targetEntity === "accounts") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) continue;
        const slug = slugify(name);
        const existing = db.select().from(accounts).where(eq(accounts.slug, slug)).get();
        const accountPayload = {
          name,
          slug,
          type: toText(getCell(payload, map.type ?? "")) || "checking",
          institution: toText(getCell(payload, map.institution ?? "")),
          openingBalanceCents: parseCurrencyToCents(getCell(payload, map.balance ?? "") ?? 0),
          color: "#5b7cfa",
          notes: "Importado de workbook externo.",
          includeInNetWorth: map.includeInNetWorth ? toBoolean(getCell(payload, map.includeInNetWorth)) : true,
          isArchived: false,
          sortOrder: now,
          updatedAt: now
        };
        if (existing) db.update(accounts).set(accountPayload).where(eq(accounts.id, existing.id)).run();
        else db.insert(accounts).values({ id: uid("acc"), ...accountPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "transactions") {
        const isMoneyMonthly = isMoneyMonthlySheet(mapping.sheetName);
        const occurredOn = normalizeDateText(getCell(payload, map.date ?? ""));
        const amountCents = parseCurrencyToCents(getCell(payload, map.amount ?? "") ?? 0);
        if (!occurredOn || amountCents === 0) continue;

        const description = isMoneyMonthly
          ? toText(getCell(payload, map.description ?? "")) || "Lançamento importado da Money"
          : toText(getCell(payload, map.description ?? ""));
        if (!description) continue;

        const mappedAccountName = toText(getCell(payload, map.account ?? ""));
        const account = mappedAccountName ? findAccountByLooseName(mappedAccountName) : ensureAggregateCashAccount(now);
        const accountId = account?.id ?? ensureAggregateCashAccount(now).id;
        const direction = normalizeTransactionDirection(getCell(payload, map.direction ?? ""));
        const occurredMonth = isoMonth(occurredOn);
        const signature = buildTransactionSignature({ accountId, description, amountCents, occurredOn, direction });
        if (existingTxnSignatures.has(signature)) continue;

        db.insert(transactions).values({
          id: uid("txn"),
          accountId,
          categoryId: null,
          subcategoryId: null,
          transferId: null,
          recurringOccurrenceId: null,
          sourceImportRowId: row.id,
          direction,
          status: "posted",
          description,
          counterparty: toText(getCell(payload, map.counterparty ?? "")),
          amountCents,
          occurredOn,
          dueOn: occurredOn,
          competenceMonth: occurredMonth,
          notes: isMoneyMonthly
            ? "Importado automaticamente da aba Acompanhamento Mensal da Money."
            : toText(getCell(payload, map.notes ?? "")) || `Importado do lote ${batch.filename}.`,
          isProjected: false,
          createdAt: now,
          updatedAt: now
        }).run();
        existingTxnSignatures.add(signature);
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) continue;
        const cardSlug = slugify(name);
        const existing = db.select().from(creditCards).all().find((item) => item.slug === cardSlug || slugify(item.name) === cardSlug);
        const settlementAccountName = toText(getCell(payload, map.settlementAccount ?? ""));
        const settlementAccount = settlementAccountName ? findAccountByLooseName(settlementAccountName) : null;
        if (!settlementAccount) continue;
        const cardPayload = {
          name,
          slug: cardSlug,
          brand: toText(getCell(payload, map.brand ?? "")),
          network: toText(getCell(payload, map.network ?? "")),
          limitTotalCents: parseCurrencyToCents(getCell(payload, map.limitAmount ?? "") ?? 0),
          closeDay: Number(getCell(payload, map.closeDay ?? "") ?? 8),
          dueDay: Number(getCell(payload, map.dueDay ?? "") ?? 15),
          settlementAccountId: settlementAccount.id,
          color: "#111827",
          isArchived: false,
          updatedAt: now
        };
        if (existing) db.update(creditCards).set(cardPayload).where(eq(creditCards.id, existing.id)).run();
        else db.insert(creditCards).values({ id: uid("card"), ...cardPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "card_bills") {
        const cardName = toText(getCell(payload, map.cardName ?? ""));
        const card = db.select().from(creditCards).all().find((item) => slugify(item.name) === slugify(cardName) || item.slug === slugify(cardName));
        if (!card) continue;
        const dueOn = normalizeDateText(getCell(payload, map.dueOn ?? "")) || `${new Date().toISOString().slice(0, 7)}-15`;
        const billMonth = toText(getCell(payload, map.billMonth ?? "")) || isoMonth(dueOn);
        const existing = db.select().from(creditCardBills).all().find((item) => item.creditCardId === card.id && item.billMonth === billMonth);
        const billPayload = {
          creditCardId: card.id,
          billMonth,
          closesOn: normalizeDateText(getCell(payload, map.closesOn ?? "")) || `${billMonth}-08`,
          dueOn,
          totalAmountCents: parseCurrencyToCents(getCell(payload, map.totalAmount ?? "") ?? 0),
          paidAmountCents: parseCurrencyToCents(getCell(payload, map.paidAmount ?? "") ?? 0),
          status: "open" as const,
          settlementTransactionId: null,
          updatedAt: now
        };
        if (existing) db.update(creditCardBills).set(billPayload).where(eq(creditCardBills.id, existing.id)).run();
        else db.insert(creditCardBills).values({ id: uid("bill"), ...billPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "net_worth" || mapping.targetEntity === "investment_snapshots") {
        const month = toText(getCell(payload, map.month ?? "")) || new Date().toISOString().slice(0, 7);
        const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, month)).get();
        const snapshot = {
          month,
          reservesCents: parseCurrencyToCents(getCell(payload, map.reserves ?? "") ?? 0),
          investmentsCents: parseCurrencyToCents(getCell(payload, map.investments ?? "") ?? 0),
          debtsCents: parseCurrencyToCents(getCell(payload, map.debts ?? "") ?? 0),
          notes: toText(getCell(payload, map.notes ?? "")) || `Importado do lote ${batch.filename}.`,
          source: "import",
          updatedAt: now
        };
        if (existing) db.update(netWorthSummaries).set(snapshot).where(eq(netWorthSummaries.id, existing.id)).run();
        else db.insert(netWorthSummaries).values({ id: uid("nw"), ...snapshot, createdAt: now }).run();
      }
    }
  }

  db.update(importBatches).set({ status: "committed", updatedAt: now }).where(eq(importBatches.id, batchId)).run();
  return report;
}
