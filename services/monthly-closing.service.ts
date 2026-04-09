import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, creditCardBills, monthlyClosings, transactions } from "@/db/schema";
import { endOfMonthIso, nowTs } from "@/lib/dates";
import { closeMonthSnapshot, signedAmount, type TransactionDirection } from "@/lib/finance";
import { uid, fromJson, toJson } from "@/lib/utils";

function getMonthRange(month: string) {
  const start = `${month}-01`;
  const end = endOfMonthIso(start);
  return { start, end };
}

function getOpeningBalanceForMonth(month: string) {
  const { start } = getMonthRange(month);
  const openingFromAccounts = db.select().from(accounts).all().reduce((sum, account) => sum + account.openingBalanceCents, 0);
  const priorTransactions = db.select().from(transactions).all().filter((row) => row.occurredOn < start && row.status !== "void");
  return priorTransactions.reduce((sum, row) => sum + signedAmount(row.direction as TransactionDirection, row.amountCents), openingFromAccounts);
}

export function buildMonthlyClosing(month: string) {
  const { start, end } = getMonthRange(month);
  const tx = db.select().from(transactions).all().filter((row) => row.occurredOn >= start && row.occurredOn <= end && row.status !== "void");
  const bills = db.select().from(creditCardBills).all().filter((bill) => bill.dueOn >= start && bill.dueOn <= end && bill.status !== "paid");
  const incomesCents = tx.filter((row) => row.direction === "income").reduce((sum, row) => sum + row.amountCents, 0);
  const expensesCents = tx.filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction)).reduce((sum, row) => sum + row.amountCents, 0);
  const transfersNetCents = tx.filter((row) => row.direction === "transfer_in").reduce((sum, row) => sum + row.amountCents, 0)
    - tx.filter((row) => row.direction === "transfer_out").reduce((sum, row) => sum + row.amountCents, 0);
  const projectedBillPaymentsCents = bills.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
  const openingBalanceCents = getOpeningBalanceForMonth(month);
  const snapshot = closeMonthSnapshot({
    openingBalanceCents,
    incomesCents,
    expensesCents,
    transfersNetCents,
    projectedBillPaymentsCents
  });

  return {
    month,
    openingBalanceCents,
    incomesCents,
    expensesCents,
    transfersNetCents,
    projectedBillPaymentsCents,
    closingBalanceCents: snapshot.closingBalanceCents,
    projectedFreeCashCents: snapshot.projectedFreeCashCents,
    snapshotJson: toJson({ transactionCount: tx.length, openBills: bills.length })
  };
}

export function runMonthlyClosing(month: string) {
  const now = nowTs();
  const built = buildMonthlyClosing(month);
  const existing = db.select().from(monthlyClosings).where(eq(monthlyClosings.month, month)).get();
  if (existing) {
    db.update(monthlyClosings).set({ ...built, updatedAt: now }).where(eq(monthlyClosings.id, existing.id)).run();
    return existing.id;
  }
  const id = uid("close");
  db.insert(monthlyClosings).values({ id, ...built, notes: "", createdAt: now, updatedAt: now }).run();
  return id;
}

export function listMonthlyClosings() {
  return db.select().from(monthlyClosings).all().sort((a, b) => b.month.localeCompare(a.month)).map((row) => ({
    ...row,
    snapshot: fromJson<{ transactionCount?: number; openBills?: number }>(row.snapshotJson, {})
  }));
}


export function reopenMonthlyClosing(month: string) {
  const existing = db.select().from(monthlyClosings).where(eq(monthlyClosings.month, month)).get();
  if (!existing) return null;
  db.delete(monthlyClosings).where(eq(monthlyClosings.id, existing.id)).run();
  return existing.id;
}
