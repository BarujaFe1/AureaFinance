import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { DB_PATH } from "@/lib/constants";

function log(step: string, message: string) {
  process.stdout.write(`${step} ${message}\n`);
}

try {
  const resolved = path.resolve(process.cwd(), DB_PATH);
  fs.mkdirSync(path.dirname(resolved), { recursive: true });
  const db = new Database(resolved);
  const migrationsDir = path.resolve(process.cwd(), "db/migrations");

  log("⏳", `Abrindo banco em ${resolved}`);
  db.exec(`
    CREATE TABLE IF NOT EXISTS __migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at INTEGER NOT NULL
    );
  `);

  const applied = new Set(db.prepare("SELECT filename FROM __migrations").all().map((row: any) => row.filename));
  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort();

  if (!files.length) {
    log("⚠️", "Nenhuma migração SQL encontrada em db/migrations.");
    process.exit(0);
  }

  for (const file of files) {
    if (applied.has(file)) {
      log("↷", `Pulando ${file} (já aplicada)`);
      continue;
    }
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    const tx = db.transaction(() => {
      db.exec(sql);
      db.prepare("INSERT INTO __migrations (filename, applied_at) VALUES (?, ?)").run(file, Date.now());
    });
    tx();
    log("✅", `Aplicada ${file}`);
  }

  log("✅", `Banco pronto em ${resolved}`);
} catch (error) {
  const message = error instanceof Error ? error.message : "Erro desconhecido";
  process.stderr.write(`❌ Falha ao aplicar migrações: ${message}\n`);
  process.exit(1);
}
