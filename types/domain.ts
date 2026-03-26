export type ImportSheetTarget =
  | "accounts"
  | "transactions"
  | "credit_cards"
  | "card_bills"
  | "net_worth"
  | "investment_snapshots"
  | "ignore";

export type BatchSheetInventory = {
  name: string;
  rowCount: number;
  headers: string[];
  suggestedTarget: ImportSheetTarget;
};

export type BatchMeta = {
  sheets: BatchSheetInventory[];
};

export type DryRunReport = {
  summary: {
    accounts: number;
    transactions: number;
    creditCards: number;
    purchases: number;
    installments: number;
    issues: number;
  };
  warnings: string[];
};
