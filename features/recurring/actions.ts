"use server";

import { revalidatePath } from "next/cache";
import { recurringRuleCreateSchema } from "@/lib/validation";
import { archiveRecurringRule, createRecurringRule, deleteRecurringRule, duplicateRecurringRule, materializeAllRules, pauseRecurringRule, reactivateRecurringRule, restoreRecurringRule, settleOccurrence, skipRecurringOccurrence, updateRecurringOccurrence, updateRecurringRuleSeries } from "@/services/recurring.service";

function revalidateRecurringRoutes() {
  revalidatePath("/recurring");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/future");
  revalidatePath("/daily");
  revalidatePath("/calendar");
  revalidatePath("/closings");
}

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
  revalidateRecurringRoutes();
}

export async function materializeAllRulesAction() {
  materializeAllRules();
  revalidateRecurringRoutes();
}

export async function settleOccurrenceAction(formData: FormData) {
  settleOccurrence(String(formData.get("occurrenceId") ?? ""));
  revalidateRecurringRoutes();
}

export async function updateRecurringRuleSeriesAction(formData: FormData) {
  updateRecurringRuleSeries({
    ruleId: String(formData.get("ruleId") ?? ""),
    title: String(formData.get("title") ?? ""),
    accountId: String(formData.get("accountId") ?? ""),
    categoryId: formData.get("categoryId") ? String(formData.get("categoryId")) : undefined,
    direction: String(formData.get("direction") ?? "expense"),
    frequency: String(formData.get("frequency") ?? "monthly"),
    amount: String(formData.get("amount") ?? "0"),
    startsOn: String(formData.get("startsOn") ?? new Date().toISOString().slice(0, 10)),
    nextRunOn: String(formData.get("nextRunOn") ?? new Date().toISOString().slice(0, 10)),
    notes: String(formData.get("notes") ?? ""),
    scope: String(formData.get("scope") ?? "future") === "entire" ? "entire" : "future",
    effectiveFrom: formData.get("effectiveFrom") ? String(formData.get("effectiveFrom")) : undefined
  });
  revalidateRecurringRoutes();
}

export async function updateRecurringOccurrenceAction(formData: FormData) {
  updateRecurringOccurrence({
    occurrenceId: String(formData.get("occurrenceId") ?? ""),
    dueOn: String(formData.get("dueOn") ?? new Date().toISOString().slice(0, 10)),
    amount: String(formData.get("amount") ?? "0"),
    notes: String(formData.get("notes") ?? "")
  });
  revalidateRecurringRoutes();
}

export async function skipRecurringOccurrenceAction(formData: FormData) {
  skipRecurringOccurrence(String(formData.get("occurrenceId") ?? ""));
  revalidateRecurringRoutes();
}

export async function pauseRecurringRuleAction(formData: FormData) {
  pauseRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}

export async function reactivateRecurringRuleAction(formData: FormData) {
  reactivateRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}

export async function duplicateRecurringRuleAction(formData: FormData) {
  duplicateRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}

export async function archiveRecurringRuleAction(formData: FormData) {
  archiveRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}

export async function restoreRecurringRuleAction(formData: FormData) {
  restoreRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}

export async function deleteRecurringRuleAction(formData: FormData) {
  deleteRecurringRule(String(formData.get("ruleId") ?? ""));
  revalidateRecurringRoutes();
}
