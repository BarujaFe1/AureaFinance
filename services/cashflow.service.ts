import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards, recurringOccurrences, recurringRules } from "@/db/schema";
import { addDaysIso, addMonthsIso, todayIso } from "@/lib/dates";
import { materializeOccurrences, type TransactionDirection } from "@/lib/finance";
import { listAccountsWithBalances } from "@/services/accounts.service";

export type CashflowEvent = {
  date: string;
  type: "fatura_cartao" | "parcela_cartao" | "recorrencia_despesa" | "recorrencia_receita" | "manual";
  description: string;
  amount_cents: number;
  direction: "entrada" | "saida";
  account_name: string;
  card_name?: string;
  responsible?: string;
  balance_after_cents?: number;
};

export type CashflowDay = {
  date: string;
  balance_cents: number;
  events: CashflowEvent[];
  total_income_cents: number;
  total_expense_cents: number;
  is_negative: boolean;
};

function firstBusinessDayAfter12(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 13);
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function normalizeRuleDirection(value: string): TransactionDirection {
  return ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"].includes(value) ? (value as TransactionDirection) : "expense";
}

function normalizeRuleFrequency(value: string): "weekly" | "monthly" | "yearly" {
  return value === "weekly" || value === "yearly" ? value : "monthly";
}

function expandRule(rule: typeof recurringRules.$inferSelect, endDate: string) {
  if (rule.notes?.includes("FIRST_BUSINESS_DAY_AFTER_12")) {
    const out: string[] = [];
    let cursor = new Date(rule.nextRunOn);
    const end = new Date(endDate);
    while (cursor <= end) {
      out.push(firstBusinessDayAfter12(cursor.getFullYear(), cursor.getMonth()));
      cursor = new Date(addMonthsIso(cursor.toISOString().slice(0, 10), 1));
    }
    return out;
  }
  return materializeOccurrences({
    nextRunOn: rule.nextRunOn,
    endsOn: rule.endsOn,
    frequency: normalizeRuleFrequency(rule.frequency),
    amountCents: rule.amountCents,
    direction: normalizeRuleDirection(rule.direction)
  }, 4)
    .map((item) => item.dueOn)
    .filter((date) => date <= endDate);
}

