import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, sqlite } from "@/db/client";
import {
  accounts,
  assetTrades,
  billEntries,
  cardInstallments,
  cardPurchases,
  creditCardBills,
  creditCards,
  cryptoPositions,
  netWorthSnapshots,
  netWorthSummaries,
  recurringRules,
  reserves,
  stockPositions,
  transactions
} from "@/db/schema";
import { parseCurrencyToCents, toSafeCents } from "@/lib/currency";
import { addMonthsIso, isoMonth, nowTs, todayIso } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";

export type ImportLogger = (message: string) => void;

export type ImportFileResult = {
  fileName: string;
  linesProcessed: number;
  linesWithError: number;
  status: "success" | "partial" | "error" | "skipped";
  errors: string[];
};

export type ImportRunResult = {
  success: boolean;
  files: ImportFileResult[];
  summary: Record<string, number>;
  error?: string;
};

const EXPECTED_FILES = [
  "contas.csv",
  "reservas.csv",
  "acoes.csv",
  "criptomoedas.csv",
  "parcelas_cartao.csv",
  "faturas_futuras.csv",
  "transacoes_historicas.csv",
  "registro_diario.csv",
  "operacoes_ativos.csv"
] as const;

const accountRowSchema = z.object({
  banco: z.string().min(1),
  tipo_conta: z.string().min(1),
  saldo_atual_centavos: z.string().min(1),
  produto_investimento: z.string().optional().default(""),
  cor_hex: z.string().optional().default("#6b7280")
});

const reserveRowSchema = z.object({
  nome: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  lucro_total_centavos: z.string(),
  rendimento_total_percentual: z.string().optional().default(""),
  lucro_mensal_centavos: z.string().optional().default("0"),
  rendimento_mensal_percentual: z.string().optional().default("")
});

const stockRowSchema = z.object({
  ticker: z.string().min(1),
  nome_completo: z.string().min(1),
  quantidade: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  resultado_total_centavos: z.string().optional().default("0"),
  rentabilidade_total_percentual: z.string().optional().default("")
});

const cryptoRowSchema = z.object({
  nome: z.string().min(1),
  quantidade: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  lucro_total_centavos: z.string().optional().default("0")
});

const installmentRowSchema = z.object({
  cartao: z.enum(["nubank", "mercadopago"]),
  data_vencimento_iso: z.string().min(10),
  descricao_compra: z.string().min(1),
  valor_parcela_centavos: z.string().min(1),
  numero_parcela: z.string().optional().default(""),
  total_parcelas: z.string().optional().default(""),
  tipo: z.enum(["recorrente", "parcelado"]),
  responsavel: z.string().optional().default("")
});

const billRowSchema = z.object({
  cartao: z.enum(["nubank", "mercadopago"]),
  data_vencimento_iso: z.string().min(10),
  valor_total_centavos: z.string().min(1)
});

const transactionRowSchema = z.object({
  data_iso: z.string().min(10),
  conta: z.string().min(1),
  descricao: z.string().min(1),
  valor_centavos: z.string().min(1),
  tipo: z.enum(["receita", "despesa", "transferencia"]),
  saldo_apos_centavos: z.string().min(1)
});

const snapshotRowSchema = z.object({
  data_iso: z.string().min(10),
  saldo_conta_centavos: z.string().min(1),
  investimento_1_centavos: z.string().min(1),
  investimento_2_centavos: z.string().min(1),
  patrimonio_total_centavos: z.string().min(1),
  tipo_variacao: z.string().optional().default("")
});

const tradeRowSchema = z.object({
  action: z.enum(["compra", "venda"]),
  asset_name: z.string().min(1),
  quantity: z.string().min(1),
  trade_date: z.string().min(10),
  total_initial_cents: z.string().min(1),
  price_per_unit_initial_cents: z.string().min(1),
  total_current_cents: z.string().min(1),
  price_per_unit_current_cents: z.string().min(1),
  yield_percent: z.string().optional().default(""),
  description_text: z.string().optional().default(""),
  is_completed: z.string().optional().default("1")
});

