import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { categories, tags, transactions } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";

export function listCategories(includeArchived = false) {
  const archived = new Set(listArchivedEntityIds("category"));
  const rows = db.select().from(categories).all();
  return includeArchived ? rows : rows.filter((row) => !archived.has(row.id));
}

export function listTags(includeArchived = false) {
  const archived = new Set(listArchivedEntityIds("tag"));
  const rows = db.select().from(tags).all();
  return includeArchived ? rows : rows.filter((row) => !archived.has(row.id));
}

export function createCategory(name: string, kind: "income" | "expense" | "neutral", color: string) {
  const slug = slugify(name);
  const existing = db.select().from(categories).where(eq(categories.slug, slug)).get();
  if (existing) return existing;
  const now = nowTs();
  const id = uid("cat");
  db.insert(categories).values({ id, name, slug, kind, color, icon: "circle", createdAt: now, updatedAt: now }).run();
  return db.select().from(categories).where(eq(categories.id, id)).get()!;
}

export function updateCategory(values: { categoryId: string; name: string; kind: "income" | "expense" | "neutral"; color: string }) {
  const existing = db.select().from(categories).where(eq(categories.id, values.categoryId)).get();
  if (!existing) throw new Error("Categoria não encontrada.");
  db.update(categories).set({
    name: values.name,
    slug: slugify(values.name) || existing.slug,
    kind: values.kind,
    color: values.color,
    updatedAt: nowTs()
  }).where(eq(categories.id, existing.id)).run();
}

export function archiveCategory(categoryId: string) {
  const existing = db.select().from(categories).where(eq(categories.id, categoryId)).get();
  if (!existing) throw new Error("Categoria não encontrada.");
  archiveEntity("category", categoryId, "Arquivada pela UI", { name: existing.name });
}

export function restoreCategory(categoryId: string) {
  restoreEntity("category", categoryId);
}

export function deleteCategory(categoryId: string) {
  const linked = db.select().from(transactions).all().filter((row) => row.categoryId === categoryId).length;
  if (linked > 0) throw new Error("Categoria ainda vinculada a lançamentos.");
  db.delete(categories).where(eq(categories.id, categoryId)).run();
}

export function mergeCategory(sourceCategoryId: string, targetCategoryId: string) {
  if (sourceCategoryId === targetCategoryId) return;
  const rows = db.select().from(transactions).all().filter((row) => row.categoryId === sourceCategoryId);
  for (const row of rows) {
    db.update(transactions).set({ categoryId: targetCategoryId, updatedAt: nowTs() }).where(eq(transactions.id, row.id)).run();
  }
  archiveCategory(sourceCategoryId);
}

export function createTag(name: string, color = "#71717a") {
  const slug = slugify(name);
  const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();
  if (existing) return existing;
  const id = uid("tag");
  db.insert(tags).values({ id, name, slug, color, createdAt: nowTs() }).run();
  return db.select().from(tags).where(eq(tags.id, id)).get()!;
}

export function updateTag(values: { tagId: string; name: string; color: string }) {
  const existing = db.select().from(tags).where(eq(tags.id, values.tagId)).get();
  if (!existing) throw new Error("Tag não encontrada.");
  db.update(tags).set({ name: values.name, slug: slugify(values.name) || existing.slug, color: values.color }).where(eq(tags.id, existing.id)).run();
}

export function archiveTag(tagId: string) {
  const existing = db.select().from(tags).where(eq(tags.id, tagId)).get();
  if (!existing) throw new Error("Tag não encontrada.");
  archiveEntity("tag", tagId, "Arquivada pela UI", { name: existing.name });
}

export function restoreTag(tagId: string) {
  restoreEntity("tag", tagId);
}

export function deleteTag(tagId: string) {
  db.delete(tags).where(eq(tags.id, tagId)).run();
}
