"use server";

import { revalidatePath } from "next/cache";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import { createTransaction, deleteTransaction, updateTransaction } from "@/services/transactions.service";

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

export async function deleteTransactionAction(id: string) {
  deleteTransaction(id);
  revalidateTransactionRoutes();
}
