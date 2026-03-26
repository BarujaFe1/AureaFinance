import * as XLSX from "xlsx";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, creditCardBills, creditCards, importBatches, importIssues, importMappings, importRawRows, netWorthSummaries, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { isoMonth, nowTs } from "@/lib/dates";
import { fromJson, slugify, toJson, uid } from "@/lib/utils";
import type { BatchMeta, BatchSheetInventory, DryRunReport, ImportSheetTarget } from "@/types/domain";

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function inferTarget(headers: string[], sheetName: string): ImportSheetTarget {
  const joined = `${sheetName} ${headers.join(" ")}`.toLowerCase();
  if (joined.includes("cart") && (joined.includes("fatura") || joined.includes("venc") || joined.includes("fechamento"))) return "card_bills";
  if (joined.includes("cart") && (joined.includes("limite") || joined.includes("bandeira") || joined.includes("fech"))) return "credit_cards";
  if (joined.includes("patrimonio") || joined.includes("invest") || joined.includes("reserva") || joined.includes("divida")) return "net_worth";
  if (joined.includes("saldo") || joined.includes("conta")) return "accounts";
  if (joined.includes("data") && (joined.includes("valor") || joined.includes("descr") || joined.includes("transa"))) return "transactions";
  return "ignore";
}

function inventory(workbook: XLSX.WorkBook): BatchSheetInventory[] {
  return workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | boolean | null>>(workbook.Sheets[name], { header: 1, defval: null, raw: false });
    const headers = (rows[0] ?? []).map((cell) => String(cell ?? "").trim()).filter(Boolean);
    return { name, rowCount: Math.max(rows.length - 1, 0), headers, suggestedTarget: inferTarget(headers, name) };
  });
}

function inferDefaultColumnMap(headers: string[], target: ImportSheetTarget) {
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
        description: pick("descricao", "descri", "nome"),
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

function getCell(payload: Record<string, unknown>, key: string) {
  return key ? payload[key] : undefined;
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function toBoolean(value: unknown) {
  const normalized = toText(value).toLowerCase();
  return ["1", "true", "sim", "yes", "y", "ok", "x"].includes(normalized);
}

export function listImportBatches() {
  return db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt);
}

export function getImportBatch(batchId: string) {
  const batch = db.select().from(importBatches).where(eq(importBatches.id, batchId)).get();
  if (!batch) return null;
  return {
    ...batch,
    meta: fromJson<BatchMeta>(batch.workbookSummaryJson, { sheets: [] }),
    dryRunReport: fromJson<DryRunReport | null>(batch.dryRunReportJson, null),
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
    filename: fileName,
    status: "uploaded",
    workbookSummaryJson: toJson(meta),
    dryRunReportJson: null,
    createdAt: now,
    updatedAt: now
  }).run();

  for (const sheet of sheets) {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | boolean | null>>(workbook.Sheets[sheet.name], { header: 1, defval: null, raw: false });
    const headers = (rows[0] ?? []).map((cell) => String(cell ?? "").trim());
    if (sheet.suggestedTarget !== "ignore") {
      db.insert(importMappings).values({
        id: uid("map"),
        batchId,
        sheetName: sheet.name,
        targetEntity: sheet.suggestedTarget,
        columnMapJson: toJson(inferDefaultColumnMap(headers, sheet.suggestedTarget)),
        optionsJson: toJson({ autoSuggested: true }),
        createdAt: now,
        updatedAt: now
      }).run();
    }

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index];
      if (!row || row.every((cell) => cell == null || String(cell).trim() === "")) continue;
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
  db.insert(importIssues).values({ id: uid("issue"), batchId, rawRowId, sheetName, severity, issueCode, message, createdAt: nowTs() }).run();
}

export function validateBatch(batchId: string) {
  db.select().from(importIssues).all().filter((row) => row.batchId === batchId).forEach((row) => {
    db.delete(importIssues).where(eq(importIssues.id, row.id)).run();
  });

  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote nÃ£o encontrado.");

  const summary: DryRunReport["summary"] = { accounts: 0, transactions: 0, creditCards: 0, purchases: 0, installments: 0, issues: 0 };
  const warnings: string[] = [];

  for (const mapping of batch.mappings) {
    const rows = batch.rows.filter((row) => row.sheetName === mapping.sheetName);
    const map = fromJson<Record<string, string>>(mapping.columnMapJson, {});
    if (Object.keys(map).length === 0) {
      warnings.push(`A aba ${mapping.sheetName} ainda estÃ¡ sem mapeamento.`);
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
        const date = toText(getCell(payload, map.date ?? ""));
        if (!description || !amount || !date) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "transaction_missing_required", `Linha ${row.rowNumber}: faltam descriÃ§Ã£o, valor ou data.`);
        } else summary.transactions += 1;
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "credit_card_missing_name", `Linha ${row.rowNumber}: nome do cartÃ£o ausente.`);
        } else summary.creditCards += 1;
      }

      if (mapping.targetEntity === "card_bills") {
        const dueOn = toText(getCell(payload, map.dueOn ?? ""));
        const totalAmount = toText(getCell(payload, map.totalAmount ?? ""));
        if (!dueOn || !totalAmount) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "warning", "card_bill_incomplete", `Linha ${row.rowNumber}: revisar vencimento ou valor total da fatura.`);
        } else summary.installments += 1;
      }

      if (mapping.targetEntity === "net_worth" || mapping.targetEntity === "investment_snapshots") {
        const month = toText(getCell(payload, map.month ?? ""));
        if (!month) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "warning", "net_worth_missing_month", `Linha ${row.rowNumber}: competÃªncia do patrimÃ´nio nÃ£o identificada.`);
        }
      }
    }
  }

  const report: DryRunReport = { summary, warnings };
  db.update(importBatches).set({ dryRunReportJson: toJson(report), status: summary.issues > 0 ? "validated_with_issues" : "validated", updatedAt: nowTs() }).where(eq(importBatches.id, batchId)).run();
  return report;
}

