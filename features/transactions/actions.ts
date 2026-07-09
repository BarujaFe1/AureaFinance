"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { transactions } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import {
  archiveTransaction,
  createTransaction,
  deleteTransaction,
  restoreTransaction,
  updateTransaction
} from "@/services/transactions.service";

function revalidateTransactionRoutes() {
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/future");
  revalidatePath("/daily");
}

export async function createTransactionAction(input: TransactionCreateInput) {
  createTransaction(transactionCreateSchema.parse(input));
  revalidateTransactionRoutes();
}

export async function updateTransactionAction(id: string, input: TransactionCreateInput) {
  updateTransaction(id, transactionCreateSchema.parse(input));
  revalidateTransactionRoutes();
}

export async function updateTransactionFormAction(formData: FormData) {
  updateTransaction(String(formData.get("id") ?? ""), transactionCreateSchema.parse({
    accountId: formData.get("accountId"),
    description: formData.get("description"),
    amount: formData.get("amount"),
    direction: formData.get("direction"),
    status: formData.get("status"),
    occurredOn: formData.get("occurredOn"),
    dueOn: formData.get("dueOn") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    subcategoryId: undefined,
    notes: formData.get("notes") || ""
  }));
  revalidateTransactionRoutes();
}

export async function archiveTransactionAction(formData: FormData) {
  archiveTransaction(String(formData.get("id") ?? ""));
  revalidateTransactionRoutes();
}

export async function restoreTransactionAction(formData: FormData) {
  restoreTransaction(String(formData.get("id") ?? ""));
  revalidateTransactionRoutes();
}

export async function deleteTransactionAction(id: string) {
  deleteTransaction(id);
  revalidateTransactionRoutes();
}

export async function deleteTransactionFormAction(formData: FormData) {
  deleteTransaction(String(formData.get("id") ?? ""));
  revalidateTransactionRoutes();
}

export async function batchArchiveTransactionsAction(formData: FormData) {
  const idsJson = String(formData.get("ids") ?? "[]");
  const ids: string[] = JSON.parse(idsJson);
  for (const id of ids) archiveTransaction(id, "Arquivada em lote");
  revalidateTransactionRoutes();
}

export async function batchDeleteTransactionsAction(formData: FormData) {
  const idsJson = String(formData.get("ids") ?? "[]");
  const ids: string[] = JSON.parse(idsJson);
  for (const id of ids) deleteTransaction(id);
  revalidateTransactionRoutes();
}

export async function batchCategorizeTransactionsAction(formData: FormData) {
  const idsJson = String(formData.get("ids") ?? "[]");
  const categoryId = String(formData.get("categoryId") ?? "");
  if (!categoryId) return;
  const ids: string[] = JSON.parse(idsJson);
  const now = nowTs();
  for (const id of ids) {
    db.update(transactions).set({ categoryId, updatedAt: now }).where(eq(transactions.id, id)).run();
  }
  revalidateTransactionRoutes();
}

export async function batchChangeStatusAction(formData: FormData) {
  const idsJson = String(formData.get("ids") ?? "[]");
  const status = String(formData.get("status") ?? "");
  if (!["posted", "scheduled", "void"].includes(status)) return;
  const ids: string[] = JSON.parse(idsJson);
  const now = nowTs();
  for (const id of ids) {
    db.update(transactions).set({ status, isProjected: status !== "posted", updatedAt: now }).where(eq(transactions.id, id)).run();
  }
  revalidateTransactionRoutes();
}

export async function batchChangeAccountAction(formData: FormData) {
  const idsJson = String(formData.get("ids") ?? "[]");
  const accountId = String(formData.get("accountId") ?? "");
  if (!accountId) return;
  const ids: string[] = JSON.parse(idsJson);
  const now = nowTs();
  for (const id of ids) {
    db.update(transactions).set({ accountId, updatedAt: now }).where(eq(transactions.id, id)).run();
  }
  revalidateTransactionRoutes();
}
