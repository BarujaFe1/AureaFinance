"use server";

import { revalidatePath } from "next/cache";
import { cardPurchaseCreateSchema, creditCardCreateSchema } from "@/lib/validation";
import { archiveCreditCard, createCardPurchase, createCreditCard, deleteCardPurchase, markBillPaid, restoreCreditCard, updateCardPurchase, updateCreditCard } from "@/services/cards.service";

function revalidateCardRoutes() {
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/future");
}

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
  revalidateCardRoutes();
}

export async function updateCreditCardAction(formData: FormData) {
  updateCreditCard({
    cardId: String(formData.get("cardId") ?? ""),
    name: String(formData.get("name") ?? ""),
    brand: String(formData.get("brand") ?? ""),
    network: String(formData.get("network") ?? ""),
    limitAmount: String(formData.get("limitAmount") ?? "0"),
    closeDay: Number(formData.get("closeDay") ?? 1),
    dueDay: Number(formData.get("dueDay") ?? 1),
    settlementAccountId: String(formData.get("settlementAccountId") ?? ""),
    color: String(formData.get("color") ?? "#111827")
  });
  revalidateCardRoutes();
}

export async function archiveCreditCardAction(formData: FormData) {
  archiveCreditCard(String(formData.get("cardId") ?? ""));
  revalidateCardRoutes();
}

export async function restoreCreditCardAction(formData: FormData) {
  restoreCreditCard(String(formData.get("cardId") ?? ""));
  revalidateCardRoutes();
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
  revalidateCardRoutes();
}

export async function updateCardPurchaseAction(formData: FormData) {
  updateCardPurchase({
    purchaseId: String(formData.get("purchaseId") ?? ""),
    creditCardId: String(formData.get("creditCardId") ?? ""),
    description: String(formData.get("description") ?? ""),
    purchaseDate: String(formData.get("purchaseDate") ?? new Date().toISOString().slice(0, 10)),
    amount: String(formData.get("amount") ?? "0"),
    installmentCount: Number(formData.get("installmentCount") ?? 1),
    categoryId: formData.get("categoryId") ? String(formData.get("categoryId")) : undefined,
    notes: String(formData.get("notes") ?? "")
  });
  revalidateCardRoutes();
}

export async function deleteCardPurchaseAction(formData: FormData) {
  deleteCardPurchase(String(formData.get("purchaseId") ?? ""));
  revalidateCardRoutes();
}

export async function markBillPaidAction(formData: FormData) {
  markBillPaid(String(formData.get("billId") ?? ""));
  revalidateCardRoutes();
}
