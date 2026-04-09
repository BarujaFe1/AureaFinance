import fs from "node:fs";
import path from "node:path";
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
fs.copyFileSync(sourcePath, targetPath);
console.log(`Banco restaurado em ${targetPath}`);
