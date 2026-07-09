import { eq, and, sql, gte, lte, notInArray } from "drizzle-orm";
import { db } from "@/db/client";
import { cardInstallments, cardPurchases, categories, categoryBudgets, transactions } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { uid } from "@/lib/utils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { listArchivedEntityIds } from "@/services/archive.service";

export function listBudgets(month?: string) {
  const targetMonth = month ?? format(new Date(), "yyyy-MM");
  const rows = db.select({
    budget: categoryBudgets,
    category: categories
  })
    .from(categoryBudgets)
    .innerJoin(categories, eq(categoryBudgets.categoryId, categories.id))
    .where(eq(categoryBudgets.month, targetMonth))
    .all();

  return rows.map((row) => ({
    id: row.budget.id,
    categoryId: row.budget.categoryId,
    categoryName: row.category.name,
    categoryColor: row.category.color,
    categoryKind: row.category.kind,
    month: row.budget.month,
    limitCents: row.budget.limitCents,
    createdAt: row.budget.createdAt,
    updatedAt: row.budget.updatedAt
  }));
}

export function getBudgetVsActual(month?: string) {
  const targetMonth = month ?? format(new Date(), "yyyy-MM");
  const startDate = startOfMonth(new Date(targetMonth + "-01"));
  const endDate = endOfMonth(startDate);
  const startIso = format(startDate, "yyyy-MM-dd");
  const endIso = format(endDate, "yyyy-MM-dd");

  const budgetRows = db.select({
    budget: categoryBudgets,
    category: categories
  })
    .from(categoryBudgets)
    .innerJoin(categories, eq(categoryBudgets.categoryId, categories.id))
    .where(eq(categoryBudgets.month, targetMonth))
    .all();

  const archivedTxnIds = listArchivedEntityIds("transaction");
  const txFilters = [
    eq(transactions.competenceMonth, targetMonth),
    eq(transactions.status, "posted"),
    sql`${transactions.direction} IN ('expense', 'income')`
  ];
  if (archivedTxnIds.length > 0) {
    txFilters.push(notInArray(transactions.id, archivedTxnIds));
  }

  const txRows = db.select({
    categoryId: transactions.categoryId,
    categoryName: categories.name,
    categoryColor: categories.color,
    categoryKind: categories.kind,
    totalCents: sql<number>`COALESCE(SUM(${transactions.amountCents}), 0)`
  })
    .from(transactions)
    .leftJoin(categories, eq(transactions.categoryId, categories.id))
    .where(and(...txFilters))
    .groupBy(transactions.categoryId)
    .all();

  // Card spend lives in card_purchases/installments (not transactions) until the bill is paid.
  // Include installment amounts due in the month so budgets are not blind to card usage.
  const cardRows = db.select({
    categoryId: cardPurchases.categoryId,
    categoryName: categories.name,
    categoryColor: categories.color,
    categoryKind: categories.kind,
    totalCents: sql<number>`COALESCE(SUM(${cardInstallments.amountCents}), 0)`
  })
    .from(cardInstallments)
    .innerJoin(cardPurchases, eq(cardInstallments.purchaseId, cardPurchases.id))
    .leftJoin(categories, eq(cardPurchases.categoryId, categories.id))
    .where(and(gte(cardInstallments.dueOn, startIso), lte(cardInstallments.dueOn, endIso)))
    .groupBy(cardPurchases.categoryId)
    .all();

  const actualByCategory = new Map<string, number>();
  const kindByCategory = new Map<string, string>();
  const colorByCategory = new Map<string, string | null>();
  const nameByCategory = new Map<string, string>();

  for (const row of [...txRows, ...cardRows]) {
    if (row.categoryId) {
      const current = actualByCategory.get(row.categoryId) ?? 0;
      actualByCategory.set(row.categoryId, current + row.totalCents);
      nameByCategory.set(row.categoryId, row.categoryName ?? "Sem categoria");
      colorByCategory.set(row.categoryId, row.categoryColor);
      kindByCategory.set(row.categoryId, row.categoryKind ?? "expense");
    }
  }

  const budgetsNotInTx = budgetRows.filter((b) => !actualByCategory.has(b.budget.categoryId));
  for (const b of budgetsNotInTx) {
    actualByCategory.set(b.budget.categoryId, 0);
    nameByCategory.set(b.budget.categoryId, b.category.name);
    colorByCategory.set(b.budget.categoryId, b.category.color);
    kindByCategory.set(b.budget.categoryId, b.category.kind);
  }

  const result = budgetRows.map((row) => {
    const spentCents = actualByCategory.get(row.budget.categoryId) ?? 0;
    const catKind = kindByCategory.get(row.budget.categoryId) ?? row.category.kind;
    const displaySpent = catKind === "income" ? -spentCents : spentCents;
    return {
      id: row.budget.id,
      categoryId: row.budget.categoryId,
      categoryName: nameByCategory.get(row.budget.categoryId) ?? row.category.name,
      categoryColor: colorByCategory.get(row.budget.categoryId) ?? row.category.color,
      categoryKind: catKind,
      month: targetMonth,
      limitCents: row.budget.limitCents,
      spentCents: displaySpent,
      remainingCents: row.budget.limitCents - displaySpent,
      percentageUsed: row.budget.limitCents > 0 ? Math.round((displaySpent / row.budget.limitCents) * 100) : 0
    };
  });

  return result;
}

export function upsertBudget(categoryId: string, month: string, limitCents: number) {
  const existing = db.select()
    .from(categoryBudgets)
    .where(and(eq(categoryBudgets.categoryId, categoryId), eq(categoryBudgets.month, month)))
    .get();

  const now = nowTs();

  if (existing) {
    db.update(categoryBudgets)
      .set({ limitCents, updatedAt: now })
      .where(eq(categoryBudgets.id, existing.id))
      .run();
    return db.select().from(categoryBudgets).where(eq(categoryBudgets.id, existing.id)).get()!;
  }

  const id = uid("bg");
  db.insert(categoryBudgets).values({ id, categoryId, month, limitCents, createdAt: now, updatedAt: now }).run();
  return db.select().from(categoryBudgets).where(eq(categoryBudgets.id, id)).get()!;
}

export function deleteBudget(id: string) {
  db.delete(categoryBudgets).where(eq(categoryBudgets.id, id)).run();
}

export function deleteBudgetsForCategory(categoryId: string) {
  db.delete(categoryBudgets).where(eq(categoryBudgets.categoryId, categoryId)).run();
}
