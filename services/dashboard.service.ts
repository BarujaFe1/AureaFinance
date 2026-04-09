import { format } from "date-fns";
import { getAccountsReconciliationSummary, listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { getCardsSummary, listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary, getDailyNetWorthSnapshot } from "@/services/net-worth.service";
import { nowTs } from "@/lib/dates";

export function getDashboardData() {
  const month = format(new Date(), "yyyy-MM");
  const accounts = listAccountsWithBalances();
  const cards = getCardsSummary();
  const allTransactions = listTransactions();
  const recentTransactions = allTransactions.slice(0, 10);
  const monthTransactions = allTransactions.filter((row) => row.competenceMonth === month);
  const allBills = listBills();
  const upcomingBills = allBills.filter((bill) => bill.status !== "paid").slice(0, 6);
  const scheduledRecurring = listRecurringRules()
    .flatMap((rule) => rule.occurrences.map((occurrence) => ({ ...occurrence, ruleTitle: rule.title })))
    .filter((row) => row.status === "scheduled");
  const recurring = scheduledRecurring.slice(0, 8);
  const projectedRecurringForMonth = scheduledRecurring.filter((row) => row.dueOn.startsWith(month));
  const projectedBillsForMonth = upcomingBills.filter((row) => row.dueOn.startsWith(month));
  const actualIncomeMonthCents = monthTransactions.filter((row) => row.direction === "income").reduce((sum, row) => sum + row.amountCents, 0);
  const actualExpenseMonthCents = monthTransactions.filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction)).reduce((sum, row) => sum + row.amountCents, 0);
  const projectedIncomeMonthCents = projectedRecurringForMonth.filter((row) => row.direction === "income" || row.direction === "transfer_in").reduce((sum, row) => sum + row.amountCents, 0);
  const projectedExpenseMonthCents = projectedRecurringForMonth.filter((row) => row.direction !== "income" && row.direction !== "transfer_in").reduce((sum, row) => sum + row.amountCents, 0)
    + projectedBillsForMonth.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
  const reconciliation = getAccountsReconciliationSummary();
  const todaysNetWorth = getDailyNetWorthSnapshot();

  return {
    month,
    accounts,
    cards,
    recentTransactions,
    upcomingBills,
    recurring,
    netWorth: getCurrentNetWorthSummary(),
    todaysNetWorth,
    reconciliation,
    consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
    consolidatedProjectedCents: accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0),
    consolidatedReconciledCents: accounts.reduce((sum, account) => sum + account.reconciledBalanceCents, 0),
    incomeMonthCents: actualIncomeMonthCents > 0 ? actualIncomeMonthCents : projectedIncomeMonthCents,
    expenseMonthCents: actualExpenseMonthCents > 0 ? actualExpenseMonthCents : projectedExpenseMonthCents,
    projectedIncomeMonthCents,
    projectedExpenseMonthCents,
    lastUpdatedAt: nowTs(),
    chartSeries: accounts.map((account) => ({ name: account.name, current: account.currentBalanceCents / 100, projected: account.projectedBalanceCents / 100, reconciled: account.reconciledBalanceCents / 100 }))
  };
}
