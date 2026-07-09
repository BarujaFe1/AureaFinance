import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";
import { DB_PATH } from "@/lib/constants";

const resolvedPath = path.resolve(process.cwd(), DB_PATH);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
const sqlite = new Database(resolvedPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

function tableExists(name: string) {
  const row = sqlite.prepare("SELECT name FROM sqlite_master WHERE type = 'table' AND name = ?").get(name) as { name?: string } | undefined;
  return Boolean(row?.name);
}

function columnExists(table: string, column: string) {
  if (!tableExists(table)) return false;
  const rows = sqlite.prepare(`PRAGMA table_info(${table})`).all() as Array<{ name: string }>;
  return rows.some((row) => row.name === column);
}

function ensureRuntimeSchema() {
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS asset_value_snapshots (
      id TEXT PRIMARY KEY,
      asset_type TEXT NOT NULL,
      asset_id TEXT,
      asset_label TEXT NOT NULL,
      snapshot_date TEXT NOT NULL,
      quantity REAL,
      value_cents INTEGER NOT NULL DEFAULT 0,
      notes TEXT DEFAULT '',
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS asset_value_snapshots_type_asset_date_unique
      ON asset_value_snapshots(asset_type, asset_id, snapshot_date);
    CREATE INDEX IF NOT EXISTS asset_value_snapshots_snapshot_date_idx
      ON asset_value_snapshots(snapshot_date);

    CREATE TABLE IF NOT EXISTS entity_archives (
      id TEXT PRIMARY KEY,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      reason TEXT DEFAULT '',
      metadata_json TEXT NOT NULL DEFAULT '{}',
      archived_at INTEGER NOT NULL,
      restored_at INTEGER,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS entity_archives_entity_unique
      ON entity_archives(entity_type, entity_id);
    CREATE INDEX IF NOT EXISTS entity_archives_type_idx
      ON entity_archives(entity_type);
  `);

  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS category_budgets (
      id TEXT PRIMARY KEY,
      category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
      month TEXT NOT NULL,
      limit_cents INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    );
    CREATE UNIQUE INDEX IF NOT EXISTS category_budgets_category_month_unique
      ON category_budgets(category_id, month);
  `);

  if (!columnExists("recurring_rules", "destination_account_id")) {
    sqlite.exec("ALTER TABLE recurring_rules ADD COLUMN destination_account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL;");
  }

  if (!columnExists("card_purchases", "purchase_type")) {
    sqlite.exec("ALTER TABLE card_purchases ADD COLUMN purchase_type TEXT NOT NULL DEFAULT 'parcelado';");
  }
  if (!columnExists("card_purchases", "responsible")) {
    sqlite.exec("ALTER TABLE card_purchases ADD COLUMN responsible TEXT DEFAULT ''; ");
  }

  for (const table of ["transactions", "accounts", "credit_cards", "credit_card_bills", "net_worth_summaries"] as const) {
    if (tableExists(table) && !columnExists(table, "source_import_batch_id")) {
      sqlite.exec(`ALTER TABLE ${table} ADD COLUMN source_import_batch_id TEXT;`);
    }
  }
  if (tableExists("transactions")) {
    sqlite.exec("CREATE INDEX IF NOT EXISTS transactions_source_import_batch_idx ON transactions(source_import_batch_id);");
  }
}

ensureRuntimeSchema();

export const db = drizzle(sqlite, { schema });

export { columnExists, resolvedPath as dbPath, sqlite, tableExists };
