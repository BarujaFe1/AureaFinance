import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { DB_PATH } from "@/lib/constants";

const root = process.cwd();
const scanExt = new Set([".ts", ".tsx", ".md", ".sql"]);
const mojibakePattern = /(Ã.|Â.|â€¦|â€™|â€œ|â€|�)/;
const legacyFieldPattern = /transactionDate|referenceDate|statementMonth|scheduledDate|limitAmountCents\b/;
const monthlyClosingPattern = /monthly-closing/;

function listFiles(dir: string, acc: string[] = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".git", ".next"].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

const files = listFiles(root);
const mojibakeHits: string[] = [];
const legacyFieldHits: string[] = [];
const monthlyClosingHits: string[] = [];

for (const file of files) {
  if (!scanExt.has(path.extname(file))) continue;
  const text = fs.readFileSync(file, "utf8");
  if (mojibakePattern.test(text)) mojibakeHits.push(path.relative(root, file));
  if (legacyFieldPattern.test(text)) legacyFieldHits.push(path.relative(root, file));
  if (monthlyClosingPattern.test(text)) monthlyClosingHits.push(path.relative(root, file));
}

const dbPath = path.resolve(root, DB_PATH);
const report: Record<string, unknown> = {
  dbPath,
  mojibakeHits,
  legacyFieldHits,
  monthlyClosingHits,
  sql: null
};

if (fs.existsSync(dbPath)) {
  const sqlite = new Database(dbPath, { readonly: true });
  report.sql = {
    duplicateCardsBySlug: sqlite.prepare(`SELECT slug, COUNT(*) AS qty FROM credit_cards GROUP BY slug HAVING COUNT(*) > 1`).all(),
    duplicateCardsByName: sqlite.prepare(`SELECT lower(trim(name)) AS normalized_name, COUNT(*) AS qty FROM credit_cards GROUP BY lower(trim(name)) HAVING COUNT(*) > 1`).all(),
    farFutureBills: sqlite.prepare(`SELECT bill_month, due_on, credit_card_id FROM credit_card_bills WHERE due_on > date('now', '+24 months') ORDER BY due_on ASC LIMIT 50`).all(),
    recurringWithoutOccurrences: sqlite.prepare(`
      SELECT r.id, r.title, r.next_run_on
      FROM recurring_rules r
      LEFT JOIN recurring_occurrences o ON o.rule_id = r.id AND o.status = 'scheduled' AND o.due_on >= date('now')
      WHERE r.is_active = 1
      GROUP BY r.id
      HAVING COUNT(o.id) = 0
    `).all(),
    importBatchesMissingSummary: sqlite.prepare(`SELECT id, filename, status FROM import_batches WHERE workbook_summary_json IS NULL OR trim(workbook_summary_json) = '' OR workbook_summary_json = '{}'`).all()
  };
  sqlite.close();
}

console.log(JSON.stringify(report, null, 2));
