"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { bootstrapMoneyIntoDatabase } from "@/services/money-bootstrap.service";
import { MAX_IMPORT_FILE_BYTES } from "@/lib/constants";
import { commitBatch, discardBatch, ingestWorkbook, saveSheetMapping, validateBatch } from "@/services/import.service";
import type { ImportSheetTarget } from "@/types/domain";

function revalidateImportSurface() {
  revalidatePath("/import");
  revalidatePath("/import/review");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/closings");
  revalidatePath("/future");
  revalidatePath("/net-worth");
  revalidatePath("/settings");
  revalidateTag("cashflow");
}

export async function bootstrapMoneyImportAction() {
  bootstrapMoneyIntoDatabase();
  revalidateImportSurface();
}

export async function uploadWorkbookAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Arquivo inválido.");
  if (file.size > MAX_IMPORT_FILE_BYTES) {
    throw new Error(`Arquivo excede o limite de ${Math.round(MAX_IMPORT_FILE_BYTES / (1024 * 1024))} MB.`);
  }
  await ingestWorkbook(file.name, await file.arrayBuffer());
  revalidatePath("/import");
  revalidatePath("/import/review");
}

export async function discardBatchAction(formData: FormData) {
  discardBatch(String(formData.get("batchId") ?? ""));
  revalidatePath("/import");
  revalidatePath("/import/review");
}

export async function saveSheetMappingAction(formData: FormData) {
  saveSheetMapping(
    String(formData.get("batchId") ?? ""),
    String(formData.get("sheetName") ?? ""),
    String(formData.get("targetEntity") ?? "ignore") as ImportSheetTarget,
    JSON.parse(String(formData.get("columnMapJson") ?? "{}")) as Record<string, string>
  );
  revalidatePath("/import");
  revalidatePath("/import/review");
}

export async function validateBatchAction(formData: FormData) {
  validateBatch(String(formData.get("batchId") ?? ""));
  revalidatePath("/import");
  revalidatePath("/import/review");
}

export async function commitBatchAction(formData: FormData) {
  commitBatch(String(formData.get("batchId") ?? ""), String(formData.get("dryRun") ?? "false") === "true");
  revalidateImportSurface();
}
