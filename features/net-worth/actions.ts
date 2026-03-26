"use server";

import { revalidatePath } from "next/cache";
import { upsertNetWorthSummary } from "@/services/net-worth.service";

export async function saveNetWorthAction(formData: FormData) {
  upsertNetWorthSummary({
    month: String(formData.get("month") ?? new Date().toISOString().slice(0, 7)),
    reserves: String(formData.get("reserves") ?? "0"),
    investments: String(formData.get("investments") ?? "0"),
    debts: String(formData.get("debts") ?? "0"),
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/net-worth");
  revalidatePath("/dashboard");
}
