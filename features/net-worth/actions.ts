"use server";

import { revalidatePath } from "next/cache";
import { assetPositionUpsertSchema } from "@/lib/validation";
import { archiveAsset, deleteAsset, deleteAssetSnapshot, recordDailyNetWorthSnapshot, restoreAsset, upsertAssetPosition, upsertNetWorthSummary } from "@/services/net-worth.service";

function revalidateNetWorthRoutes() {
  revalidatePath("/net-worth");
  revalidatePath("/dashboard");
  revalidatePath("/daily");
  revalidatePath("/future");
}

function parseAssetType(value: FormDataEntryValue | null): "reserve" | "stock" | "crypto" {
  return value === "stock" || value === "crypto" ? value : "reserve";
}

export async function saveNetWorthAction(formData: FormData) {
  upsertNetWorthSummary({
    month: String(formData.get("month") ?? new Date().toISOString().slice(0, 7)),
    reserves: String(formData.get("reserves") ?? "0"),
    investments: String(formData.get("investments") ?? "0"),
    debts: String(formData.get("debts") ?? "0"),
    notes: String(formData.get("notes") ?? "")
  });
  revalidateNetWorthRoutes();
}

export async function upsertAssetPositionAction(formData: FormData) {
  upsertAssetPosition(assetPositionUpsertSchema.parse({
    assetType: parseAssetType(formData.get("assetType")),
    assetId: formData.get("assetId") || undefined,
    label: formData.get("label"),
    fullName: formData.get("fullName") || undefined,
    quantity: formData.get("quantity") ? String(formData.get("quantity")) : undefined,
    invested: formData.get("invested") ? String(formData.get("invested")) : undefined,
    currentValue: formData.get("currentValue"),
    snapshotDate: formData.get("snapshotDate") || undefined,
    notes: formData.get("notes") || ""
  }));
  recordDailyNetWorthSnapshot(String(formData.get("snapshotDate") ?? new Date().toISOString().slice(0, 10)));
  revalidateNetWorthRoutes();
}

export async function saveDailyNetWorthSnapshotAction(formData: FormData) {
  recordDailyNetWorthSnapshot(String(formData.get("snapshotDate") ?? new Date().toISOString().slice(0, 10)));
  revalidateNetWorthRoutes();
}

export async function archiveAssetAction(formData: FormData) {
  archiveAsset(parseAssetType(formData.get("assetType")), String(formData.get("assetId") ?? ""));
  revalidateNetWorthRoutes();
}

export async function restoreAssetAction(formData: FormData) {
  restoreAsset(parseAssetType(formData.get("assetType")), String(formData.get("assetId") ?? ""));
  revalidateNetWorthRoutes();
}

export async function deleteAssetAction(formData: FormData) {
  deleteAsset(parseAssetType(formData.get("assetType")), String(formData.get("assetId") ?? ""));
  revalidateNetWorthRoutes();
}

export async function deleteAssetSnapshotAction(formData: FormData) {
  deleteAssetSnapshot(String(formData.get("snapshotId") ?? ""));
  revalidateNetWorthRoutes();
}
