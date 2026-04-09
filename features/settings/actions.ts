"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { settingsUpdateSchema } from "@/lib/validation";
import { ensureSettings } from "@/services/settings.service";

export async function updateSettingsAction(formData: FormData) {
  ensureSettings();
  const parsed = settingsUpdateSchema.parse({
    userDisplayName: String(formData.get("userDisplayName") ?? "Você"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    themePreference: String(formData.get("themePreference") ?? "system"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6)
  });

  db.update(settings).set({ ...parsed, updatedAt: nowTs() }).where(eq(settings.id, "main")).run();

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/future");
}

export async function completeOnboardingAction(formData: FormData) {
  ensureSettings();
  const parsed = settingsUpdateSchema.parse({
    userDisplayName: String(formData.get("userDisplayName") ?? "Você"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    themePreference: String(formData.get("themePreference") ?? "system"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6)
  });

  db.update(settings).set({ ...parsed, isOnboarded: true, updatedAt: nowTs() }).where(eq(settings.id, "main")).run();

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
