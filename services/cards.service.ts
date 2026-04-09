import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards, transactions } from "@/db/schema";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";
import { generateInstallments } from "@/lib/finance";
import { addMonthsIso, isoMonth, nowTs, todayIso } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { slugify, uid } from "@/lib/utils";
import type { CardPurchaseCreateInput, CreditCardCreateInput } from "@/lib/validation";
import { ensureSettings } from "@/services/settings.service";

type CreditCardRow = typeof creditCards.$inferSelect;
type CreditCardBillRow = typeof creditCardBills.$inferSelect;
type BillEntryRow = typeof billEntries.$inferSelect;
type CardPurchaseRow = typeof cardPurchases.$inferSelect;

type BillWithEntries = CreditCardBillRow & { entries: BillEntryRow[] };
type CreditCardWithRelations = CreditCardRow & {
  bills: BillWithEntries[];
  purchases: CardPurchaseRow[];
  duplicateIds: string[];
};

function groupBillEntriesByBillId() {
  const groups = new Map<string, BillEntryRow[]>();
  for (const entry of db.select().from(billEntries).all()) {
    groups.set(entry.billId, [...(groups.get(entry.billId) ?? []), entry]);
  }
  return groups;
}

function attachEntriesToBills(bills: CreditCardBillRow[], entriesByBillId = groupBillEntriesByBillId()): BillWithEntries[] {
  return bills.map((bill) => ({
    ...bill,
    entries: entriesByBillId.get(bill.id) ?? []
  }));
}

function ensureBill(creditCardId: string, billMonth: string, closesOn: string, dueOn: string) {
  const existing = db.select().from(creditCardBills).all().find((bill) => bill.creditCardId === creditCardId && bill.billMonth === billMonth);
  if (existing) return existing;
  const now = nowTs();
  const id = uid("bill");
  db.insert(creditCardBills).values({
    id,
    creditCardId,
    billMonth,
    closesOn,
    dueOn,
    totalAmountCents: 0,
    paidAmountCents: 0,
    status: "open",
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCardBills).where(eq(creditCardBills.id, id)).get()!;
}

function recalculateBill(billId: string) {
  const bill = db.select().from(creditCardBills).where(eq(creditCardBills.id, billId)).get();
  if (!bill) return;
  const amount = db.select().from(billEntries).all().filter((entry) => entry.billId === billId).reduce((sum, entry) => sum + entry.amountCents, 0);
  const paidAmountCents = Math.min(bill.paidAmountCents, amount);
  const status = amount === 0 ? "open" : (paidAmountCents >= amount ? "paid" : "open");
  db.update(creditCardBills).set({ totalAmountCents: amount, paidAmountCents, status, updatedAt: nowTs() }).where(eq(creditCardBills.id, billId)).run();
}

function normalizeCardKey(item: CreditCardRow) {
  const baseName = item.name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/cartao|cartão/gi, "")
    .replace(/\bcc\b/gi, "")
    .trim();
  return `${slugify(baseName || item.slug || item.name)}|${item.closeDay}|${item.dueDay}|${item.settlementAccountId}`;
}

function dedupeCards() {
  const archivedIds = new Set(listArchivedEntityIds("credit_card"));
  const items = db.select().from(creditCards).where(eq(creditCards.isArchived, false)).orderBy(asc(creditCards.name)).all().filter((item) => !archivedIds.has(item.id));
  const groups = new Map<string, typeof items>();
  for (const item of items) {
    const key = normalizeCardKey(item);
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups.entries()].map(([, group]) => {
    const canonical = [...group].sort((a, b) => b.updatedAt - a.updatedAt)[0];
    return {
      canonical,
      aliases: group.map((row) => row.id)
    };
  });
}