function inferAccountPresentation(bank: string, type: string) {
  const normalized = slugify(type);
  if (normalized.includes("conta-corrente")) {
    return {
      name: `${bank} CC`,
      slug: slugify(`${bank}-cc`),
      type: "checking"
    };
  }
  if (normalized.includes("fundos-investimento") || normalized.includes("investimento")) {
    return {
      name: `${bank} Investimentos`,
      slug: slugify(`${bank}-investimentos`),
      type: "investment"
    };
  }
  return {
    name: `${bank} ${type}`,
    slug: slugify(`${bank}-${type}`),
    type: "checking"
  };
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

function rowsToObjects<T extends Record<string, string>>(text: string) {
  const rows = parseCsv(text);
  if (!rows.length) return [] as T[];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, (row[index] ?? "").trim()])) as T);
}

function humanSummaryKey(fileName: string) {
  return fileName
    .replace(".csv", "")
    .replace(/_/g, " ");
}

function ensureCreditCard(cardKey: "nubank" | "mercadopago") {
  const wanted = cardKey === "nubank"
    ? { name: "Nubank", slug: "nubank", closeDay: 18, dueDay: 25, color: "#9900ff" }
    : { name: "MercadoPago", slug: "mercadopago", closeDay: 8, dueDay: 15, color: "#00bbfe" };
  const existing = db.select().from(creditCards).where(eq(creditCards.slug, wanted.slug)).get();
  if (existing) return existing;

  const settlement = getOrCreateSettlementAccount(cardKey);
  const now = nowTs();
  const id = uid("card");
  db.insert(creditCards).values({
    id,
    name: wanted.name,
    slug: wanted.slug,
    brand: wanted.name,
    network: wanted.name,
    settlementAccountId: settlement.id,
    limitTotalCents: 0,
    closeDay: wanted.closeDay,
    dueDay: wanted.dueDay,
    color: wanted.color,
    isArchived: false,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCards).where(eq(creditCards.id, id)).get()!;
}

function getOrCreateSettlementAccount(cardKey: "nubank" | "mercadopago") {
  const targetBank = cardKey === "nubank" ? "NuBank" : "MercadoPago";
  const existing = db.select().from(accounts).all().find((row) => row.name === `${targetBank} CC` || (row.institution === targetBank && row.type === "checking"));
  if (existing) return existing;
  const now = nowTs();
  const id = uid("acc");
  db.insert(accounts).values({
    id,
    name: `${targetBank} CC`,
    slug: slugify(`${targetBank}-cc`),
    type: "checking",
    institution: targetBank,
    openingBalanceCents: 0,
    color: cardKey === "nubank" ? "#9900ff" : "#00bbfe",
    notes: "Conta criada automaticamente para liquidar faturas importadas.",
    includeInNetWorth: true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(accounts).where(eq(accounts.id, id)).get()!;
}

function findAccountByLabel(label: string) {
  const normalized = slugify(label);
  const allAccounts = db.select().from(accounts).all();
  return allAccounts.find((row) => slugify(row.name) === normalized)
    || allAccounts.find((row) => slugify(row.institution) === normalized && row.type === "checking")
    || allAccounts.find((row) => (row.notes || "").toLowerCase().includes(label.toLowerCase()))
    || allAccounts[0]
    || null;
}

function ensureBill(cardId: string, dueOn: string, closeDay: number, amountCents = 0) {
  const billMonth = isoMonth(dueOn);
  const closesOn = `${billMonth}-${String(closeDay).padStart(2, "0")}`;
  const existing = db.select().from(creditCardBills).all().find((row) => row.creditCardId === cardId && row.dueOn === dueOn);
  const now = nowTs();
  if (existing) {
    if (amountCents > 0) {
      db.update(creditCardBills)
        .set({ totalAmountCents: Math.max(existing.totalAmountCents, amountCents), updatedAt: now })
        .where(eq(creditCardBills.id, existing.id))
        .run();
    }
    return db.select().from(creditCardBills).where(eq(creditCardBills.id, existing.id)).get()!;
  }
  const id = uid("bill");
  db.insert(creditCardBills).values({
    id,
    creditCardId: cardId,
    billMonth,
    closesOn,
    dueOn,
    totalAmountCents: amountCents,
    paidAmountCents: 0,
    status: "open",
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCardBills).where(eq(creditCardBills.id, id)).get()!;
}

function upsertMonthlySummaryFromSnapshot(dateIso: string, totalCents: number) {
  const month = isoMonth(dateIso);
  const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, month)).get();
  const now = nowTs();
  if (existing) {
    db.update(netWorthSummaries)
      .set({ investmentsCents: Math.max(existing.investmentsCents, totalCents), updatedAt: now, source: "import" })
      .where(eq(netWorthSummaries.id, existing.id))
      .run();
    return;
  }
  db.insert(netWorthSummaries).values({
    id: uid("nw"),
    month,
    reservesCents: 0,
    investmentsCents: totalCents,
    debtsCents: 0,
    notes: "Resumo mensal derivado do registro diário importado.",
    source: "import",
    createdAt: now,
    updatedAt: now
  }).run();
}

function firstBusinessDayAfter12(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 13);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}

export async function importCsvContents(files: { name: string; content: string }[], logger?: ImportLogger): Promise<ImportRunResult> {
  const started = Date.now();
  const normalizedFiles = files.filter((file) => EXPECTED_FILES.includes(file.name as any));
  const fileMap = new Map(normalizedFiles.map((file) => [file.name, file.content]));
  const results: ImportFileResult[] = [];
  const summary: Record<string, number> = {
    contas: 0,
    reservas: 0,
    acoes: 0,
    criptomoedas: 0,
    parcelas_cartao: 0,
    faturas_futuras: 0,
    transacoes_historicas: 0,
    duplicatas_transacoes: 0,
    operacoes_ativos: 0,
    registro_diario: 0,
    erros: 0
  };

  const processFile = (fileName: string, handler: (text: string, result: ImportFileResult) => void) => {
    const text = fileMap.get(fileName);
    if (!text) return;
    const result: ImportFileResult = { fileName, linesProcessed: 0, linesWithError: 0, status: "success", errors: [] };
    try {
      const tx = sqlite.transaction(() => {
        handler(text, result);
      });
      tx();
      result.status = result.linesWithError > 0 ? "partial" : "success";
    } catch (error) {
      result.status = "error";
      result.errors.push(error instanceof Error ? error.message : "Erro desconhecido");
      summary.erros += 1;
    }
    results.push(result);
  };

  processFile("contas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando contas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = accountRowSchema.parse(raw);
        const preset = inferAccountPresentation(row.banco, row.tipo_conta);
        const existing = db.select().from(accounts).where(eq(accounts.slug, preset.slug)).get();
        const now = nowTs();
        const payload = {
          name: preset.name,
          slug: preset.slug,
          type: preset.type,
          institution: row.banco,
          openingBalanceCents: toSafeCents(row.saldo_atual_centavos),
          color: row.cor_hex || "#6b7280",
          notes: row.produto_investimento ? `Produto vinculado: ${row.produto_investimento}` : "",
          includeInNetWorth: true,
          isArchived: false,
          sortOrder: now,
          updatedAt: now
        };
        if (existing) {
          db.update(accounts).set(payload).where(eq(accounts.id, existing.id)).run();
        } else {
          db.insert(accounts).values({ id: uid("acc"), ...payload, createdAt: now }).run();
        }
        result.linesProcessed += 1;
        summary.contas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("reservas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando reservas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = reserveRowSchema.parse(raw);
        const existing = db.select().from(reserves).where(eq(reserves.name, row.nome)).get();
        const payload = {
          name: row.nome,
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousValueCents: toSafeCents(row.valor_anterior_centavos),
          currentValueCents: toSafeCents(row.valor_atual_centavos),
          totalProfitCents: toSafeCents(row.lucro_total_centavos),
          yieldTotalPercent: row.rendimento_total_percentual ? Number(String(row.rendimento_total_percentual).replace(",", ".")) : null,
          monthlyProfitCents: toSafeCents(row.lucro_mensal_centavos),
          yieldMonthlyPercent: row.rendimento_mensal_percentual ? Number(String(row.rendimento_mensal_percentual).replace(",", ".")) : null,
          accountId: null,
          updatedAt: nowTs()
        };
        if (existing) db.update(reserves).set(payload).where(eq(reserves.id, existing.id)).run();
        else db.insert(reserves).values({ id: uid("res"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.reservas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("acoes.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando acoes.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = stockRowSchema.parse(raw);
        const existing = db.select().from(stockPositions).where(eq(stockPositions.ticker, row.ticker)).get();
        const payload = {
          ticker: row.ticker,
          fullName: row.nome_completo,
          quantity: Number(row.quantidade || 0),
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousCents: toSafeCents(row.valor_anterior_centavos),
          currentCents: toSafeCents(row.valor_atual_centavos),
          resultTotalCents: toSafeCents(row.resultado_total_centavos),
          rentabilityTotalPercent: row.rentabilidade_total_percentual ? Number(String(row.rentabilidade_total_percentual).replace(",", ".")) : null,
          updatedAt: nowTs()
        };
        if (existing) db.update(stockPositions).set(payload).where(eq(stockPositions.id, existing.id)).run();
        else db.insert(stockPositions).values({ id: uid("stk"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.acoes += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("criptomoedas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando criptomoedas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = cryptoRowSchema.parse(raw);
        const existing = db.select().from(cryptoPositions).where(eq(cryptoPositions.name, row.nome)).get();
        const payload = {
          name: row.nome,
          quantity: Number(String(row.quantidade).replace(",", ".")),
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousCents: toSafeCents(row.valor_anterior_centavos),
          currentCents: toSafeCents(row.valor_atual_centavos),
          totalProfitCents: toSafeCents(row.lucro_total_centavos),
          updatedAt: nowTs()
        };
        if (existing) db.update(cryptoPositions).set(payload).where(eq(cryptoPositions.id, existing.id)).run();
        else db.insert(cryptoPositions).values({ id: uid("cry"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.criptomoedas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("parcelas_cartao.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando parcelas_cartao.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = installmentRowSchema.parse(raw);
        const card = ensureCreditCard(row.cartao);
        if (row.tipo === "recorrente") {
          const title = row.descricao_compra;
          const existingRule = db.select().from(recurringRules).all().find((rule) => rule.title === title && rule.accountId === card.settlementAccountId);
          if (!existingRule) {
            db.insert(recurringRules).values({
              id: uid("rr"),
              accountId: card.settlementAccountId,
              categoryId: null,
              title,
              direction: "expense",
              frequency: "monthly",
              amountCents: toSafeCents(row.valor_parcela_centavos),
              startsOn: row.data_vencimento_iso,
              endsOn: null,
              nextRunOn: row.data_vencimento_iso,
              autoPost: false,
              notes: `Importado de ${card.name}.`,
              isActive: true,
              createdAt: nowTs(),
              updatedAt: nowTs()
            }).run();
          }
          result.linesProcessed += 1;
          summary.parcelas_cartao += 1;
          return;
        }

        const currentInstallment = Number(row.numero_parcela || 1);
        const totalInstallments = Number(row.total_parcelas || currentInstallment || 1);
        const purchaseKey = `${card.id}|${row.descricao_compra}|${row.data_vencimento_iso}|${currentInstallment}`;
        const existingPurchase = db.select().from(cardPurchases).all().find((purchase) => `${purchase.creditCardId}|${purchase.description}|${purchase.purchaseDate}|${purchase.installmentCount}` === purchaseKey);
        const purchaseId = existingPurchase?.id ?? uid("purchase");
        if (!existingPurchase) {
          const totalAmountCents = toSafeCents(row.valor_parcela_centavos) * Math.max(totalInstallments, 1);
          db.insert(cardPurchases).values({
            id: purchaseId,
            creditCardId: card.id,
            categoryId: null,
            subcategoryId: null,
            firstBillId: null,
            description: row.descricao_compra,
            merchant: row.descricao_compra,
            purchaseDate: row.data_vencimento_iso,
            totalAmountCents,
            installmentCount: totalInstallments,
            notes: `Importado do cronograma do cartão ${card.name}.`,
            purchaseType: "parcelado",
            responsible: row.responsavel,
            createdAt: nowTs(),
            updatedAt: nowTs()
          }).run();
        }

        for (let number = currentInstallment; number <= totalInstallments; number++) {
          const dueOn = addMonthsIso(row.data_vencimento_iso, number - currentInstallment);
          const bill = ensureBill(card.id, dueOn, card.closeDay);
          const existingInstallment = db.select().from(cardInstallments).all().find((item) => item.purchaseId === purchaseId && item.installmentNumber === number);
          if (!existingInstallment) {
            const installmentId = uid("inst");
            db.insert(cardInstallments).values({
              id: installmentId,
              purchaseId,
              billId: bill.id,
              installmentNumber: number,
              totalInstallments,
              amountCents: toSafeCents(row.valor_parcela_centavos),
              status: "billed",
              dueOn,
              createdAt: nowTs()
            }).run();
            db.insert(billEntries).values({
              id: uid("entry"),
              billId: bill.id,
              entryType: "installment",
              description: `${row.descricao_compra} (${number}/${totalInstallments})`,
              amountCents: toSafeCents(row.valor_parcela_centavos),
              purchaseId,
              installmentId,
              createdAt: nowTs()
            }).run();
            db.update(creditCardBills)
              .set({ totalAmountCents: bill.totalAmountCents + toSafeCents(row.valor_parcela_centavos), updatedAt: nowTs() })
              .where(eq(creditCardBills.id, bill.id))
              .run();
          }
        }
        result.linesProcessed += 1;
        summary.parcelas_cartao += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("faturas_futuras.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando faturas_futuras.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = billRowSchema.parse(raw);
        const card = ensureCreditCard(row.cartao);
        const bill = ensureBill(card.id, row.data_vencimento_iso, card.closeDay, toSafeCents(row.valor_total_centavos));
        db.update(creditCardBills)
          .set({ totalAmountCents: toSafeCents(row.valor_total_centavos), updatedAt: nowTs(), status: toSafeCents(row.valor_total_centavos) > 0 ? "open" : "open" })
          .where(eq(creditCardBills.id, bill.id))
          .run();
        result.linesProcessed += 1;
        summary.faturas_futuras += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("transacoes_historicas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando transacoes_historicas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = transactionRowSchema.parse(raw);
        const account = findAccountByLabel(row.conta);
        const direction = row.tipo === "receita" ? "income" : row.tipo === "despesa" ? "expense" : "adjustment";
        const exists = db.select().from(transactions).all().find((item) => item.occurredOn === row.data_iso && item.accountId === (account?.id ?? null) && item.amountCents === toSafeCents(row.valor_centavos) && item.direction === direction);
        if (exists) {
          summary.duplicatas_transacoes += 1;
          return;
        }
        db.insert(transactions).values({
          id: uid("txn"),
          accountId: account?.id ?? null,
          categoryId: null,
          subcategoryId: null,
          transferId: null,
          recurringOccurrenceId: null,
          sourceImportRowId: null,
          direction,
          status: "posted",
          description: row.descricao,
          counterparty: row.conta,
          amountCents: toSafeCents(row.valor_centavos),
          occurredOn: row.data_iso,
          dueOn: row.data_iso,
          competenceMonth: isoMonth(row.data_iso),
          notes: `Saldo após: ${row.saldo_apos_centavos}`,
          isProjected: false,
          createdAt: nowTs(),
          updatedAt: nowTs()
        }).run();
        result.linesProcessed += 1;
        summary.transacoes_historicas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("operacoes_ativos.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando operacoes_ativos.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = tradeRowSchema.parse(raw);
        const exists = db.select().from(assetTrades).all().find((item) => item.assetName === row.asset_name && item.tradeDate === row.trade_date && item.action === row.action);
        if (exists) return;
        db.insert(assetTrades).values({
          id: uid("trade"),
          action: row.action,
          assetName: row.asset_name,
          quantity: Number(String(row.quantity).replace(",", ".")),
          tradeDate: row.trade_date,
          totalInitialCents: toSafeCents(row.total_initial_cents),
          pricePerUnitInitialCents: toSafeCents(row.price_per_unit_initial_cents),
          totalCurrentCents: toSafeCents(row.total_current_cents),
          pricePerUnitCurrentCents: toSafeCents(row.price_per_unit_current_cents),
          yieldPercent: row.yield_percent ? Number(String(row.yield_percent).replace(",", ".")) : null,
          descriptionText: row.description_text,
          isCompleted: row.is_completed !== "0",
          createdAt: nowTs()
        }).run();
        result.linesProcessed += 1;
        summary.operacoes_ativos += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("registro_diario.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando registro_diario.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = snapshotRowSchema.parse(raw);
        const existing = db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.date, row.data_iso)).get();
        const payload = {
          date: row.data_iso,
          accountBalanceCents: toSafeCents(row.saldo_conta_centavos),
          investment1Cents: toSafeCents(row.investimento_1_centavos),
          investment2Cents: toSafeCents(row.investimento_2_centavos),
          totalCents: toSafeCents(row.patrimonio_total_centavos),
          variationType: row.tipo_variacao,
          createdAt: nowTs()
        };
        if (existing) {
          db.update(netWorthSnapshots)
            .set({
              accountBalanceCents: payload.accountBalanceCents,
              investment1Cents: payload.investment1Cents,
              investment2Cents: payload.investment2Cents,
              totalCents: payload.totalCents,
              variationType: payload.variationType
            })
            .where(eq(netWorthSnapshots.id, existing.id))
            .run();
        } else {
          db.insert(netWorthSnapshots).values({ id: uid("nws"), ...payload }).run();
        }
        upsertMonthlySummaryFromSnapshot(row.data_iso, payload.totalCents);
        result.linesProcessed += 1;
        summary.registro_diario += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  return {
    success: results.every((item) => item.status === "success" || item.status === "partial"),
    files: results,
    summary: {
      ...summary,
      tempo_ms: Date.now() - started
    }
  };
}

export function renderImportSummary(result: ImportRunResult) {
  const lines = [
    "====================================",
    "  Relatório de Importação",
    "====================================",
    `  ✅ Contas:              ${result.summary.contas} inseridas`,
    `  ✅ Reservas:            ${result.summary.reservas} inseridas`,
    `  ✅ Ações:               ${result.summary.acoes} inseridas`,
    `  ✅ Criptomoedas:        ${result.summary.criptomoedas} inseridas`,
    `  ✅ Parcelas cartão:     ${result.summary.parcelas_cartao} inseridas`,
    `  ✅ Faturas futuras:     ${result.summary.faturas_futuras} inseridas`,
    `  ✅ Transações:          ${result.summary.transacoes_historicas} inseridas, ${result.summary.duplicatas_transacoes} duplicatas ignoradas`,
    `  ✅ Operações de ativo:  ${result.summary.operacoes_ativos} inseridas`,
    `  ✅ Snapshots diários:   ${result.summary.registro_diario} inseridos`,
    `  ⚠️  Erros:              ${result.summary.erros}`,
    "====================================",
    `  Tempo total: ${(result.summary.tempo_ms / 1000).toFixed(2)}s`,
    "===================================="
  ];
  return lines.join("\n");
}

export function expectedCsvFiles() {
  return [...EXPECTED_FILES];
}

export function seedProjectionRulesIfMissing() {
  const mercadoPago = db.select().from(accounts).all().find((item) => item.name === "MercadoPago CC" || item.institution === "MercadoPago") || db.select().from(accounts).all()[0];
  const nubank = db.select().from(accounts).all().find((item) => item.name === "NuBank CC" || item.institution === "NuBank") || mercadoPago;
  if (!mercadoPago || !nubank) return;

  const definitions = [
    {
      title: "Mesada Olga",
      accountId: mercadoPago.id,
      amountCents: parseCurrencyToCents("1000,00"),
      nextRunOn: firstBusinessDayAfter12(new Date().getFullYear(), new Date().getMonth()),
      notes: "FIRST_BUSINESS_DAY_AFTER_12"
    },
    {
      title: "Internet/GloboPlay",
      accountId: mercadoPago.id,
      amountCents: parseCurrencyToCents("79,89"),
      nextRunOn: `${isoMonth(todayIso())}-21`,
      notes: ""
    },
    {
      title: "SmartFit",
      accountId: nubank.id,
      amountCents: parseCurrencyToCents("149,90"),
      nextRunOn: `${isoMonth(todayIso())}-25`,
      notes: "CARD_RECURRING"
    }
  ];

  definitions.forEach((definition) => {
    const exists = db.select().from(recurringRules).all().find((rule) => rule.title === definition.title);
    if (exists) return;
    db.insert(recurringRules).values({
      id: uid("rr"),
      accountId: definition.accountId,
      categoryId: null,
      title: definition.title,
      direction: definition.title === "Mesada Olga" ? "income" : "expense",
      frequency: "monthly",
      amountCents: definition.amountCents,
      startsOn: definition.nextRunOn,
      endsOn: null,
      nextRunOn: definition.nextRunOn,
      autoPost: false,
      notes: definition.notes,
      isActive: true,
      createdAt: nowTs(),
      updatedAt: nowTs()
    }).run();
  });
}
