import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { importBatches, importIssues, importRawRows } from "@/db/schema";

export function buildDryRunReport(batchId: string) {
  const batch = db.select().from(importBatches).where(eq(importBatches.id, batchId)).get();
  const rows = db.select().from(importRawRows).where(eq(importRawRows.batchId, batchId)).all();
  const issues = db.select().from(importIssues).where(eq(importIssues.batchId, batchId)).all();

  if (!batch) throw new Error("Lote de importação não encontrado.");

  const groupedBySheet = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.sheetName] = (acc[row.sheetName] ?? 0) + 1;
    return acc;
  }, {});

  return {
    batch,
    totals: {
      rows: rows.length,
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length
    },
    groupedBySheet
  };
}
