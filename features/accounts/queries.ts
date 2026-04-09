import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, transactions } from "@/db/schema";
import { calculateBalance, calculateProjectedBalance, toBalanceTransactions } from "@/lib/finance";

export function getAccountsSnapshot() {
  const accountRows = db.select().from(accounts).all();
  const snapshotRows = db.select().from(accountBalanceSnapshots).orderBy(desc(accountBalanceSnapshots.snapshotDate)).all();
  const transactionRows = db.select().from(transactions).all();

  return accountRows.map((account) => {
    const relatedTransactions = transactionRows.filter((transaction) => transaction.accountId === account.id);
    const latestSnapshot = snapshotRows.find((snapshot) => snapshot.accountId === account.id) ?? null;
    return {
      ...account,
      realizedBalanceCents: calculateBalance(account.openingBalanceCents, toBalanceTransactions(relatedTransactions)),
      projectedBalanceCents: calculateProjectedBalance(account.openingBalanceCents, toBalanceTransactions(relatedTransactions)),
      latestSnapshot
    };
  });
}
