import { describe, expect, it } from "vitest";
import {
  calculateBalance,
  calculateProjectedBalance,
  generateInstallments,
  materializeOccurrences,
  signedAmount
} from "@/lib/finance";

describe("balance (lib/finance)", () => {
  const entries = [
    { direction: "income" as const, amountCents: 100000, status: "posted" as const },
    { direction: "expense" as const, amountCents: 25000, status: "posted" as const },
    { direction: "expense" as const, amountCents: 10000, status: "scheduled" as const }
  ];

  it("calcula saldo realizado ignorando scheduled/void", () => {
    expect(calculateBalance(50000, entries)).toBe(125000);
  });

  it("calcula saldo projetado incluindo posted e scheduled, ignorando void", () => {
    expect(calculateProjectedBalance(50000, entries)).toBe(115000);
  });

  it("saldo realizado com only scheduled entries retorna opening", () => {
    const scheduled = [{ direction: "expense" as const, amountCents: 5000, status: "scheduled" as const }];
    expect(calculateBalance(10000, scheduled)).toBe(10000);
  });

  it("saldo realizado com entries vazias retorna opening", () => {
    expect(calculateBalance(50000, [])).toBe(50000);
  });

  it("saldo projetado com entries vazias retorna opening", () => {
    expect(calculateProjectedBalance(50000, [])).toBe(50000);
  });

  it("signedAmount e cashflow: income positivo, expense negativo", () => {
    expect(signedAmount("income", 100000)).toBe(100000);
    expect(signedAmount("expense", 25000)).toBe(-25000);
    expect(signedAmount("transfer_in", 5000)).toBe(5000);
    expect(signedAmount("transfer_out", 3000)).toBe(-3000);
  });
});

describe("invariants: no double-count calc vs projected", () => {
  it("void nunca entra em calculado nem projetado; scheduled só no projetado", () => {
    const txs = [
      { direction: "income" as const, amountCents: 1000, status: "posted" as const },
      { direction: "expense" as const, amountCents: 200, status: "scheduled" as const },
      { direction: "expense" as const, amountCents: 50, status: "void" as const }
    ];
    expect(calculateBalance(0, txs)).toBe(1000);
    expect(calculateProjectedBalance(0, txs)).toBe(800);
  });

  it("bill_payment e expense não se somam duas vezes no mesmo ledger de conta", () => {
    // Design: card purchase is NOT a transaction; only bill_payment hits the account.
    const accountLedger = [
      { direction: "bill_payment" as const, amountCents: 50000, status: "posted" as const }
    ];
    expect(calculateBalance(100000, accountLedger)).toBe(50000);
    expect(calculateProjectedBalance(100000, accountLedger)).toBe(50000);
  });
});
