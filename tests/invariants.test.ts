import { describe, expect, it } from "vitest";
import {
  calculateBalance,
  calculateProjectedBalance,
  closeMonthSnapshot,
  materializeOccurrences
} from "@/lib/finance";

describe("critical invariants", () => {
  it("divergência calculado vs conferido é opening+posted − saldo real", () => {
    const calculated = calculateBalance(10_000, [
      { direction: "income", amountCents: 5_000, status: "posted" },
      { direction: "expense", amountCents: 2_000, status: "posted" },
      { direction: "expense", amountCents: 500, status: "scheduled" }
    ]);
    const conferred = 12_500;
    const divergence = calculated - conferred;
    expect(calculated).toBe(13_000);
    expect(divergence).toBe(500);
  });

  it("fechamento mensal: snapshot é determinístico a partir dos totais", () => {
    const first = closeMonthSnapshot({
      openingBalanceCents: 100_000,
      incomesCents: 50_000,
      expensesCents: 30_000,
      transfersNetCents: 0,
      projectedBillPaymentsCents: 10_000
    });
    const second = closeMonthSnapshot({
      openingBalanceCents: 100_000,
      incomesCents: 50_000,
      expensesCents: 30_000,
      transfersNetCents: 0,
      projectedBillPaymentsCents: 10_000
    });
    expect(first).toEqual(second);
    expect(first.closingBalanceCents).toBe(120_000);
    expect(first.projectedFreeCashCents).toBe(110_000);
  });

  it("patrimônio conceitual: líquido + reservas + investimentos − dívidas", () => {
    const liquid = 50_000;
    const reserves = 20_000;
    const investments = 30_000;
    const debts = 15_000; // includes open card debt
    expect(liquid + reserves + investments - debts).toBe(85_000);
  });

  it("materialização de recorrência não duplica dueOn no mesmo horizonte", () => {
    const items = materializeOccurrences({
      nextRunOn: "2026-01-01",
      frequency: "monthly",
      amountCents: 1000,
      direction: "expense"
    }, 6);
    const dues = items.map((i) => i.dueOn);
    expect(new Set(dues).size).toBe(dues.length);
  });

  it("projetado ⊇ calculado em magnitude de lançamentos não-void", () => {
    const txs = [
      { direction: "income" as const, amountCents: 1000, status: "posted" as const },
      { direction: "expense" as const, amountCents: 100, status: "scheduled" as const },
      { direction: "expense" as const, amountCents: 999, status: "void" as const }
    ];
    const calc = calculateBalance(0, txs);
    const proj = calculateProjectedBalance(0, txs);
    expect(calc).toBe(1000);
    expect(proj).toBe(900);
    expect(proj).toBeLessThanOrEqual(calc);
  });
});
