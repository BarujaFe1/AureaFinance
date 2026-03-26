"use server";

import { revalidatePath } from "next/cache";
import { createCategory, createTag } from "@/services/categories.service";

function parseCategoryKind(value: FormDataEntryValue | null): "income" | "expense" | "neutral" {
  return value === "income" || value === "neutral" ? value : "expense";
}

export async function createCategoryAction(formData: FormData) {
  createCategory(String(formData.get("name") ?? ""), parseCategoryKind(formData.get("kind")), String(formData.get("color") ?? "#7c83ff"));
  revalidatePath("/categories");
  revalidatePath("/transactions");
}

export async function createTagAction(formData: FormData) {
  createTag(String(formData.get("name") ?? ""));
  revalidatePath("/categories");
}
