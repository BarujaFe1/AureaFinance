import { db } from "@/db/client";
import { transfers, transactions } from "@/db/schema";
import { isoMonth, nowTs } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { uid } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import type { TransactionCreateInput } from "@/lib/validation";

export function listTransactions(params?: { month?: string; accountId?: string; limit?: number }) {
  let rows = db.select().from(transactions).orderBy(desc(transactions.occurredOn), desc(transactions.createdAt)).all();
  if (params?.month) rows = rows.filter((row) => row.competenceMonth === params.month);
  if (params?.accountId) rows = rows.filter((row) => row.accountId === params.accountId);
  return rows.slice(0, params?.limit ?? rows.length);
}

export function createTransaction(input: TransactionCreateInput) {
  const now = nowTs();
  db.insert(transactions).values({
    id: uid("txn"),
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    subcategoryId: input.subcategoryId ?? null,
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

export function deleteTransaction(id: string) {
  db.delete(transactions).where(eq(transactions.id, id)).run();
}

export function createTransfer(values: { fromAccountId: string; toAccountId: string; amountCents: number; occurredOn: string; notes?: string }) {
  const now = nowTs();
  const transferId = uid("trf");
  const outId = uid("txn");
  const inId = uid("txn");
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
      description: `Transferência para ${values.toAccountId}`,
      counterparty: values.toAccountId,
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
      description: `Transferência recebida de ${values.fromAccountId}`,
      counterparty: values.fromAccountId,
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
