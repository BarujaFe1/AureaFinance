import {
  calculateBalance,
  calculateProjectedBalance,
  closeMonthSnapshot,
  generateInstallments,
  materializeOccurrences,
  parseInstallmentLabel,
  resolveBillMonthForPurchase,
  splitInstallments
} from "../lib/finance";

describe("finance domain helpers", () => {
  it("calcula saldo realizado ignorando lançamentos agendados e void", () => {
    const result = calculateBalance(10_000, [
      { direction: "income", amountCents: 2_500, status: "posted" },
      { direction: "expense", amountCents: 1_200, status: "posted" },
      { direction: "expense", amountCents: 800, status: "scheduled" },
      { direction: "transfer_out", amountCents: 300, status: "void" }
    ]);

    expect(result).toBe(11_300);
  });

  it("calcula saldo projetado considerando posted e scheduled, mas ignorando void", () => {
    const result = calculateProjectedBalance(10_000, [
      { direction: "income", amountCents: 2_500, status: "posted" },
      { direction: "expense", amountCents: 1_200, status: "posted" },
      { direction: "expense", amountCents: 800, status: "scheduled" },
      { direction: "transfer_out", amountCents: 300, status: "void" }
    ]);

    expect(result).toBe(10_500);
  });

  it("divide parcelas preservando o total em centavos", () => {
    const installments = splitInstallments(10_000, 3);

    expect(installments).toEqual([3334, 3333, 3333]);
    expect(installments.reduce((sum, item) => sum + item, 0)).toBe(10_000);
  });

  it("resolve corretamente o mês da fatura conforme o dia de fechamento", () => {
    expect(resolveBillMonthForPurchase("2026-03-05", 10)).toBe("2026-03");
    expect(resolveBillMonthForPurchase("2026-03-25", 10)).toBe("2026-04");
  });

  it("gera parcelas futuras explícitas com mês de fatura e vencimento", () => {
    const plan = generateInstallments({
      purchaseDate: "2026-03-25",
      totalAmountCents: 12_000,
      installmentCount: 3,
      closeDay: 10,
      dueDay: 15
    });

    expect(plan).toHaveLength(3);
    expect(plan[0]).toMatchObject({
      installmentNumber: 1,
      amountCents: 4_000,
      billMonth: "2026-04",
      billDueOn: "2026-05-15"
    });
    expect(plan[2]).toMatchObject({
      installmentNumber: 3,
      amountCents: 4_000,
      billMonth: "2026-06",
      billDueOn: "2026-07-15"
    });
  });

  it("materializa recorrências sem corromper o histórico", () => {
    const occurrences = materializeOccurrences({
      nextRunOn: "2026-03-10",
      frequency: "monthly",
      amountCents: 14990,
      direction: "expense"
    }, 3);

    expect(occurrences.map((item) => item.dueOn)).toEqual([
      "2026-03-10",
      "2026-04-10",
      "2026-05-10",
      "2026-06-10"
    ]);
  });

  it("fecha o mês com visão realizada e caixa livre projetado", () => {
    const snapshot = closeMonthSnapshot({
      openingBalanceCents: 100_000,
      incomesCents: 25_000,
      expensesCents: 18_000,
      transfersNetCents: -3_000,
      projectedBillPaymentsCents: 9_000
    });

    expect(snapshot).toEqual({
      realizedNetCents: 7_000,
      closingBalanceCents: 104_000,
      projectedFreeCashCents: 95_000
    });
  });

  it("interpreta rótulos de parcela corretamente", () => {
    expect(parseInstallmentLabel("Violino (4/10)")).toEqual({ current: 4, total: 10 });
    expect(parseInstallmentLabel("Compra sem parcela")).toBeNull();
  });
});
