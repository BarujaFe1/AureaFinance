import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, cryptoPositions, netWorthSummaries, reserves, stockPositions, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs } from "@/lib/dates";
import { calculateBalance } from "@/lib/finance";
import { uid } from "@/lib/utils";

type NetWorthSummary = {
  month: string | null;
  realizedLiquidCents: number;
  manualReservesCents: number;
  manualInvestmentsCents: number;
  manualDebtsCents: number;
  totalNetWorthCents: number;
};

function getLiquidAccountBalanceCents() {
  const includedAccounts = db.select().from(accounts).where(eq(accounts.includeInNetWorth, true)).all();
  return includedAccounts
    .filter((account) => ["checking", "savings", "cash"].includes(account.type))
    .reduce((sum, account) => {
      const related = db.select().from(transactions).where(eq(transactions.accountId, account.id)).all();
      return sum + calculateBalance(account.openingBalanceCents, related);
    }, 0);
}

function getLatestNetWorthSummaryRow() {
  return db.select().from(netWorthSummaries).all().sort((a, b) => b.month.localeCompare(a.month))[0] ?? null;
}

function getImportedReserveCents() {
  const rows = db.select().from(reserves).all();
  return rows.reduce((sum, item) => sum + item.currentValueCents, 0);
}

function getImportedInvestmentCents() {
  const stocks = db.select().from(stockPositions).all().reduce((sum, item) => sum + item.currentCents, 0);
  const cryptos = db.select().from(cryptoPositions).all().reduce((sum, item) => sum + item.currentCents, 0);
  return stocks + cryptos;
}

export function getCurrentNetWorthSummary(): NetWorthSummary {
  const realizedLiquidCents = getLiquidAccountBalanceCents();
  const latest = getLatestNetWorthSummaryRow();
  const importedReserveCents = getImportedReserveCents();
  const importedInvestmentCents = getImportedInvestmentCents();
  const manualReservesCents = importedReserveCents > 0 ? importedReserveCents : latest?.reservesCents ?? 0;
  const manualInvestmentsCents = importedInvestmentCents > 0 ? importedInvestmentCents : latest?.investmentsCents ?? 0;
  const manualDebtsCents = latest?.debtsCents ?? 0;

  return {
    month: latest?.month ?? null,
    realizedLiquidCents,
    manualReservesCents,
    manualInvestmentsCents,
    manualDebtsCents,
    totalNetWorthCents: realizedLiquidCents + manualReservesCents + manualInvestmentsCents - manualDebtsCents
  };
}

export function listNetWorthSummaries() {
  return db.select().from(netWorthSummaries).all().sort((a, b) => b.month.localeCompare(a.month));
}

export function upsertNetWorthSummary(values: { month: string; reserves: string; investments: string; debts: string; notes?: string }) {
  const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, values.month)).get();
  const now = nowTs();
  const payload = {
    month: values.month,
    reservesCents: parseCurrencyToCents(values.reserves),
    investmentsCents: parseCurrencyToCents(values.investments),
    debtsCents: parseCurrencyToCents(values.debts),
    notes: values.notes ?? "",
    source: "manual",
    updatedAt: now
  };

  if (existing) {
    db.update(netWorthSummaries).set(payload).where(eq(netWorthSummaries.id, existing.id)).run();
    return existing.id;
  }

  const id = uid("nw");
  db.insert(netWorthSummaries).values({ id, ...payload, createdAt: now }).run();
  return id;
}
