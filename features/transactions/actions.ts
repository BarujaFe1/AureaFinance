"use server";

import { revalidatePath } from "next/cache";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import { createTransaction, deleteTransaction } from "@/services/transactions.service";

export async function createTransactionAction(input: TransactionCreateInput) {
  createTransaction(transactionCreateSchema.parse(input));
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}

export async function deleteTransactionAction(id: string) {
  deleteTransaction(id);
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}
