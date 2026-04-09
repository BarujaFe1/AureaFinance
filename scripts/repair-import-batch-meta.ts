import Database from "better-sqlite3";
import { DB_PATH } from "@/lib/constants";
import { normalizeBatchMeta } from "@/lib/import-meta";

const sqlite = new Database(DB_PATH);
const rows = sqlite.prepare(`SELECT id, workbook_summary_json FROM import_batches`).all() as Array<{ id: string; workbook_summary_json: string | null }>;
let changed = 0;
for (const row of rows) {
  const raw = row.workbook_summary_json ? JSON.parse(row.workbook_summary_json) : null;
  const normalized = normalizeBatchMeta(raw);
  const next = JSON.stringify(normalized);
  if (next !== (row.workbook_summary_json ?? "")) {
    sqlite.prepare(`UPDATE import_batches SET workbook_summary_json = ? WHERE id = ?`).run(next, row.id);
    changed += 1;
  }
}
sqlite.close();
console.log(`repair-import-batch-meta: ${changed} lote(s) normalizado(s).`);
