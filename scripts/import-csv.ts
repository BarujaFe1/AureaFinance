import fs from "node:fs";
import path from "node:path";
import { expectedCsvFiles, importCsvContents, renderImportSummary, seedProjectionRulesIfMissing } from "@/services/csv-import.service";

async function main() {
  const importDir = path.resolve(process.cwd(), "import-data");
  if (!fs.existsSync(importDir)) {
    process.stderr.write(`❌ Pasta não encontrada: ${importDir}\n`);
    process.exit(1);
  }

  const available = fs.readdirSync(importDir).filter((file) => file.endsWith(".csv"));
  const ordered = expectedCsvFiles().filter((file) => available.includes(file));
  const files = ordered.map((file) => ({ name: file, content: fs.readFileSync(path.join(importDir, file), "utf8") }));

  if (!files.length) {
    process.stderr.write("❌ Nenhum CSV esperado foi encontrado em ./import-data/.\n");
    process.exit(1);
  }

  const result = await importCsvContents(files, (message) => process.stdout.write(`${message}\n`));
  seedProjectionRulesIfMissing();
  process.stdout.write(`${renderImportSummary(result)}\n`);
  if (!result.success) process.exit(1);
}

main().catch((error) => {
  process.stderr.write(`❌ Falha na importação: ${error instanceof Error ? error.message : "Erro desconhecido"}\n`);
  process.exit(1);
});
