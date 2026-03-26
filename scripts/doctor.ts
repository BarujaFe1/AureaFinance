import fs from "node:fs";
import path from "node:path";
import { DB_PATH } from "@/lib/constants";

const resolved = path.resolve(process.cwd(), DB_PATH);
console.log("Banco:", resolved);
console.log("Existe:", fs.existsSync(resolved));
if (fs.existsSync(resolved)) console.log("Tamanho:", fs.statSync(resolved).size, "bytes");