export function commitBatch(batchId: string, dryRun = false) {
  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote nÃ£o encontrado.");
  const report = validateBatch(batchId);
  if (dryRun) return report;
  if (report.summary.issues > 0) throw new Error("Corrija os problemas crÃ­ticos antes de confirmar a importaÃ§Ã£o.");
  const now = nowTs();

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
          notes: `Importado do lote ${batch.filename}.`,
          includeInNetWorth: map.includeInNetWorth ? toBoolean(getCell(payload, map.includeInNetWorth)) : true,
          isArchived: false,
          sortOrder: now,
          updatedAt: now
        };
        if (existing) {
          db.update(accounts).set(accountPayload).where(eq(accounts.id, existing.id)).run();
        } else {
          db.insert(accounts).values({ id: uid("acc"), ...accountPayload, createdAt: now }).run();
        }
      }

      if (mapping.targetEntity === "transactions") {
        const description = toText(getCell(payload, map.description ?? ""));
        if (!description) continue;
        const accountName = toText(getCell(payload, map.account ?? ""));
        const account = db.select().from(accounts).all().find((item) => item.name === accountName || item.slug === slugify(accountName));
        const date = toText(getCell(payload, map.date ?? "")) || new Date().toISOString().slice(0, 10);
        const rawDirection = toText(getCell(payload, map.direction ?? "")).toLowerCase();
        const direction = rawDirection.startsWith("r") || rawDirection.includes("rece") ? "income" : rawDirection.includes("transfer") ? "transfer_out" : "expense";
        db.insert(transactions).values({
          id: uid("txn"),
          accountId: account?.id ?? null,
          categoryId: null,
          subcategoryId: null,
          transferId: null,
          recurringOccurrenceId: null,
          sourceImportRowId: row.id,
          direction,
          status: "posted",
          description,
          counterparty: toText(getCell(payload, map.counterparty ?? "")),
          amountCents: parseCurrencyToCents(getCell(payload, map.amount ?? "") ?? 0),
          occurredOn: date,
          dueOn: date,
          competenceMonth: isoMonth(date),
          notes: toText(getCell(payload, map.notes ?? "")) || `Importado do lote ${batch.filename}.`,
          isProjected: false,
          createdAt: now,
          updatedAt: now
        }).run();
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) continue;
        const settlementName = toText(getCell(payload, map.settlementAccount ?? ""));
        const settlementAccount = db.select().from(accounts).all().find((item) => item.name === settlementName || item.slug === slugify(settlementName));
        if (!settlementAccount) continue;
        const slug = slugify(name);
        const existing = db.select().from(creditCards).where(eq(creditCards.slug, slug)).get();
        const cardPayload = {
          name,
          slug,
          brand: toText(getCell(payload, map.brand ?? "")),
          network: toText(getCell(payload, map.network ?? "")),
          settlementAccountId: settlementAccount.id,
          limitTotalCents: parseCurrencyToCents(getCell(payload, map.limitAmount ?? "") ?? 0),
          closeDay: Number(toText(getCell(payload, map.closeDay ?? "")) || 8),
          dueDay: Number(toText(getCell(payload, map.dueDay ?? "")) || 15),
          color: "#111827",
          isArchived: false,
          updatedAt: now
        };
        if (existing) db.update(creditCards).set(cardPayload).where(eq(creditCards.id, existing.id)).run();
        else db.insert(creditCards).values({ id: uid("card"), ...cardPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "card_bills") {
        const cardName = toText(getCell(payload, map.cardName ?? ""));
        const card = db.select().from(creditCards).all().find((item) => item.name === cardName || item.slug === slugify(cardName));
        if (!card) continue;
        const billMonth = toText(getCell(payload, map.billMonth ?? "")) || isoMonth(toText(getCell(payload, map.dueOn ?? "")) || new Date().toISOString().slice(0, 10));
        const existing = db.select().from(creditCardBills).all().find((item) => item.creditCardId === card.id && item.billMonth === billMonth);
        const billPayload = {
          creditCardId: card.id,
          billMonth,
          closesOn: toText(getCell(payload, map.closesOn ?? "")) || `${billMonth}-08`,
          dueOn: toText(getCell(payload, map.dueOn ?? "")) || `${billMonth}-15`,
          totalAmountCents: parseCurrencyToCents(getCell(payload, map.totalAmount ?? "") ?? 0),
          paidAmountCents: parseCurrencyToCents(getCell(payload, map.paidAmount ?? "") ?? 0),
          status: "open",
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
