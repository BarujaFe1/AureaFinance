import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { DB_PATH } from "@/lib/constants";

const source = process.argv[2];
if (!source) {
  console.error("Uso: tsx scripts/restore.ts <caminho-do-backup.sqlite>");
  process.exit(1);
}

const sourcePath = path.resolve(process.cwd(), source);
const targetPath = path.resolve(process.cwd(), DB_PATH);

if (!fs.existsSync(sourcePath)) {
  console.error(`Arquivo não encontrado: ${sourcePath}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(targetPath), { recursive: true });

// Safety: snapshot the current live database before overwriting it.
if (fs.existsSync(targetPath)) {
  const live = new Database(targetPath);
  try {
    live.pragma("wal_checkpoint(TRUNCATE)");
  } finally {
    live.close();
  }
  const preBackup = `${targetPath}.pre-restore-${Date.now()}.sqlite`;
  fs.copyFileSync(targetPath, preBackup);
  console.log(`Backup de segurança do banco atual criado em: ${preBackup}`);
}

fs.copyFileSync(sourcePath, targetPath);

// Remove stale WAL/SHM sidecars at the destination so the restored file is authoritative.
for (const ext of ["-wal", "-shm"]) {
  const sidecar = targetPath + ext;
  if (fs.existsSync(sidecar)) fs.rmSync(sidecar);
}

console.log(`Banco restaurado em ${targetPath}`);
