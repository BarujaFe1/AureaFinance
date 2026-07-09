"use server";

import { revalidatePath } from "next/cache";
import { upsertBudget, deleteBudget } from "@/services/budget.service";
import { budgetUpsertSchema } from "@/lib/validation";

export async function upsertBudgetAction(formData: FormData) {
  const parsed = budgetUpsertSchema.parse({
    categoryId: String(formData.get("categoryId") ?? ""),
    month: String(formData.get("month") ?? ""),
    limitCents: String(formData.get("limitCents") ?? "0")
  });

  upsertBudget(parsed.categoryId, parsed.month, parsed.limitCents);

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/closings");
}

export async function deleteBudgetAction(formData: FormData) {
  const id = String(formData.get("budgetId") ?? "");
  deleteBudget(id);

  revalidatePath("/categories");
  revalidatePath("/dashboard");
  revalidatePath("/closings");
}
