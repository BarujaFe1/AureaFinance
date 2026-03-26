import fs from "node:fs";
import path from "node:path";
import { DB_PATH } from "@/lib/constants";

const source = path.resolve(process.cwd(), DB_PATH);
const backupsDir = path.resolve(process.cwd(), "backups");
fs.mkdirSync(backupsDir, { recursive: true });
const target = path.join(backupsDir, `aurea-finance-${Date.now()}.sqlite`);
fs.copyFileSync(source, target);
console.log(`Backup criado em: ${target}`);
