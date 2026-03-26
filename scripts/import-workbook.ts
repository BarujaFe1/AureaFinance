import fs from "node:fs";
import path from "node:path";
import { buildDryRunReport } from "@/features/import/services/dry-run";
import { stageWorkbookImport } from "@/features/import/services/stage-workbook";

async function main() {
  const [, , fileArg, ...rest] = process.argv;
  const dryRun = rest.includes("--dry-run");

  if (!fileArg) {
    console.error("Uso: npm run import:workbook -- ./arquivo.xlsx [--dry-run]");
    process.exit(1);
  }

  const absolute = path.resolve(process.cwd(), fileArg);
  const buffer = fs.readFileSync(absolute);
  const { batchId, inventory } = await stageWorkbookImport({
    buffer,
    fileName: path.basename(absolute),
    sourceLabel: "cli"
  });

  console.log("Lote criado:", batchId);
  console.log(JSON.stringify(inventory, null, 2));

  if (dryRun) {
    const report = await buildDryRunReport(batchId);
    console.log("Dry-run:");
    console.log(JSON.stringify(report, null, 2));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
