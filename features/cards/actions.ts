"use server";

import { revalidatePath } from "next/cache";
import { cardPurchaseCreateSchema, creditCardCreateSchema } from "@/lib/validation";
import { createCardPurchase, createCreditCard, markBillPaid } from "@/services/cards.service";

export async function createCreditCardAction(formData: FormData) {
  createCreditCard(creditCardCreateSchema.parse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    network: formData.get("network"),
    limitAmount: formData.get("limitAmount"),
    closeDay: formData.get("closeDay"),
    dueDay: formData.get("dueDay"),
    settlementAccountId: formData.get("settlementAccountId")
  }));
  revalidatePath("/cards");
  revalidatePath("/dashboard");
}

export async function createCardPurchaseAction(formData: FormData) {
  createCardPurchase(cardPurchaseCreateSchema.parse({
    creditCardId: formData.get("creditCardId"),
    description: formData.get("description"),
    purchaseDate: formData.get("purchaseDate"),
    amount: formData.get("amount"),
    installmentCount: formData.get("installmentCount"),
    categoryId: formData.get("categoryId") || undefined,
    notes: formData.get("notes")
  }));
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/dashboard");
}

export async function markBillPaidAction(formData: FormData) {
  markBillPaid(String(formData.get("billId") ?? ""));
  revalidatePath("/bills");
  revalidatePath("/cards");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}
