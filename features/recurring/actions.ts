"use server";

import { revalidatePath } from "next/cache";
import { recurringRuleCreateSchema } from "@/lib/validation";
import { createRecurringRule, materializeAllRules, settleOccurrence } from "@/services/recurring.service";

export async function createRecurringRuleAction(formData: FormData) {
  createRecurringRule(recurringRuleCreateSchema.parse({
    title: formData.get("title"),
    accountId: formData.get("accountId"),
    direction: formData.get("direction"),
    amount: formData.get("amount"),
    startsOn: formData.get("startsOn"),
    nextRunOn: formData.get("nextRunOn"),
    frequency: formData.get("frequency"),
    categoryId: formData.get("categoryId") || undefined,
    notes: formData.get("notes")
  }));
  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}

export async function materializeAllRulesAction() {
  materializeAllRules();
  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}

export async function settleOccurrenceAction(formData: FormData) {
  settleOccurrence(String(formData.get("occurrenceId") ?? ""));
  revalidatePath("/recurring");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
