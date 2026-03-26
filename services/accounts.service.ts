import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, transactions } from "@/db/schema";
import { calculateBalance, calculateProjectedBalance } from "@/lib/finance";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import type { AccountCreateInput } from "@/lib/validation";

export function listAccounts() {
  return db.select().from(accounts).where(eq(accounts.isArchived, false)).orderBy(asc(accounts.sortOrder), asc(accounts.name)).all();
}

export function listAccountsWithBalances() {
  return listAccounts().map((account) => {
    const related = db.select().from(transactions).where(eq(transactions.accountId, account.id)).all();
    return {
      ...account,
      currentBalanceCents: calculateBalance(account.openingBalanceCents, related),
      projectedBalanceCents: calculateProjectedBalance(account.openingBalanceCents, related)
    };
  });
}

export function createAccount(input: AccountCreateInput) {
  const now = nowTs();
  const slugBase = slugify(input.name);
  const exists = db.select().from(accounts).where(eq(accounts.slug, slugBase)).get();
  const id = uid("acc");
  const openingBalanceCents = parseCurrencyToCents(input.openingBalance);
  db.insert(accounts).values({
    id,
    name: input.name,
    slug: exists ? `${slugBase}-${now}` : slugBase,
    type: input.type,
    institution: input.institution ?? "",
    openingBalanceCents,
    color: input.color ?? "#5b7cfa",
    notes: input.notes ?? "",
    includeInNetWorth: input.includeInNetWorth ?? true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  db.insert(accountBalanceSnapshots).values({
    id: uid("snap"),
    accountId: id,
    snapshotDate: new Date().toISOString().slice(0, 10),
    balanceCents: openingBalanceCents,
    source: "opening_balance",
    createdAt: now
  }).run();
}
