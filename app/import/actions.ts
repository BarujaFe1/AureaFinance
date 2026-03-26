"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { expectedCsvFiles, importCsvContents, renderImportSummary, type ImportRunResult } from "@/services/csv-import.service";

export type ImportActionState = ImportRunResult & {
  summaryText?: string;
  expectedFiles: string[];
};

export async function importCsvFiles(_prevState: ImportActionState, formData: FormData): Promise<ImportActionState> {
  try {
    const uploads = formData.getAll("files").filter((item): item is File => item instanceof File);
    const files: Array<{ name: string; content: string }> = [];
    for (const file of uploads) {
      files.push({ name: file.name, content: await file.text() });
    }
    const result = await importCsvContents(files);
    revalidatePath("/import");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/cards");
    revalidatePath("/bills");
    revalidatePath("/net-worth");
    revalidatePath("/future");
    revalidateTag("cashflow");
    return { ...result, summaryText: renderImportSummary(result), expectedFiles: expectedCsvFiles() };
  } catch (error) {
    return {
      success: false,
      files: [],
      summary: {},
      error: error instanceof Error ? error.message : "Falha ao importar os CSVs.",
      expectedFiles: expectedCsvFiles()
    };
  }
}
