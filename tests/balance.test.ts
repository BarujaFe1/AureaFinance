import { describe, expect, it } from "vitest";
import { computeAccountBalance, computeProjectedBalance } from "@/lib/domain/balance";

describe("balance", () => {
  const entries = [
    { accountId: "a", type: "income" as const, amountCents: 100000, status: "realized" as const },
    { accountId: "a", type: "expense" as const, amountCents: 25000, status: "realized" as const },
    { accountId: "a", type: "expense" as const, amountCents: 10000, status: "projected" as const }
  ];

  it("calcula saldo realizado", () => {
    expect(computeAccountBalance(50000, entries)).toBe(125000);
  });

  it("calcula saldo projetado", () => {
    expect(computeProjectedBalance(50000, entries)).toBe(115000);
  });
});
