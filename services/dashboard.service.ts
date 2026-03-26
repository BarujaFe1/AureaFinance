import { listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { getCardsSummary, listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";
import { format } from "date-fns";

export function getDashboardData() {
  const accounts = listAccountsWithBalances();
  const cards = getCardsSummary();
  const recentTransactions = listTransactions({ limit: 10 });
  const upcomingBills = listBills().filter((bill) => bill.status !== "paid").slice(0, 6);
  const recurring = listRecurringRules().flatMap((rule) => rule.occurrences).filter((row) => row.status === "scheduled").slice(0, 8);
  const month = format(new Date(), "yyyy-MM");
  const monthTransactions = listTransactions({ month });
  return {
    month,
    accounts,
    cards,
    recentTransactions,
    upcomingBills,
    recurring,
    netWorth: getCurrentNetWorthSummary(),
    consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
    consolidatedProjectedCents:
      accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0) - upcomingBills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0),
    incomeMonthCents: monthTransactions.filter((row) => row.direction === "income").reduce((sum, row) => sum + row.amountCents, 0),
    expenseMonthCents: monthTransactions.filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction)).reduce((sum, row) => sum + row.amountCents, 0),
    chartSeries: accounts.map((account) => ({ name: account.name, current: account.currentBalanceCents / 100, projected: account.projectedBalanceCents / 100 }))
  };
}
