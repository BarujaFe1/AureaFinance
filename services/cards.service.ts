import { db } from "@/db/client";
import { billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards, transactions } from "@/db/schema";
import { generateInstallments } from "@/lib/finance";
import { isoMonth, nowTs } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { slugify, uid } from "@/lib/utils";
import { asc, desc, eq } from "drizzle-orm";
import type { CardPurchaseCreateInput, CreditCardCreateInput } from "@/lib/validation";

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

export function listCreditCards() {
  return db.select().from(creditCards).where(eq(creditCards.isArchived, false)).orderBy(asc(creditCards.name)).all().map((card) => ({
    ...card,
    bills: db.select().from(creditCardBills).all().filter((bill) => bill.creditCardId === card.id).sort((a, b) => b.billMonth.localeCompare(a.billMonth)),
    purchases: db.select().from(cardPurchases).all().filter((purchase) => purchase.creditCardId === card.id).sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))
  }));
}

export function getCardsSummary() {
  return listCreditCards().map((card) => {
    const usedCents = card.bills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0);
    return { ...card, usedCents, availableLimitCents: Math.max(card.limitTotalCents - usedCents, 0) };
  });
}

export function createCreditCard(input: CreditCardCreateInput) {
  const now = nowTs();
  const slugBase = slugify(input.name);
  const exists = db.select().from(creditCards).where(eq(creditCards.slug, slugBase)).get();
  db.insert(creditCards).values({
    id: uid("card"),
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
    createdAt: now,
    updatedAt: now
  }).run();

  for (const installment of plan) {
    const bill = ensureBill(input.creditCardId, installment.billMonth, installment.billClosedOn, installment.billDueOn);
    const installmentId = uid("inst");
    db.insert(cardInstallments).values({
      id: installmentId,
      purchaseId,
      billId: bill.id,
      installmentNumber: installment.installmentNumber,
      totalInstallments: input.installmentCount,
      amountCents: installment.amountCents,
      status: "billed",
      dueOn: installment.billDueOn,
      createdAt: now
    }).run();
    db.insert(billEntries).values({
      id: uid("entry"),
      billId: bill.id,
      entryType: "installment",
      description: `${input.description} (${installment.installmentNumber}/${input.installmentCount})`,
      amountCents: installment.amountCents,
      purchaseId,
      installmentId,
      createdAt: now
    }).run();
    db.update(creditCardBills)
      .set({ totalAmountCents: bill.totalAmountCents + installment.amountCents, updatedAt: now })
      .where(eq(creditCardBills.id, bill.id))
      .run();
  }
}

export function listBills() {
  return db.select().from(creditCardBills).orderBy(desc(creditCardBills.billMonth), desc(creditCardBills.dueOn)).all().map((bill) => ({
    ...bill,
    entries: db.select().from(billEntries).all().filter((entry) => entry.billId === bill.id)
  }));
}

export function markBillPaid(billId: string) {
  const bill = db.select().from(creditCardBills).where(eq(creditCardBills.id, billId)).get();
  if (!bill) throw new Error("Fatura não encontrada.");
  const card = db.select().from(creditCards).where(eq(creditCards.id, bill.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const now = nowTs();
  const transactionId = uid("txn");
  db.insert(transactions).values({
    id: transactionId,
    accountId: card.settlementAccountId,
    categoryId: null,
    subcategoryId: null,
    direction: "bill_payment",
    status: "posted",
    description: `Pagamento da fatura ${card.name} ${bill.billMonth}`,
    counterparty: card.name,
    amountCents: bill.totalAmountCents - bill.paidAmountCents,
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
