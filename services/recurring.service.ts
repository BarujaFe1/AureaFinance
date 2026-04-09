import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { recurringOccurrences, recurringRules, transactions } from "@/db/schema";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";
import { addDaysIso, addMonthsIso, isoMonth, nowTs, todayIso } from "@/lib/dates";
import { materializeOccurrences, type TransactionDirection } from "@/lib/finance";
import { parseCurrencyToCents } from "@/lib/currency";
import { uid } from "@/lib/utils";
import type { RecurringRuleCreateInput } from "@/lib/validation";
import { ensureSettings } from "@/services/settings.service";

function normalizeDirection(value: string): TransactionDirection {
  return ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"].includes(value) ? (value as TransactionDirection) : "expense";
}

function normalizeFrequency(value: string): "weekly" | "monthly" | "yearly" {
  return value === "weekly" || value === "yearly" ? value : "monthly";
}

function getRecurringHorizonMonths() {
  return Math.max(ensureSettings().projectionMonths, 6);
}

function addRuleStep(date: string, frequency: "weekly" | "monthly" | "yearly") {
  if (frequency === "weekly") return addDaysIso(date, 7);
  if (frequency === "yearly") return addMonthsIso(date, 12);
  return addMonthsIso(date, 1);
}

function coerceNextRunOn(rule: typeof recurringRules.$inferSelect) {
  const today = todayIso();
  const frequency = normalizeFrequency(rule.frequency);
  let cursor = rule.nextRunOn || rule.startsOn;
  if (!cursor) return today;
  let guard = 0;
  while (cursor < today && guard < 240) {
    cursor = addRuleStep(cursor, frequency);
    guard += 1;
  }
  return cursor;
}

function materializeRuleToHorizon(ruleId: string, horizonMonths = getRecurringHorizonMonths()) {
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, ruleId)).get();
  if (!rule || !rule.isActive || listArchivedEntityIds("recurring_rule").includes(rule.id)) return;
  const effectiveNextRunOn = coerceNextRunOn(rule);
  if (effectiveNextRunOn !== rule.nextRunOn) {
    db.update(recurringRules).set({ nextRunOn: effectiveNextRunOn, updatedAt: nowTs() }).where(eq(recurringRules.id, rule.id)).run();
  }
  const generated = materializeOccurrences({
    nextRunOn: effectiveNextRunOn,
    endsOn: rule.endsOn,
    frequency: normalizeFrequency(rule.frequency),
    amountCents: rule.amountCents,
    direction: normalizeDirection(rule.direction)
  }, horizonMonths);
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

function replaceFutureOccurrences(ruleId: string, effectiveDate: string) {
  const rows = db.select().from(recurringOccurrences).all().filter((occurrence) => occurrence.ruleId === ruleId && occurrence.dueOn >= effectiveDate && occurrence.status === "scheduled");
  for (const row of rows) db.delete(recurringOccurrences).where(eq(recurringOccurrences.id, row.id)).run();
}

export function listRecurringRules(includeArchived = false) {
  materializeAllRules();
  const archivedIds = new Set(listArchivedEntityIds("recurring_rule"));
  const occurrences = db.select().from(recurringOccurrences).all();
  return db.select().from(recurringRules).all()
    .filter((rule) => includeArchived || !archivedIds.has(rule.id))
    .map((rule) => ({
      ...rule,
      isArchivedEntity: archivedIds.has(rule.id),
      occurrences: occurrences
        .filter((occurrence) => occurrence.ruleId === rule.id)
        .sort((a, b) => a.dueOn.localeCompare(b.dueOn))
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
  materializeRuleToHorizon(id);
}

export function materializeRule(ruleId: string) {
  materializeRuleToHorizon(ruleId);
}

export function materializeAllRules() {
  db.select().from(recurringRules).where(eq(recurringRules.isActive, true)).all().forEach((rule) => materializeRuleToHorizon(rule.id));
}

export function settleOccurrence(occurrenceId: string) {
  const occurrence = db.select().from(recurringOccurrences).where(eq(recurringOccurrences.id, occurrenceId)).get();
  if (!occurrence) throw new Error("Ocorrência não encontrada.");
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, occurrence.ruleId)).get();
  if (!rule) throw new Error("Regra não encontrada.");
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
    notes: "Gerado a partir de recorrência.",
    isProjected: false,
    createdAt: now,
    updatedAt: now
  }).run();
  db.update(recurringOccurrences).set({ status: "posted", transactionId, updatedAt: now }).where(eq(recurringOccurrences.id, occurrence.id)).run();
  materializeRuleToHorizon(rule.id);
}

