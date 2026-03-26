import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards } from "@/db/schema";

export function getCardsSnapshot() {
  const cards = db.select().from(creditCards).all();
  const bills = db.select().from(creditCardBills).orderBy(desc(creditCardBills.billMonth)).all();
  const purchases = db.select().from(cardPurchases).orderBy(desc(cardPurchases.purchaseDate)).all();
  const installments = db.select().from(cardInstallments).all();
  const entries = db.select().from(billEntries).all();

  return cards.map((card) => {
    const cardBills = bills.filter((bill) => bill.creditCardId === card.id);
    const openBill = cardBills.find((bill) => bill.status === "open") ?? null;
    const cardPurchasesRows = purchases.filter((purchase) => purchase.creditCardId === card.id);
    const unpaidCents = cardBills.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
    const availableLimitCents = Math.max(card.limitTotalCents - unpaidCents, 0);
    const futureInstallments = installments.filter((installment) => {
      if (installment.status === "paid") return false;
      const purchase = cardPurchasesRows.find((row) => row.id === installment.purchaseId);
      return purchase?.creditCardId === card.id;
    });
    return {
      ...card,
      availableLimitCents,
      bills: cardBills,
      openBill,
      purchases: cardPurchasesRows,
      futureInstallments,
      entries: entries.filter((entry) => cardBills.some((bill) => bill.id === entry.billId))
    };
  });
}
