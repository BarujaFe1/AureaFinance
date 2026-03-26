import { db } from "@/db/client";
import { categories, subcategories, tags } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { eq } from "drizzle-orm";

export function listCategories() {
  const cats = db.select().from(categories).all();
  const subs = db.select().from(subcategories).all();
  return cats.map((category) => ({ ...category, subcategories: subs.filter((sub) => sub.categoryId === category.id) }));
}

export function listTags() {
  return db.select().from(tags).all();
}

export function createCategory(name: string, kind: "income" | "expense" | "neutral", color: string) {
  const slug = slugify(name);
  const existing = db.select().from(categories).where(eq(categories.slug, slug)).get();
  if (existing) return existing;
  const now = nowTs();
  db.insert(categories).values({ id: uid("cat"), name, slug, kind, color, icon: "circle", createdAt: now, updatedAt: now }).run();
}

export function createTag(name: string) {
  const slug = slugify(name);
  const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();
  if (existing) return existing;
  db.insert(tags).values({ id: uid("tag"), name, slug, color: "#71717a", createdAt: nowTs() }).run();
}
