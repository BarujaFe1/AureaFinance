import { sqlite } from "@/db/client";
import { repairMojibake } from "@/lib/text";

const TABLES = [
  { name: "accounts", id: "id", fields: ["name", "institution", "notes"] },
  { name: "credit_cards", id: "id", fields: ["name", "brand", "network"] },
  { name: "transactions", id: "id", fields: ["description", "counterparty", "notes"] },
  { name: "recurring_rules", id: "id", fields: ["title", "notes"] },
  { name: "import_batches", id: "id", fields: ["filename"] },
  { name: "import_issues", id: "id", fields: ["message"] },
  { name: "net_worth_summaries", id: "id", fields: ["notes"] },
  { name: "reserves", id: "id", fields: ["name"] },
  { name: "stock_positions", id: "id", fields: ["full_name"] },
  { name: "crypto_positions", id: "id", fields: ["name"] }
] as const;

let updates = 0;

const tx = sqlite.transaction(() => {
  for (const table of TABLES) {
    const rows = sqlite.prepare(`SELECT ${table.id}, ${table.fields.join(", ")} FROM ${table.name}`).all() as Array<Record<string, unknown>>;
    for (const row of rows) {
      const patched: Record<string, unknown> = {};
      for (const field of table.fields) {
        const value = typeof row[field] === "string" ? String(row[field]) : "";
        const repaired = repairMojibake(value);
        if (repaired !== value) patched[field] = repaired;
      }
      if (Object.keys(patched).length === 0) continue;
      const assignments = Object.keys(patched).map((key) => `${key} = @${key}`).join(", ");
      sqlite.prepare(`UPDATE ${table.name} SET ${assignments} WHERE ${table.id} = @id`).run({ id: row[table.id], ...patched });
      updates += 1;
    }
  }
});

tx();
console.log(`repair-mojibake: ${updates} registro(s) ajustado(s).`);
