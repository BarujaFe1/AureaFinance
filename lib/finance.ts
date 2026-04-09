import { INSTALLMENT_LABEL_PATTERN } from "./constants";
import { addDaysIso, addMonthsIso, isoDate, isoMonth, startOfMonthIso, withDayOfMonthIso } from "./dates";

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

const transactionDirections: TransactionDirection[] = ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"];
const transactionStatuses: TransactionStatus[] = ["posted", "scheduled", "void"];

export function isTransactionDirection(value: unknown): value is TransactionDirection {
  return transactionDirections.includes(value as TransactionDirection);
}

export function isTransactionStatus(value: unknown): value is TransactionStatus {
  return transactionStatuses.includes(value as TransactionStatus);
}

export function toBalanceTransaction(value: { direction: unknown; amountCents: number; status: unknown }): BalanceTransaction {
  return {
    direction: isTransactionDirection(value.direction) ? value.direction : "expense",
    amountCents: value.amountCents,
    status: isTransactionStatus(value.status) ? value.status : "posted"
  };
}

export function toBalanceTransactions<T extends { direction: unknown; amountCents: number; status: unknown }>(values: T[]) {
  return values.map(toBalanceTransaction);
}

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
  const normalized = isoDate(purchaseDate);
  const purchaseDay = Number(normalized.slice(8, 10));
  if (purchaseDay <= closeDay) return normalized.slice(0, 7);
  return addMonthsIso(`${normalized.slice(0, 7)}-01`, 1).slice(0, 7);
}

export function resolveBillDueDate(billMonth: string, dueDay: number) {
  return withDayOfMonthIso(addMonthsIso(`${billMonth}-01`, 1), dueDay);
}

export function resolveBillCloseDate(billMonth: string, closeDay: number) {
  return withDayOfMonthIso(`${billMonth}-01`, closeDay);
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
    const billMonth = addMonthsIso(`${firstBillMonth}-01`, index).slice(0, 7);
    return {
      installmentNumber: index + 1,
      amountCents,
      billMonth,
      billClosedOn: resolveBillCloseDate(billMonth, input.closeDay),
      billDueOn: resolveBillDueDate(billMonth, input.dueDay)
    };
  });
}

function occurrenceOnInterval(anchorDate: string, frequency: "weekly" | "monthly" | "yearly", step: number) {
  if (step === 0) return anchorDate;
  if (frequency === "weekly") return addDaysIso(anchorDate, step * 7);
  const anchorDay = Number(anchorDate.slice(8, 10));
  const anchorMonthStart = startOfMonthIso(anchorDate);
  const monthJump = frequency === "yearly" ? step * 12 : step;
  return withDayOfMonthIso(addMonthsIso(anchorMonthStart, monthJump), anchorDay);
}

export function materializeOccurrences(rule: {
  nextRunOn: string;
  endsOn?: string | null;
  frequency: "weekly" | "monthly" | "yearly";
  amountCents: number;
  direction: TransactionDirection;
}, horizonMonths = 3) {
  const items: { dueOn: string; amountCents: number; direction: TransactionDirection }[] = [];
  const anchorDate = isoDate(rule.nextRunOn);
  const limit = addMonthsIso(anchorDate, horizonMonths);
  let step = 0;
  let guard = 0;

  while (guard < 512) {
    const dueOn = occurrenceOnInterval(anchorDate, rule.frequency, step);
    if (dueOn > limit) break;
    if (!rule.endsOn || dueOn <= rule.endsOn) {
      items.push({ dueOn, amountCents: rule.amountCents, direction: rule.direction });
    }
    step += 1;
    guard += 1;
  }

  return items;
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
