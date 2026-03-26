import { INSTALLMENT_LABEL_PATTERN } from "@/lib/constants";
import { addMonthsIso, isoDate, isoMonth, startOfMonthIso } from "@/lib/dates";

export type TransactionDirection =
  | "income"
  | "expense"
  | "transfer_in"
  | "transfer_out"
  | "bill_payment"
  | "adjustment";

export type TransactionStatus = "posted" | "scheduled" | "void";

export type BalanceTransaction = {
  direction: TransactionDirection;
  amountCents: number;
  status: TransactionStatus;
};

export function signedAmount(direction: TransactionDirection, amountCents: number) {
  if (direction === "income" || direction === "transfer_in") return Math.abs(amountCents);
  return -Math.abs(amountCents);
}

export function calculateBalance(openingBalanceCents: number, transactions: BalanceTransaction[]) {
  return transactions
    .filter((transaction) => transaction.status === "posted")
    .reduce((sum, transaction) => sum + signedAmount(transaction.direction, transaction.amountCents), openingBalanceCents);
}

export function calculateProjectedBalance(openingBalanceCents: number, transactions: BalanceTransaction[]) {
  return transactions.reduce((sum, transaction) => {
    if (transaction.status === "void") return sum;
    return sum + signedAmount(transaction.direction, transaction.amountCents);
  }, openingBalanceCents);
}

export function splitInstallments(totalAmountCents: number, count: number) {
  const base = Math.floor(totalAmountCents / count);
  const remainder = totalAmountCents - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function resolveBillMonthForPurchase(purchaseDate: string, closeDay: number) {
  const date = new Date(purchaseDate);
  const purchaseDay = Number(isoDate(date).slice(8, 10));
  if (purchaseDay <= closeDay) return isoMonth(date);
  return isoMonth(new Date(addMonthsIso(startOfMonthIso(date), 1)));
}

export function resolveBillDueDate(billMonth: string, dueDay: number) {
  const due = new Date(addMonthsIso(`${billMonth}-01`, 1));
  due.setDate(dueDay);
  return isoDate(due);
}

export function resolveBillCloseDate(billMonth: string, closeDay: number) {
  const close = new Date(`${billMonth}-01`);
  close.setDate(closeDay);
  return isoDate(close);
}

export function generateInstallments(input: {
  purchaseDate: string;
  totalAmountCents: number;
  installmentCount: number;
  closeDay: number;
  dueDay: number;
}) {
  const firstBillMonth = resolveBillMonthForPurchase(input.purchaseDate, input.closeDay);
  return splitInstallments(input.totalAmountCents, input.installmentCount).map((amountCents, index) => {
    const billMonth = isoMonth(new Date(addMonthsIso(`${firstBillMonth}-01`, index)));
    return {
      installmentNumber: index + 1,
      amountCents,
      billMonth,
      billClosedOn: resolveBillCloseDate(billMonth, input.closeDay),
      billDueOn: resolveBillDueDate(billMonth, input.dueDay)
    };
  });
}

export function materializeOccurrences(rule: {
  nextRunOn: string;
  endsOn?: string | null;
  frequency: "weekly" | "monthly" | "yearly";
  amountCents: number;
  direction: TransactionDirection;
}, horizonMonths = 3) {
  const items: { dueOn: string; amountCents: number; direction: TransactionDirection }[] = [];
  let cursor = rule.nextRunOn;
  const limit = addMonthsIso(startOfMonthIso(rule.nextRunOn), horizonMonths);
  while (cursor <= limit) {
    if (!rule.endsOn || cursor <= rule.endsOn) {
      items.push({ dueOn: cursor, amountCents: rule.amountCents, direction: rule.direction });
    }
    cursor = rule.frequency === "weekly" ? addDaysIso(cursor, 7) : rule.frequency === "yearly" ? addMonthsIso(cursor, 12) : addMonthsIso(cursor, 1);
  }
  return items;
}

function addDaysIso(date: string, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return isoDate(next);
}

export function closeMonthSnapshot(input: {
  openingBalanceCents: number;
  incomesCents: number;
  expensesCents: number;
  transfersNetCents: number;
  projectedBillPaymentsCents: number;
}) {
  const realizedNetCents = input.incomesCents - input.expensesCents;
  const closingBalanceCents = input.openingBalanceCents + realizedNetCents + input.transfersNetCents;
  return {
    realizedNetCents,
    closingBalanceCents,
    projectedFreeCashCents: closingBalanceCents - input.projectedBillPaymentsCents
  };
}

export function parseInstallmentLabel(description: string) {
  const match = description.match(INSTALLMENT_LABEL_PATTERN);
  if (!match) return null;
  return { current: Number(match[1]), total: Number(match[2]) };
}
