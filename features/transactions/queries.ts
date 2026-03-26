import { db } from "@/db/client";
import { accounts, categories, transactions } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export function getTransactionsPageData() {
  const accountOptions = db
    .select({ id: accounts.id, name: accounts.name })
    .from(accounts)
    .where(eq(accounts.isArchived, false))
    .orderBy(asc(accounts.sortOrder), asc(accounts.name))
    .all();

  const categoryOptions = db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.name))
    .all();

  const rows = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.occurredOn), desc(transactions.createdAt))
    .all();

  return {
    accounts: accountOptions,
    categories: categoryOptions,
    transactions: rows
  };
}
