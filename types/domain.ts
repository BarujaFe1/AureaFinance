export type ImportSheetTarget =
  | "ignore"
  | "accounts"
  | "transactions"
  | "credit_cards"
  | "card_bills"
  | "net_worth"
  | "investment_snapshots";

export type BatchSheetInventory = {
  name: string;
  rowCount: number;
  headers: string[];
  suggestedTarget: ImportSheetTarget;
};

export type BatchMeta = {
  sheets: BatchSheetInventory[];
};

export type DryRunSummary = {
  accounts: number;
  transactions: number;
  creditCards: number;
  purchases: number;
  installments: number;
  issues: number;
};

export type DryRunReport = {
  summary: DryRunSummary;
  warnings: string[];
};
