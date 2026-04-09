"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeFinancialOnboarding, type FinancialOnboardingPayload } from "@/services/onboarding.service";

function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseThemePreference(value: FormDataEntryValue | null): FinancialOnboardingPayload["themePreference"] {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

function parseDestination(value: FormDataEntryValue | null): FinancialOnboardingPayload["destination"] {
  return value === "import" ? "import" : "dashboard";
}

function parseSource(value: FormDataEntryValue | null): FinancialOnboardingPayload["source"] {
  return value === "money" ? "money" : "manual";
}

export async function completeFinancialOnboardingAction(formData: FormData) {
  const payload: FinancialOnboardingPayload = {
    source: parseSource(formData.get("source")),
    userDisplayName: String(formData.get("userDisplayName") ?? "Você"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6),
    themePreference: parseThemePreference(formData.get("themePreference")),
    destination: parseDestination(formData.get("destination")),
    accounts: parseJsonField(formData, "accountsJson", []),
    cards: parseJsonField(formData, "cardsJson", []),
    netWorth: parseJsonField(formData, "netWorthJson", {
      month: new Date().toISOString().slice(0, 7),
      reserves: "0",
      investments: "0",
      debts: "0",
      notes: ""
    }),
    recurring: parseJsonField(formData, "recurringJson", [])
  };

  const destination = completeFinancialOnboarding(payload);

  revalidatePath("/");
  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/recurring");
  revalidatePath("/calendar");
  revalidatePath("/closings");
  revalidatePath("/future");
  revalidatePath("/net-worth");
  revalidatePath("/settings");
  revalidatePath("/import");

  redirect(destination);
}