export function listCreditCards(includeArchived = false): CreditCardWithRelations[] {
  const allBills = db.select().from(creditCardBills).all();
  const allPurchases = db.select().from(cardPurchases).all();
  const entriesByBillId = groupBillEntriesByBillId();
  const archivedIds = new Set(listArchivedEntityIds("credit_card"));
  const groups = includeArchived
    ? db.select().from(creditCards).orderBy(asc(creditCards.name)).all().map((item) => ({ canonical: item, aliases: [item.id] }))
    : dedupeCards();

  return groups
    .filter(({ canonical }) => includeArchived || (!canonical.isArchived && !archivedIds.has(canonical.id)))
    .map(({ canonical, aliases }) => ({
      ...canonical,
      bills: attachEntriesToBills(
        allBills
          .filter((bill) => aliases.includes(bill.creditCardId))
          .sort((a, b) => b.billMonth.localeCompare(a.billMonth)),
        entriesByBillId
      ),
      purchases: allPurchases
        .filter((purchase) => aliases.includes(purchase.creditCardId))
        .sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate)),
      duplicateIds: aliases.filter((id) => id !== canonical.id)
    }));
}

export function getCardsSummary() {
  const today = todayIso();
  const horizonEnd = addMonthsIso(`${today.slice(0, 7)}-01`, Math.max(ensureSettings().projectionMonths, 12));

  return listCreditCards().map((card) => {
    const openBills = card.bills.filter((bill) => {
      const entryCount = bill.entries?.length ?? 0;
      return bill.status !== "paid" && (entryCount > 0 || bill.totalAmountCents > 0);
    });

    const usedCents = openBills.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
    const visibleFutureBills = openBills.filter((bill) => bill.dueOn <= horizonEnd);
    const nextBill = [...visibleFutureBills].sort((a, b) => a.dueOn.localeCompare(b.dueOn))[0] ?? null;
    const availableLimitCents = card.limitTotalCents - usedCents;

    return {
      ...card,
      usedCents,
      availableLimitCents,
      isOverLimit: availableLimitCents < 0,
      nextBill,
      visibleBills: visibleFutureBills,
      duplicateCount: card.duplicateIds.length
    };
  });
}

export function createCreditCard(input: CreditCardCreateInput) {
  const now = nowTs();
  const slugBase = slugify(input.name);
  const exists = db.select().from(creditCards).where(eq(creditCards.slug, slugBase)).get();
  const id = uid("card");
  db.insert(creditCards).values({
    id,
    name: input.name,
    slug: exists ? `${slugBase}-${now}` : slugBase,
    brand: input.brand ?? "",
    network: input.network ?? "",
    settlementAccountId: input.settlementAccountId,
    limitTotalCents: parseCurrencyToCents(input.limitAmount),
    closeDay: input.closeDay,
    dueDay: input.dueDay,
    color: "#111827",
    isArchived: false,
    createdAt: now,
    updatedAt: now
  }).run();
  return id;
}

export function updateCreditCard(values: { cardId: string; name: string; brand?: string; network?: string; limitAmount: string | number; closeDay: number; dueDay: number; settlementAccountId: string; color?: string }) {
  const existing = db.select().from(creditCards).where(eq(creditCards.id, values.cardId)).get();
  if (!existing) throw new Error("Cartão não encontrado.");
  db.update(creditCards).set({
    name: values.name,
    slug: slugify(values.name) || existing.slug,
    brand: values.brand ?? "",
    network: values.network ?? "",
    limitTotalCents: parseCurrencyToCents(values.limitAmount),
    closeDay: values.closeDay,
    dueDay: values.dueDay,
    settlementAccountId: values.settlementAccountId,
    color: values.color ?? existing.color,
    updatedAt: nowTs()
  }).where(eq(creditCards.id, existing.id)).run();
}

export function archiveCreditCard(cardId: string) {
  const existing = db.select().from(creditCards).where(eq(creditCards.id, cardId)).get();
  if (!existing) throw new Error("Cartão não encontrado.");
  db.update(creditCards).set({ isArchived: true, updatedAt: nowTs() }).where(eq(creditCards.id, existing.id)).run();
  archiveEntity("credit_card", cardId, "Arquivado pela UI", { name: existing.name });
}

