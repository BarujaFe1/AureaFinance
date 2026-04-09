import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, creditCardBills, creditCards, recurringOccurrences, recurringRules, transactions } from "@/db/schema";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";
import { calculateBalance, calculateProjectedBalance, toBalanceTransactions } from "@/lib/finance";
import { parseCurrencyToCents } from "@/lib/currency";
import { addMonthsIso, nowTs, todayIso } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import type { AccountCreateInput } from "@/lib/validation";
import { ensureSettings } from "@/services/settings.service";

type AccountRow = typeof accounts.$inferSelect;
type AccountSnapshotRow = typeof accountBalanceSnapshots.$inferSelect;
type TransactionRow = typeof transactions.$inferSelect;
type BillRow = typeof creditCardBills.$inferSelect;
type CardRow = typeof creditCards.$inferSelect;
type RecurringRuleRow = typeof recurringRules.$inferSelect;
type RecurringOccurrenceRow = typeof recurringOccurrences.$inferSelect;

function groupByAccountId<T extends { accountId: string | null }>(rows: T[]) {
  const map = new Map<string, T[]>();
  for (const row of rows) {
    if (!row.accountId) continue;
    const current = map.get(row.accountId) ?? [];
    current.push(row);
    map.set(row.accountId, current);
  }
  return map;
}

function baseAccountQuery(includeArchived = false) {
  const archivedIds = new Set(listArchivedEntityIds("account"));
  const rows = db.select().from(accounts).orderBy(asc(accounts.sortOrder), asc(accounts.name)).all();
  return includeArchived ? rows : rows.filter((row) => !row.isArchived && !archivedIds.has(row.id));
}

export function listAccounts(includeArchived = false) {
  return baseAccountQuery(includeArchived);
}

export function getAccountById(accountId: string) {
  return db.select().from(accounts).where(eq(accounts.id, accountId)).get() ?? null;
}

export function listAccountBalanceSnapshots(accountId?: string, limit?: number) {
  const rows = db
    .select()
    .from(accountBalanceSnapshots)
    .orderBy(desc(accountBalanceSnapshots.snapshotDate), desc(accountBalanceSnapshots.createdAt))
    .all();

  const filtered = accountId ? rows.filter((row) => row.accountId === accountId) : rows;
  return typeof limit === "number" ? filtered.slice(0, limit) : filtered;
}

function getLatestSnapshotMap(rows = listAccountBalanceSnapshots()) {
  const map = new Map<string, AccountSnapshotRow>();
  for (const row of rows) {
    if (!map.has(row.accountId)) map.set(row.accountId, row);
  }
  return map;
}

function buildProjectionDeltaMap(accountIds: string[]) {
  const settings = ensureSettings();
  const today = todayIso();
  const horizonEnd = addMonthsIso(`${today.slice(0, 7)}-01`, Math.max(settings.projectionMonths, 1));
  const deltaByAccount = new Map<string, number>(accountIds.map((accountId) => [accountId, 0]));

  const transactionRows = db.select().from(transactions).all() as TransactionRow[];
  for (const row of transactionRows) {
    if (!row.accountId || !deltaByAccount.has(row.accountId)) continue;
    if (row.status !== "scheduled" || row.occurredOn < today || row.occurredOn > horizonEnd) continue;
    const signed = row.direction === "income" || row.direction === "transfer_in" ? row.amountCents : -row.amountCents;
    deltaByAccount.set(row.accountId, (deltaByAccount.get(row.accountId) ?? 0) + signed);
  }

  const ruleRows = db.select().from(recurringRules).all() as RecurringRuleRow[];
  const ruleById = new Map(ruleRows.map((rule) => [rule.id, rule]));
  const occurrenceRows = db.select().from(recurringOccurrences).all() as RecurringOccurrenceRow[];
  for (const occurrence of occurrenceRows) {
    if (occurrence.status !== "scheduled" || occurrence.dueOn < today || occurrence.dueOn > horizonEnd) continue;
    const rule = ruleById.get(occurrence.ruleId);
    if (!rule || !rule.accountId || !rule.isActive || !deltaByAccount.has(rule.accountId)) continue;
    const signed = rule.direction === "income" || rule.direction === "transfer_in" ? occurrence.amountCents : -occurrence.amountCents;
    deltaByAccount.set(rule.accountId, (deltaByAccount.get(rule.accountId) ?? 0) + signed);
  }

  const cards = db.select().from(creditCards).all() as CardRow[];
  const settlementAccountByCardId = new Map(cards.map((card) => [card.id, card.settlementAccountId]));
  const billRows = db.select().from(creditCardBills).all() as BillRow[];
  for (const bill of billRows) {
    if (bill.status === "paid" || bill.dueOn < today || bill.dueOn > horizonEnd) continue;
    const accountId = settlementAccountByCardId.get(bill.creditCardId);
    if (!accountId || !deltaByAccount.has(accountId)) continue;
    const value = Math.max(bill.totalAmountCents - bill.paidAmountCents, 0);
    deltaByAccount.set(accountId, (deltaByAccount.get(accountId) ?? 0) - value);
  }

  return deltaByAccount;
}

