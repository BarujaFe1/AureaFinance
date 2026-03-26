import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { recurringOccurrences, recurringRules, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { isoMonth, nowTs } from "@/lib/dates";
import { materializeOccurrences, type TransactionDirection } from "@/lib/finance";
import { uid } from "@/lib/utils";
import type { RecurringRuleCreateInput } from "@/lib/validation";

function normalizeDirection(value: string): TransactionDirection {
  return ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"].includes(value) ? (value as TransactionDirection) : "expense";
}

function normalizeFrequency(value: string): "weekly" | "monthly" | "yearly" {
  return value === "weekly" || value === "yearly" ? value : "monthly";
}

export function listRecurringRules() {
  return db.select().from(recurringRules).all().map((rule) => ({
    ...rule,
    occurrences: db.select().from(recurringOccurrences).all().filter((occurrence) => occurrence.ruleId === rule.id).sort((a, b) => a.dueOn.localeCompare(b.dueOn))
  }));
}

export function createRecurringRule(input: RecurringRuleCreateInput) {
  const now = nowTs();
  const id = uid("rr");
  db.insert(recurringRules).values({
    id,
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    title: input.title,
    direction: input.direction,
    frequency: input.frequency,
    amountCents: parseCurrencyToCents(input.amount),
    startsOn: input.startsOn,
    endsOn: null,
    nextRunOn: input.nextRunOn,
    autoPost: false,
    notes: input.notes ?? "",
    isActive: true,
    createdAt: now,
    updatedAt: now
  }).run();
  materializeRule(id);
}

export function materializeRule(ruleId: string) {
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, ruleId)).get();
  if (!rule) return;
  const generated = materializeOccurrences({
    nextRunOn: rule.nextRunOn,
    endsOn: rule.endsOn,
    frequency: normalizeFrequency(rule.frequency),
    amountCents: rule.amountCents,
    direction: normalizeDirection(rule.direction)
  });
  const now = nowTs();
  for (const occurrence of generated) {
    const exists = db.select().from(recurringOccurrences).all().find((row) => row.ruleId === rule.id && row.dueOn === occurrence.dueOn);
    if (exists) continue;
    db.insert(recurringOccurrences).values({
      id: uid("ro"),
      ruleId: rule.id,
      dueOn: occurrence.dueOn,
      amountCents: occurrence.amountCents,
      direction: occurrence.direction,
      status: "scheduled",
      transactionId: null,
      notes: "",
      createdAt: now,
      updatedAt: now
    }).run();
  }
}

export function materializeAllRules() {
  db.select().from(recurringRules).where(eq(recurringRules.isActive, true)).all().forEach((rule) => materializeRule(rule.id));
}

export function settleOccurrence(occurrenceId: string) {
  const occurrence = db.select().from(recurringOccurrences).where(eq(recurringOccurrences.id, occurrenceId)).get();
  if (!occurrence) throw new Error("OcorrÃªncia nÃ£o encontrada.");
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, occurrence.ruleId)).get();
  if (!rule) throw new Error("Regra nÃ£o encontrada.");
  const now = nowTs();
  const transactionId = uid("txn");
  db.insert(transactions).values({
    id: transactionId,
    accountId: rule.accountId,
    categoryId: rule.categoryId,
    subcategoryId: null,
    transferId: null,
    recurringOccurrenceId: occurrence.id,
    sourceImportRowId: null,
    direction: occurrence.direction,
    status: "posted",
    description: rule.title,
    counterparty: "",
    amountCents: occurrence.amountCents,
    occurredOn: occurrence.dueOn,
    dueOn: occurrence.dueOn,
    competenceMonth: isoMonth(occurrence.dueOn),
    notes: "Gerado a partir de recorrÃªncia.",
    isProjected: false,
    createdAt: now,
    updatedAt: now
  }).run();
  db.update(recurringOccurrences).set({ status: "posted", transactionId, updatedAt: now }).where(eq(recurringOccurrences.id, occurrence.id)).run();
}
