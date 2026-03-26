import { format } from "date-fns";
import { listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { listBills, getCardsSummary } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";

function debug(step: string, payload?: unknown) {
  console.log(`[dashboard][${step}]`, payload ?? "ok");
}

export function getDashboardPageData() {
  try {
    debug("A:start");

    const accounts = listAccountsWithBalances();
    debug("B:accounts", { count: accounts.length });

    const cards = getCardsSummary();
    debug("C:cards", { count: cards.length });

    const recentTransactions = listTransactions({ limit: 10 });
    debug("D:recentTransactions", { count: recentTransactions.length });

    const upcomingBills = listBills()
      .filter((bill) => bill.status !== "paid")
      .slice(0, 6);
    debug("E:upcomingBills", { count: upcomingBills.length });

    const recurring = listRecurringRules()
      .flatMap((rule) => rule.occurrences)
      .filter((occurrence) => occurrence.status === "scheduled")
      .slice(0, 8);
    debug("F:recurring", { count: recurring.length });

    const month = format(new Date(), "yyyy-MM");
    const monthTransactions = listTransactions({ month });
    debug("G:monthTransactions", { month, count: monthTransactions.length });

    const netWorth = getCurrentNetWorthSummary();
    debug("H:netWorth", { month: netWorth.month });

    return {
      month,
      accounts,
      cards,
      recentTransactions,
      upcomingBills,
      recurring,
      netWorth,
      consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
      consolidatedProjectedCents:
        accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0) -
        upcomingBills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0),
      incomeMonthCents: monthTransactions
        .filter((row) => row.direction === "income")
        .reduce((sum, row) => sum + row.amountCents, 0),
      expenseMonthCents: monthTransactions
        .filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction))
        .reduce((sum, row) => sum + row.amountCents, 0),
      chartSeries: accounts.map((account) => ({
        name: account.name,
        current: account.currentBalanceCents / 100,
        projected: account.projectedBalanceCents / 100
      }))
    };
  } catch (error) {
    console.error("[dashboard][ERROR]", error);
    throw error;
  }
}
