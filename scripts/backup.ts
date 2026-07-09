import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { DB_PATH } from "@/lib/constants";

const source = path.resolve(process.cwd(), DB_PATH);
const backupsDir = path.resolve(process.cwd(), "backups");
fs.mkdirSync(backupsDir, { recursive: true });
const target = path.join(backupsDir, `aurea-finance-${Date.now()}.sqlite`);

// Flush the WAL into the main database file so the copied snapshot is consistent
// and self-contained (the -wal/-shm sidecars alone would be incomplete).
const db = new Database(source);
try {
  db.pragma("wal_checkpoint(TRUNCATE)");
} finally {
  db.close();
}

fs.copyFileSync(source, target);
for (const ext of ["-wal", "-shm"]) {
  const sidecar = source + ext;
  if (fs.existsSync(sidecar)) fs.copyFileSync(sidecar, target + ext);
}

console.log(`Backup criado em: ${target}`);
