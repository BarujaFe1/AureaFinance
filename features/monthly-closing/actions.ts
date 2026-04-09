"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { reopenMonthlyClosing, runMonthlyClosing } from "@/services/monthly-closing.service";

export async function runMonthlyClosingAction(formData: FormData) {
  runMonthlyClosing(String(formData.get("month") ?? new Date().toISOString().slice(0, 7)));
  revalidatePath("/closings");
  revalidatePath("/dashboard");
  revalidatePath("/future");
  revalidateTag("cashflow");
}


export async function reopenMonthlyClosingAction(formData: FormData) {
  reopenMonthlyClosing(String(formData.get("month") ?? ""));
  revalidatePath("/closings");
  revalidatePath("/dashboard");
  revalidatePath("/future");
  revalidateTag("cashflow");
}
