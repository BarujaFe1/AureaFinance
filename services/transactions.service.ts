import { db } from "@/db/client";
import { accounts as accountsTable, transfers, transactions } from "@/db/schema";
import { isoMonth, nowTs } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { uid } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import type { TransactionCreateInput } from "@/lib/validation";
import { repairMojibake } from "@/lib/text";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";

export function listTransactions(params?: { month?: string; accountId?: string; limit?: number; includeArchived?: boolean }) {
  const archivedIds = params?.includeArchived ? new Set<string>() : new Set(listArchivedEntityIds("transaction"));
  let rows = db.select().from(transactions).orderBy(desc(transactions.occurredOn), desc(transactions.createdAt)).all();
  if (!params?.includeArchived) rows = rows.filter((row) => !archivedIds.has(row.id));
  if (params?.month) rows = rows.filter((row) => row.competenceMonth === params.month);
  if (params?.accountId) rows = rows.filter((row) => row.accountId === params.accountId);
  return rows.slice(0, params?.limit ?? rows.length).map((row) => ({
    ...row,
    description: repairMojibake(row.description),
    counterparty: repairMojibake(row.counterparty ?? ""),
    notes: repairMojibake(row.notes ?? ""),
    isArchivedEntity: archivedIds.has(row.id)
  }));
}

export function listArchivedTransactions() {
  const archivedIds = new Set(listArchivedEntityIds("transaction"));
  return db.select().from(transactions).orderBy(desc(transactions.occurredOn), desc(transactions.createdAt)).all()
    .filter((row) => archivedIds.has(row.id))
    .map((row) => ({
      ...row,
      description: repairMojibake(row.description),
      counterparty: repairMojibake(row.counterparty ?? ""),
      notes: repairMojibake(row.notes ?? ""),
      isArchivedEntity: true
    }));
}

export function createTransaction(input: TransactionCreateInput) {
  const now = nowTs();
  db.insert(transactions).values({
    id: uid("txn"),
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    subcategoryId: input.subcategoryId ?? null,
    transferId: null,
    recurringOccurrenceId: null,
    sourceImportRowId: null,
    sourceImportBatchId: null,
    direction: input.direction,
    status: input.status,
    description: input.description,
    counterparty: "",
    amountCents: parseCurrencyToCents(input.amount),
    occurredOn: input.occurredOn,
    dueOn: input.dueOn ?? input.occurredOn,
    competenceMonth: isoMonth(input.occurredOn),
    notes: input.notes ?? "",
    isProjected: input.status !== "posted",
    createdAt: now,
    updatedAt: now
  }).run();
}

export function updateTransaction(id: string, input: TransactionCreateInput) {
  const existing = db.select().from(transactions).where(eq(transactions.id, id)).get();
  if (!existing) throw new Error("Transação não encontrada.");
  const now = nowTs();
  db.update(transactions).set({
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    subcategoryId: input.subcategoryId ?? null,
    direction: input.direction,
    status: input.status,
    description: input.description,
    amountCents: parseCurrencyToCents(input.amount),
    occurredOn: input.occurredOn,
    dueOn: input.dueOn ?? input.occurredOn,
    competenceMonth: isoMonth(input.occurredOn),
    notes: input.notes ?? "",
    isProjected: input.status !== "posted",
    updatedAt: now
  }).where(eq(transactions.id, id)).run();
}

export function archiveTransaction(id: string, reason = "Arquivada pela UI") {
  const existing = db.select().from(transactions).where(eq(transactions.id, id)).get();
  if (!existing) throw new Error("Transação não encontrada.");
  archiveEntity("transaction", id, reason, {
    description: existing.description,
    amountCents: existing.amountCents,
    occurredOn: existing.occurredOn
  });
}

export function restoreTransaction(id: string) {
  restoreEntity("transaction", id);
}

export function deleteTransaction(id: string) {
  db.delete(transactions).where(eq(transactions.id, id)).run();
}

export function createTransfer(values: { fromAccountId: string; toAccountId: string; amountCents: number; occurredOn: string; notes?: string }) {
  const now = nowTs();
  const transferId = uid("trf");
  const outId = uid("txn");
  const inId = uid("txn");
  const fromAccount = db.select().from(accountsTable).where(eq(accountsTable.id, values.fromAccountId)).get();
  const toAccount = db.select().from(accountsTable).where(eq(accountsTable.id, values.toAccountId)).get();
  const fromName = fromAccount?.name ?? values.fromAccountId;
  const toName = toAccount?.name ?? values.toAccountId;
  db.insert(transfers).values({
    id: transferId,
    fromAccountId: values.fromAccountId,
    toAccountId: values.toAccountId,
    amountCents: values.amountCents,
    occurredOn: values.occurredOn,
    notes: values.notes ?? "",
    outTransactionId: outId,
    inTransactionId: inId,
    createdAt: now
  }).run();
  db.insert(transactions).values([
    {
      id: outId,
      accountId: values.fromAccountId,
      direction: "transfer_out",
      status: "posted",
      description: `Transferência para ${toName}`,
      counterparty: toName,
      amountCents: values.amountCents,
      occurredOn: values.occurredOn,
      dueOn: values.occurredOn,
      competenceMonth: isoMonth(values.occurredOn),
      notes: values.notes ?? "",
      isProjected: false,
      transferId,
      createdAt: now,
      updatedAt: now
    },
    {
      id: inId,
      accountId: values.toAccountId,
      direction: "transfer_in",
      status: "posted",
      description: `Transferência recebida de ${fromName}`,
      counterparty: fromName,
      amountCents: values.amountCents,
      occurredOn: values.occurredOn,
      dueOn: values.occurredOn,
      competenceMonth: isoMonth(values.occurredOn),
      notes: values.notes ?? "",
      isProjected: false,
      transferId,
      createdAt: now,
      updatedAt: now
    }
  ]).run();
}
