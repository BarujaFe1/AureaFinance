export type LedgerEntry = {
  accountId: string;
  type: "income" | "expense" | "transfer_in" | "transfer_out" | "adjustment";
  amountCents: number;
  status: "realized" | "projected" | "pending";
};

export function computeAccountBalance(initialBalanceCents: number, entries: LedgerEntry[]) {
  return entries.reduce((acc, entry) => {
    if (entry.status !== "realized") return acc;
    if (entry.type === "expense" || entry.type === "transfer_out") return acc - entry.amountCents;
    return acc + entry.amountCents;
  }, initialBalanceCents);
}

export function computeProjectedBalance(initialBalanceCents: number, entries: LedgerEntry[]) {
  return entries.reduce((acc, entry) => {
    if (entry.type === "expense" || entry.type === "transfer_out") return acc - entry.amountCents;
    return acc + entry.amountCents;
  }, initialBalanceCents);
}

export function summarizeCashFlow(entries: LedgerEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      if (entry.type === "income") acc.income += entry.amountCents;
      if (entry.type === "expense") acc.expense += entry.amountCents;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}