export function updateRecurringRuleSeries(values: {
  ruleId: string;
  title: string;
  accountId: string;
  categoryId?: string | null;
  direction: string;
  frequency: string;
  amount: string | number;
  startsOn: string;
  nextRunOn: string;
  notes?: string;
  scope: "future" | "entire";
  effectiveFrom?: string;
}) {
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, values.ruleId)).get();
  if (!rule) throw new Error("Regra não encontrada.");
  const now = nowTs();
  const effectiveFrom = values.scope === "future" ? (values.effectiveFrom || values.nextRunOn || rule.nextRunOn) : (values.nextRunOn || rule.nextRunOn);
  db.update(recurringRules).set({
    title: values.title,
    accountId: values.accountId,
    categoryId: values.categoryId || null,
    direction: normalizeDirection(values.direction),
    frequency: normalizeFrequency(values.frequency),
    amountCents: parseCurrencyToCents(values.amount),
    startsOn: values.startsOn,
    nextRunOn: effectiveFrom,
    notes: values.notes ?? "",
    updatedAt: now
  }).where(eq(recurringRules.id, rule.id)).run();

  replaceFutureOccurrences(rule.id, effectiveFrom);
  materializeRuleToHorizon(rule.id);
}

export function updateRecurringOccurrence(values: { occurrenceId: string; dueOn: string; amount: string | number; notes?: string }) {
  const occurrence = db.select().from(recurringOccurrences).where(eq(recurringOccurrences.id, values.occurrenceId)).get();
  if (!occurrence) throw new Error("Ocorrência não encontrada.");
  db.update(recurringOccurrences).set({
    dueOn: values.dueOn,
    amountCents: parseCurrencyToCents(values.amount),
    notes: values.notes ?? occurrence.notes,
    updatedAt: nowTs()
  }).where(eq(recurringOccurrences.id, occurrence.id)).run();
}

export function skipRecurringOccurrence(occurrenceId: string) {
  const occurrence = db.select().from(recurringOccurrences).where(eq(recurringOccurrences.id, occurrenceId)).get();
  if (!occurrence) throw new Error("Ocorrência não encontrada.");
  db.update(recurringOccurrences).set({ status: "void", updatedAt: nowTs() }).where(eq(recurringOccurrences.id, occurrence.id)).run();
}

export function pauseRecurringRule(ruleId: string) {
  db.update(recurringRules).set({ isActive: false, updatedAt: nowTs() }).where(eq(recurringRules.id, ruleId)).run();
}

export function reactivateRecurringRule(ruleId: string) {
  db.update(recurringRules).set({ isActive: true, updatedAt: nowTs() }).where(eq(recurringRules.id, ruleId)).run();
  materializeRuleToHorizon(ruleId);
}

export function duplicateRecurringRule(ruleId: string) {
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, ruleId)).get();
  if (!rule) throw new Error("Regra não encontrada.");
  const now = nowTs();
  const copyId = uid("rr");
  db.insert(recurringRules).values({
    ...rule,
    id: copyId,
    title: `${rule.title} (cópia)`,
    nextRunOn: rule.nextRunOn,
    createdAt: now,
    updatedAt: now
  }).run();
  materializeRuleToHorizon(copyId);
  return copyId;
}

export function archiveRecurringRule(ruleId: string) {
  pauseRecurringRule(ruleId);
  archiveEntity("recurring_rule", ruleId, "Arquivada pela UI");
}

export function restoreRecurringRule(ruleId: string) {
  restoreEntity("recurring_rule", ruleId);
  reactivateRecurringRule(ruleId);
}

export function deleteRecurringRule(ruleId: string) {
  db.delete(recurringRules).where(eq(recurringRules.id, ruleId)).run();
}