export function restoreCreditCard(cardId: string) {
  const existing = db.select().from(creditCards).where(eq(creditCards.id, cardId)).get();
  if (!existing) throw new Error("Cartão não encontrado.");
  db.update(creditCards).set({ isArchived: false, updatedAt: nowTs() }).where(eq(creditCards.id, existing.id)).run();
  restoreEntity("credit_card", cardId);
}

function rebuildPurchaseSchedule(purchaseId: string, cardIdOverride?: string) {
  const purchase = db.select().from(cardPurchases).where(eq(cardPurchases.id, purchaseId)).get();
  if (!purchase) throw new Error("Compra não encontrada.");
  const card = db.select().from(creditCards).where(eq(creditCards.id, cardIdOverride ?? purchase.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const existingInstallments = db.select().from(cardInstallments).all().filter((row) => row.purchaseId === purchase.id);
  const billIds = new Set(existingInstallments.map((row) => row.billId));
  const entryIds = db.select().from(billEntries).all().filter((row) => row.purchaseId === purchase.id).map((row) => row.id);
  for (const entryId of entryIds) db.delete(billEntries).where(eq(billEntries.id, entryId)).run();
  for (const installment of existingInstallments) db.delete(cardInstallments).where(eq(cardInstallments.id, installment.id)).run();

  const plan = generateInstallments({
    purchaseDate: purchase.purchaseDate,
    totalAmountCents: purchase.totalAmountCents,
    installmentCount: purchase.installmentCount,
    closeDay: card.closeDay,
    dueDay: card.dueDay
  });
  const now = nowTs();
  const firstBill = ensureBill(card.id, plan[0].billMonth, plan[0].billClosedOn, plan[0].billDueOn);
  db.update(cardPurchases).set({ firstBillId: firstBill.id, creditCardId: card.id, updatedAt: now }).where(eq(cardPurchases.id, purchase.id)).run();

  for (const installment of plan) {
    const bill = ensureBill(card.id, installment.billMonth, installment.billClosedOn, installment.billDueOn);
    const installmentId = uid("inst");
    db.insert(cardInstallments).values({
      id: installmentId,
      purchaseId: purchase.id,
      billId: bill.id,
      installmentNumber: installment.installmentNumber,
      totalInstallments: purchase.installmentCount,
      amountCents: installment.amountCents,
      status: "billed",
      dueOn: installment.billDueOn,
      createdAt: now
    }).run();
    db.insert(billEntries).values({
      id: uid("entry"),
      billId: bill.id,
      entryType: "installment",
      description: `${purchase.description} (${installment.installmentNumber}/${purchase.installmentCount})`,
      amountCents: installment.amountCents,
      purchaseId: purchase.id,
      installmentId,
      createdAt: now
    }).run();
    billIds.add(bill.id);
  }

  for (const billId of billIds) recalculateBill(billId);
}

export function createCardPurchase(input: CardPurchaseCreateInput) {
  const card = db.select().from(creditCards).where(eq(creditCards.id, input.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const now = nowTs();
  const purchaseId = uid("purchase");
  const totalAmountCents = parseCurrencyToCents(input.amount);
  const plan = generateInstallments({
    purchaseDate: input.purchaseDate,
    totalAmountCents,
    installmentCount: input.installmentCount,
    closeDay: card.closeDay,
    dueDay: card.dueDay
  });
  const firstBill = ensureBill(input.creditCardId, plan[0].billMonth, plan[0].billClosedOn, plan[0].billDueOn);

  db.insert(cardPurchases).values({
    id: purchaseId,
    creditCardId: input.creditCardId,
    categoryId: input.categoryId ?? null,
    subcategoryId: null,
    firstBillId: firstBill.id,
    description: input.description,
    merchant: input.description,
    purchaseDate: input.purchaseDate,
    totalAmountCents,
    installmentCount: input.installmentCount,
    notes: input.notes ?? "",
    purchaseType: input.installmentCount > 1 ? "parcelado" : "avista",
    responsible: "",
    createdAt: now,
    updatedAt: now
  }).run();

  rebuildPurchaseSchedule(purchaseId, input.creditCardId);
}

export function updateCardPurchase(values: { purchaseId: string; creditCardId: string; description: string; purchaseDate: string; amount: string | number; installmentCount: number; categoryId?: string | null; notes?: string }) {
  const purchase = db.select().from(cardPurchases).where(eq(cardPurchases.id, values.purchaseId)).get();
  if (!purchase) throw new Error("Compra não encontrada.");
  db.update(cardPurchases).set({
    creditCardId: values.creditCardId,
    categoryId: values.categoryId || null,
    description: values.description,
    merchant: values.description,
    purchaseDate: values.purchaseDate,
    totalAmountCents: parseCurrencyToCents(values.amount),
    installmentCount: values.installmentCount,
    purchaseType: values.installmentCount > 1 ? "parcelado" : "avista",
    notes: values.notes ?? "",
    updatedAt: nowTs()
  }).where(eq(cardPurchases.id, purchase.id)).run();
  rebuildPurchaseSchedule(purchase.id, values.creditCardId);
}

export function deleteCardPurchase(purchaseId: string) {
  const installments = db.select().from(cardInstallments).all().filter((row) => row.purchaseId === purchaseId);
  const billIds = new Set(installments.map((row) => row.billId));
  for (const entry of db.select().from(billEntries).all().filter((row) => row.purchaseId === purchaseId)) {
    db.delete(billEntries).where(eq(billEntries.id, entry.id)).run();
  }
  for (const installment of installments) {
    db.delete(cardInstallments).where(eq(cardInstallments.id, installment.id)).run();
  }
  db.delete(cardPurchases).where(eq(cardPurchases.id, purchaseId)).run();
  for (const billId of billIds) recalculateBill(billId);
}

export function listBills() {
  const horizonEnd = addMonthsIso(`${todayIso().slice(0, 7)}-01`, Math.max(ensureSettings().projectionMonths, 12));
  const entriesByBillId = groupBillEntriesByBillId();

  return attachEntriesToBills(
    db.select().from(creditCardBills).orderBy(desc(creditCardBills.billMonth), desc(creditCardBills.dueOn)).all(),
    entriesByBillId
  ).filter((bill) => {
    const hasEntries = (bill.entries?.length ?? 0) > 0;
    return (bill.dueOn <= horizonEnd || bill.status === "paid") && (bill.totalAmountCents > 0 || hasEntries);
  });
}

export function markBillPaid(billId: string) {
  const bill = db.select().from(creditCardBills).where(eq(creditCardBills.id, billId)).get();
  if (!bill) throw new Error("Fatura não encontrada.");
  const card = db.select().from(creditCards).where(eq(creditCards.id, bill.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const amountToPay = Math.max(bill.totalAmountCents - bill.paidAmountCents, 0);
  if (amountToPay === 0) return;
  const now = nowTs();
  const transactionId = uid("txn");
  db.insert(transactions).values({
    id: transactionId,
    accountId: card.settlementAccountId,
    categoryId: null,
    subcategoryId: null,
    transferId: null,
    recurringOccurrenceId: null,
    sourceImportRowId: null,
    direction: "bill_payment",
    status: "posted",
    description: `Pagamento da fatura ${card.name} ${bill.billMonth}`,
    counterparty: card.name,
    amountCents: amountToPay,
    occurredOn: bill.dueOn,
    dueOn: bill.dueOn,
    competenceMonth: isoMonth(bill.dueOn),
    notes: "Pagamento de fatura gerado automaticamente.",
    isProjected: false,
    createdAt: now,
    updatedAt: now
  }).run();
  db.update(creditCardBills)
    .set({ paidAmountCents: bill.totalAmountCents, status: "paid", settlementTransactionId: transactionId, updatedAt: now })
    .where(eq(creditCardBills.id, bill.id))
    .run();
}