async function computeProjectedCashflow(days: number) {
  const currentAccounts = listAccountsWithBalances();
  const initialBalanceCents = currentAccounts.reduce((sum, account) => sum + account.currentBalanceCents, 0);
  const accountMap = new Map(db.select().from(accounts).all().map((row) => [row.id, row]));
  const cardMap = new Map(db.select().from(creditCards).all().map((row) => [row.id, row]));
  const today = todayIso();
  const end = addDaysIso(today, days - 1);
  const events: CashflowEvent[] = [];

  const bills = db.select().from(creditCardBills).all().filter((bill) => bill.status !== "paid" && bill.dueOn >= today && bill.dueOn <= end);
  const billIdsInRange = new Set(bills.map((bill) => bill.id));

  for (const bill of bills) {
    const card = cardMap.get(bill.creditCardId);
    const account = card ? accountMap.get(card.settlementAccountId) : null;
    events.push({
      date: bill.dueOn,
      type: "fatura_cartao",
      description: `Fatura ${card?.name ?? "CartÃ£o"} ${bill.billMonth}`,
      amount_cents: Math.max(bill.totalAmountCents - bill.paidAmountCents, 0),
      direction: "saida",
      account_name: account?.name ?? "Conta de pagamento",
      card_name: card?.name
    });
  }

  const installments = db.select().from(cardInstallments).all().filter((item) => item.dueOn >= today && item.dueOn <= end && !billIdsInRange.has(item.billId));
  for (const installment of installments) {
    const purchase = db.select().from(cardPurchases).where(eq(cardPurchases.id, installment.purchaseId)).get();
    if (!purchase) continue;
    const card = cardMap.get(purchase.creditCardId);
    const account = card ? accountMap.get(card.settlementAccountId) : null;
    events.push({
      date: installment.dueOn,
      type: "parcela_cartao",
      description: `${purchase.description} (${installment.installmentNumber}/${installment.totalInstallments})`,
      amount_cents: installment.amountCents,
      direction: "saida",
      account_name: account?.name ?? "Conta de pagamento",
      card_name: card?.name,
      responsible: purchase.responsible || undefined
    });
  }

  const rules = db.select().from(recurringRules).all().filter((rule) => rule.isActive);
  const occurrencesByRule = db.select().from(recurringOccurrences).all();
  for (const rule of rules) {
    const account = accountMap.get(rule.accountId);
    const generatedDates = expandRule(rule, end).filter((date) => date >= today);
    for (const dueOn of generatedDates) {
      const existing = occurrencesByRule.find((item) => item.ruleId === rule.id && item.dueOn === dueOn);
      if (existing?.status === "posted") continue;
      if (rule.notes?.includes("CARD_RECURRING")) {
        const card = db.select().from(creditCards).all().find((row) => row.settlementAccountId === rule.accountId);
        events.push({
          date: dueOn,
          type: rule.direction === "income" ? "recorrencia_receita" : "recorrencia_despesa",
          description: rule.title,
          amount_cents: rule.amountCents,
          direction: rule.direction === "income" ? "entrada" : "saida",
          account_name: account?.name ?? "Conta",
          card_name: card?.name
        });
        continue;
      }
      events.push({
        date: dueOn,
        type: rule.direction === "income" ? "recorrencia_receita" : "recorrencia_despesa",
        description: rule.title,
        amount_cents: rule.amountCents,
        direction: rule.direction === "income" ? "entrada" : "saida",
        account_name: account?.name ?? "Conta"
      });
    }
  }

  const grouped = new Map<string, CashflowEvent[]>();
  events.sort((a, b) => a.date.localeCompare(b.date) || a.amount_cents - b.amount_cents);
  for (const event of events) {
    const existing = grouped.get(event.date) ?? [];
    existing.push(event);
    grouped.set(event.date, existing);
  }

  const daysOut: CashflowDay[] = [];
  let running = initialBalanceCents;
  let firstNegativeDate: string | null = null;
  let minBalanceCents = initialBalanceCents;
  let minBalanceDate = today;
  let totalExpensesCents = 0;
  let totalIncomeCents = 0;

  for (let offset = 0; offset < days; offset++) {
    const date = addDaysIso(today, offset);
    const dayEvents = grouped.get(date) ?? [];
    const totalIncome = dayEvents.filter((event) => event.direction === "entrada").reduce((sum, event) => sum + event.amount_cents, 0);
    const totalExpense = dayEvents.filter((event) => event.direction === "saida").reduce((sum, event) => sum + event.amount_cents, 0);
    running = running + totalIncome - totalExpense;
    totalIncomeCents += totalIncome;
    totalExpensesCents += totalExpense;
    if (running < 0 && !firstNegativeDate) firstNegativeDate = date;
    if (running < minBalanceCents) {
      minBalanceCents = running;
      minBalanceDate = date;
    }
    daysOut.push({
      date,
      balance_cents: running,
      events: dayEvents.map((event) => ({ ...event, balance_after_cents: running })),
      total_income_cents: totalIncome,
      total_expense_cents: totalExpense,
      is_negative: running < 0
    });
  }

  return {
    initial_balance_cents: initialBalanceCents,
    days: daysOut,
    first_negative_date: firstNegativeDate,
    min_balance_cents: minBalanceCents,
    min_balance_date: minBalanceDate,
    total_expenses_cents: totalExpensesCents,
    total_income_cents: totalIncomeCents,
    ending_balance_cents: daysOut.at(-1)?.balance_cents ?? initialBalanceCents
  };
}

export const getProjectedCashflow = unstable_cache(computeProjectedCashflow, ["cashflow-project"], {
  revalidate: 300,
  tags: ["cashflow"]
});