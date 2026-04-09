"use server";

import { revalidatePath } from "next/cache";
import { archiveCategory, archiveTag, createCategory, createTag, deleteCategory, deleteTag, mergeCategory, restoreCategory, restoreTag, updateCategory, updateTag } from "@/services/categories.service";

function parseCategoryKind(value: FormDataEntryValue | null): "income" | "expense" | "neutral" {
  return value === "income" || value === "neutral" ? value : "expense";
}

function revalidateCategoryRoutes() {
  revalidatePath("/categories");
  revalidatePath("/transactions");
  revalidatePath("/import");
}

export async function createCategoryAction(formData: FormData) {
  createCategory(String(formData.get("name") ?? ""), parseCategoryKind(formData.get("kind")), String(formData.get("color") ?? "#7c83ff"));
  revalidateCategoryRoutes();
}

export async function updateCategoryAction(formData: FormData) {
  updateCategory({
    categoryId: String(formData.get("categoryId") ?? ""),
    name: String(formData.get("name") ?? ""),
    kind: parseCategoryKind(formData.get("kind")),
    color: String(formData.get("color") ?? "#7c83ff")
  });
  revalidateCategoryRoutes();
}

export async function archiveCategoryAction(formData: FormData) {
  archiveCategory(String(formData.get("categoryId") ?? ""));
  revalidateCategoryRoutes();
}

export async function restoreCategoryAction(formData: FormData) {
  restoreCategory(String(formData.get("categoryId") ?? ""));
  revalidateCategoryRoutes();
}

export async function deleteCategoryAction(formData: FormData) {
  deleteCategory(String(formData.get("categoryId") ?? ""));
  revalidateCategoryRoutes();
}

export async function mergeCategoryAction(formData: FormData) {
  mergeCategory(String(formData.get("sourceCategoryId") ?? ""), String(formData.get("targetCategoryId") ?? ""));
  revalidateCategoryRoutes();
}

export async function createTagAction(formData: FormData) {
  createTag(String(formData.get("name") ?? ""), String(formData.get("color") ?? "#71717a"));
  revalidateCategoryRoutes();
}

export async function updateTagAction(formData: FormData) {
  updateTag({
    tagId: String(formData.get("tagId") ?? ""),
    name: String(formData.get("name") ?? ""),
    color: String(formData.get("color") ?? "#71717a")
  });
  revalidateCategoryRoutes();
}

export async function archiveTagAction(formData: FormData) {
  archiveTag(String(formData.get("tagId") ?? ""));
  revalidateCategoryRoutes();
}

export async function restoreTagAction(formData: FormData) {
  restoreTag(String(formData.get("tagId") ?? ""));
  revalidateCategoryRoutes();
}

export async function deleteTagAction(formData: FormData) {
  deleteTag(String(formData.get("tagId") ?? ""));
  revalidateCategoryRoutes();
}
