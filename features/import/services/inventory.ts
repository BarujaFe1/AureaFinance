import * as XLSX from "xlsx";
import { detectEntityFromSheet, type SheetInventory } from "@/lib/domain/import-mapping";

type MatrixRow = Array<string | number | boolean | null>;

export type WorkbookInventory = {
  sheets: Array<SheetInventory & { detectedEntity: string }>;
};

export function inventoryWorkbook(buffer: Buffer): WorkbookInventory {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

  const sheets = workbook.SheetNames.map((sheetName: string) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false, defval: null }) as MatrixRow[];
    const rowCount = rows.length;
    const columnCount = rows.reduce((max: number, row: MatrixRow) => Math.max(max, row.length), 0);
    const sampleHeaders = (rows[0] ?? []).map((cell: string | number | boolean | null) => String(cell ?? "")).filter(Boolean).slice(0, 12);
    const inventory: SheetInventory = { name: sheetName, rowCount, columnCount, sampleHeaders };

    return {
      ...inventory,
      detectedEntity: detectEntityFromSheet(inventory)
    };
  });

  return { sheets };
}
