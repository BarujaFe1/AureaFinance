import { db } from "@/db/client";
import { recurringOccurrences, recurringRules } from "@/db/schema";

export function getRecurringSnapshot() {
  const rules = db.select().from(recurringRules).all();
  const occurrences = db.select().from(recurringOccurrences).all();
  return rules.map((rule) => ({
    ...rule,
    occurrences: occurrences.filter((o) => o.ruleId === rule.id).slice(0, 12)
  }));
}
