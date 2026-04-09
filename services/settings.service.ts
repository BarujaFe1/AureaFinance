import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nowTs } from "@/lib/dates";

export function getSettings() {
  return db.select().from(settings).where(eq(settings.id, "main")).get();
}

export function ensureSettings() {
  const existing = getSettings();
  if (existing) return existing;
  const now = nowTs();
  db
    .insert(settings)
    .values({
      id: "main",
      baseCurrency: "BRL",
      locale: "pt-BR",
      projectionMonths: 6,
      themePreference: "system",
      userDisplayName: "Você",
      isOnboarded: false,
      createdAt: now,
      updatedAt: now
    })
    .run();
  return getSettings()!;
}
