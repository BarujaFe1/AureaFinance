import { format } from "date-fns";
import { getAccountsReconciliationSummary, listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { getCardsSummary, listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary, getDailyNetWorthSnapshot } from "@/services/net-worth.service";
import { getBudgetVsActual } from "@/services/budget.service";
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
  const budgets = getBudgetVsActual(month);
  const totalBudgetLimitCents = budgets.filter((b) => b.categoryKind === "expense").reduce((sum, b) => sum + b.limitCents, 0);
  const totalBudgetSpentCents = budgets.filter((b) => b.categoryKind === "expense").reduce((sum, b) => sum + b.spentCents, 0);
  const savingsRateCents = actualIncomeMonthCents > 0 ? actualIncomeMonthCents - actualExpenseMonthCents : 0;
  const savingsRatePct = actualIncomeMonthCents > 0 ? Math.round((savingsRateCents / actualIncomeMonthCents) * 100) : 0;

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
    budgets,
    totalBudgetLimitCents,
    totalBudgetSpentCents,
    savingsRatePct: actualIncomeMonthCents > 0 ? savingsRatePct : null,
    emergencyFundMonths: actualExpenseMonthCents > 0 ? Math.round((accounts.reduce((sum, a) => sum + a.currentBalanceCents, 0) / actualExpenseMonthCents) * 10) / 10 : null,
    consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
    consolidatedProjectedCents: accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0),
    consolidatedReconciledCents: accounts.reduce((sum, account) => sum + account.reconciledBalanceCents, 0),
    incomeMonthCents: monthTransactions.length > 0 ? actualIncomeMonthCents : projectedIncomeMonthCents,
    expenseMonthCents: monthTransactions.length > 0 ? actualExpenseMonthCents : projectedExpenseMonthCents,
    projectedIncomeMonthCents,
    projectedExpenseMonthCents,
    lastUpdatedAt: nowTs(),
    chartSeries: accounts.map((account) => ({ name: account.name, current: account.currentBalanceCents / 100, projected: account.projectedBalanceCents / 100, reconciled: account.reconciledBalanceCents / 100 }))
  };
}
