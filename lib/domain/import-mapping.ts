export type SheetInventory = {
  name: string;
  rowCount: number;
  columnCount: number;
  sampleHeaders: string[];
};

export type DetectedEntity =
  | "accounts_ledger" | "credit_cards" | "monthly_projection"
  | "dashboard_snapshot" | "investment_summary" | "net_worth_timeseries"
  | "daily_balance_series" | "custom_planner" | "unknown";

export function detectEntityFromSheet(sheet: SheetInventory): DetectedEntity {
  const name = sheet.name.toLowerCase();
  const headers = sheet.sampleHeaders.join(" ").toLowerCase();
  if (name.includes("cart")) return "credit_cards";
  if (name.includes("conta")) return "accounts_ledger";
  if (name.includes("acompanhamento")) return "monthly_projection";
  if (name.includes("visão geral") || name.includes("visao geral")) return "dashboard_snapshot";
  if (name.includes("resumo do investimento")) return "investment_summary";
  if (name.includes("registro diário de investimentos") || name.includes("registro diario de investimentos")) return "net_worth_timeseries";
  if (name.includes("registro diário") || name.includes("registro diario")) return "daily_balance_series";
  if (name.includes("richard")) return "custom_planner";
  if (headers.includes("valor") && headers.includes("data")) return "accounts_ledger";
  return "unknown";
}

export type ColumnGuess = { source: string; target: string; confidence: "high" | "medium" | "low" };

export function guessColumns(headers: string[]): ColumnGuess[] {
  return headers.map((header) => {
    const value = header.toLowerCase();
    if (value.includes("data")) return { source: header, target: "transactionDate", confidence: "high" };
    if (value.includes("descr") || value.includes("nome")) return { source: header, target: "description", confidence: "high" };
    if (value.includes("valor")) return { source: header, target: "amountCents", confidence: "high" };
    if (value.includes("categoria")) return { source: header, target: "categoryName", confidence: "medium" };
    if (value.includes("conta")) return { source: header, target: "accountName", confidence: "medium" };
    return { source: header, target: "manual_review", confidence: "low" };
  });
}