export function listAccountsWithBalances(includeArchived = false) {
  const accountRows = listAccounts(includeArchived);
  const accountIds = accountRows.map((account) => account.id);
  const archivedIds = new Set(listArchivedEntityIds("account"));
  const snapshotRows = listAccountBalanceSnapshots();
  const latestSnapshots = getLatestSnapshotMap(snapshotRows);
  const relatedTransactions = groupByAccountId(db.select().from(transactions).all() as TransactionRow[]);
  const projectedDeltaByAccount = buildProjectionDeltaMap(accountIds);
  const conservativeProjectionTypes = new Set(["investment", "reserve"]);

  return accountRows.map((account) => {
    const related = relatedTransactions.get(account.id) ?? [];
    const balanceTransactions = toBalanceTransactions(related);
    const currentBalanceCents = calculateBalance(account.openingBalanceCents, balanceTransactions);
    const baseProjectedBalanceCents = calculateProjectedBalance(account.openingBalanceCents, balanceTransactions);
    const projectedDeltaCents = conservativeProjectionTypes.has(account.type) ? 0 : (projectedDeltaByAccount.get(account.id) ?? 0);
    const latestSnapshot = latestSnapshots.get(account.id) ?? null;
    const reconciledBalanceCents = latestSnapshot?.balanceCents ?? currentBalanceCents;
    const reconciliationDiffCents = latestSnapshot ? latestSnapshot.balanceCents - currentBalanceCents : 0;
    const projectedDiffCents = latestSnapshot ? baseProjectedBalanceCents + projectedDeltaCents - latestSnapshot.balanceCents : projectedDeltaCents;

    return {
      ...account,
      currentBalanceCents,
      projectedBalanceCents: baseProjectedBalanceCents + projectedDeltaCents,
      projectionMode: conservativeProjectionTypes.has(account.type) ? "current_only" : "account_cashflow",
      latestSnapshot,
      reconciledBalanceCents,
      reconciliationDiffCents,
      projectedDiffCents,
      hasManualReconciliation: Boolean(latestSnapshot),
      isArchivedEntity: archivedIds.has(account.id)
    };
  });
}

export function getAccountsReconciliationSummary() {
  const rows = listAccountsWithBalances();
  const divergent = rows.filter((account) => account.reconciliationDiffCents !== 0);
  return {
    reviewedAccounts: rows.filter((account) => account.latestSnapshot).length,
    divergentAccounts: divergent.length,
    totalAbsoluteDiffCents: divergent.reduce((sum, account) => sum + Math.abs(account.reconciliationDiffCents), 0),
    largestDiff: divergent.sort((a, b) => Math.abs(b.reconciliationDiffCents) - Math.abs(a.reconciliationDiffCents))[0] ?? null
  };
}

export function upsertAccountBalanceSnapshot(values: { accountId: string; snapshotDate: string; balance: string | number; source?: string }) {
  const account = db.select().from(accounts).where(eq(accounts.id, values.accountId)).get();
  if (!account) throw new Error("Conta não encontrada.");
  const now = nowTs();
  const balanceCents = parseCurrencyToCents(values.balance);
  const existing = db
    .select()
    .from(accountBalanceSnapshots)
    .all()
    .find((row) => row.accountId === values.accountId && row.snapshotDate === values.snapshotDate);

  if (existing) {
    db.update(accountBalanceSnapshots)
      .set({ balanceCents, source: values.source ?? existing.source })
      .where(eq(accountBalanceSnapshots.id, existing.id))
      .run();
    return existing.id;
  }

  const id = uid("snap");
  db.insert(accountBalanceSnapshots).values({
    id,
    accountId: values.accountId,
    snapshotDate: values.snapshotDate,
    balanceCents,
    source: values.source ?? "manual",
    createdAt: now
  }).run();
  return id;
}

export function deleteAccountSnapshot(snapshotId: string) {
  db.delete(accountBalanceSnapshots).where(eq(accountBalanceSnapshots.id, snapshotId)).run();
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
    snapshotDate: todayIso(),
    balanceCents: openingBalanceCents,
    source: "opening_balance",
    createdAt: now
  }).run();
  return id;
}

export function updateAccount(values: {
  accountId: string;
  name: string;
  institution?: string;
  type: string;
  openingBalance?: string | number;
  color?: string;
  notes?: string;
  includeInNetWorth?: boolean;
}) {
  const account = getAccountById(values.accountId);
  if (!account) throw new Error("Conta não encontrada.");
  const now = nowTs();
  db.update(accounts).set({
    name: values.name,
    institution: values.institution ?? "",
    type: values.type,
    slug: slugify(values.name) || account.slug,
    openingBalanceCents: values.openingBalance === undefined ? account.openingBalanceCents : parseCurrencyToCents(values.openingBalance),
    color: values.color ?? account.color,
    notes: values.notes ?? account.notes,
    includeInNetWorth: values.includeInNetWorth ?? account.includeInNetWorth,
    updatedAt: now
  }).where(eq(accounts.id, account.id)).run();
  return account.id;
}

export function archiveAccount(accountId: string, reason = "") {
  const account = getAccountById(accountId);
  if (!account) throw new Error("Conta não encontrada.");
  db.update(accounts).set({ isArchived: true, updatedAt: nowTs() }).where(eq(accounts.id, account.id)).run();
  archiveEntity("account", account.id, reason, { name: account.name });
}

export function restoreAccount(accountId: string) {
  const account = getAccountById(accountId);
  if (!account) throw new Error("Conta não encontrada.");
  db.update(accounts).set({ isArchived: false, updatedAt: nowTs() }).where(eq(accounts.id, account.id)).run();
  restoreEntity("account", account.id);
}

export function getDailyAccountChecklist(date = todayIso()) {
  return listAccountsWithBalances().map((account) => {
    const sameDaySnapshot = listAccountBalanceSnapshots(account.id).find((snapshot) => snapshot.snapshotDate === date) ?? account.latestSnapshot;
    return {
      ...account,
      targetDate: date,
      snapshotForDate: sameDaySnapshot ?? null,
      suggestedAdjustmentCents: sameDaySnapshot ? sameDaySnapshot.balanceCents - account.currentBalanceCents : 0
    };
  });
}
