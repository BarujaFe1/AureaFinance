import { db } from "@/db/client";
import { settings } from "@/db/schema";

export function getSettingsSnapshot() {
  return db.select().from(settings).limit(1).get() ?? null;
}
