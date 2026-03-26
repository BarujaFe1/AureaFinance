import { db } from "@/db/client";
import { creditCardBills, monthlyClosings, transactions } from "@/db/schema";
import { desc } from "drizzle-orm";

export function getMonthlyClosingsPageData() {
  const closings = db
    .select()
    .from(monthlyClosings)
    .orderBy(desc(monthlyClosings.month), desc(monthlyClosings.updatedAt))
    .all();

  const latestTransactions = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.occurredOn), desc(transactions.createdAt))
    .all()
    .slice(0, 12);

  const openBills = db
    .select()
    .from(creditCardBills)
    .orderBy(desc(creditCardBills.billMonth), desc(creditCardBills.dueOn))
    .all()
    .filter((bill) => bill.status !== "paid")
    .slice(0, 12);

  return {
    closings,
    latestTransactions,
    openBills
  };
}
