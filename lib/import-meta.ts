import { repairMojibake, sanitizeText } from "@/lib/text";
import type { BatchMeta, BatchSheetInventory, DryRunReport, ImportSheetTarget } from "@/types/domain";

function normalizeTarget(value: unknown): ImportSheetTarget {
  const allowed: ImportSheetTarget[] = ["ignore", "accounts", "transactions", "credit_cards", "card_bills", "net_worth", "investment_snapshots"];
  return allowed.includes(String(value) as ImportSheetTarget) ? (String(value) as ImportSheetTarget) : "ignore";
}

function normalizeSheet(value: unknown): BatchSheetInventory | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const name = repairMojibake(sanitizeText(row.name ?? row.sheetName ?? ""));
  if (!name) return null;
  const headers = Array.isArray(row.headers)
    ? row.headers.map((item) => repairMojibake(sanitizeText(item))).filter(Boolean)
    : [];
  const rowCount = Number(row.rowCount ?? row.rows ?? 0) || 0;
  return {
    name,
    rowCount,
    headers,
    suggestedTarget: normalizeTarget(row.suggestedTarget)
  };
}

export function normalizeBatchMeta(input: unknown): BatchMeta {
  const rawSheets = Array.isArray(input)
    ? input
    : Array.isArray((input as Record<string, unknown> | null | undefined)?.sheets)
      ? ((input as Record<string, unknown>).sheets as unknown[])
      : [];
  return {
    sheets: rawSheets.map(normalizeSheet).filter((item): item is BatchSheetInventory => Boolean(item))
  };
}

export function normalizeDryRunReport(input: unknown): DryRunReport | null {
  if (!input || typeof input !== "object") return null;
  const row = input as Record<string, unknown>;
  const summary = (row.summary && typeof row.summary === "object") ? (row.summary as Record<string, unknown>) : {};
  return {
    summary: {
      accounts: Number(summary.accounts ?? 0) || 0,
      transactions: Number(summary.transactions ?? 0) || 0,
      creditCards: Number(summary.creditCards ?? 0) || 0,
      purchases: Number(summary.purchases ?? 0) || 0,
      installments: Number(summary.installments ?? 0) || 0,
      issues: Number(summary.issues ?? 0) || 0
    },
    warnings: Array.isArray(row.warnings) ? row.warnings.map((item) => repairMojibake(sanitizeText(item))).filter(Boolean) : []
  };
}
