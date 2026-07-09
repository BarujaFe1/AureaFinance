import {
  calculateBalance,
  calculateProjectedBalance,
  closeMonthSnapshot,
  generateInstallments,
  materializeOccurrences,
  parseInstallmentLabel,
  resolveBillMonthForPurchase,
  splitInstallments,
  signedAmount,
  toBalanceTransaction,
  toBalanceTransactions
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

  it("calcula saldo projetado considerando posted e scheduled, ignorando void", () => {
    const result = calculateProjectedBalance(10_000, [
      { direction: "income", amountCents: 2_500, status: "posted" },
      { direction: "expense", amountCents: 1_200, status: "posted" },
      { direction: "expense", amountCents: 800, status: "scheduled" },
      { direction: "transfer_out", amountCents: 300, status: "void" }
    ]);
    expect(result).toBe(10_500);
  });

  it("signedAmount retorna positivo para income", () => {
    expect(signedAmount("income", 1000)).toBe(1000);
    expect(signedAmount("transfer_in", 1000)).toBe(1000);
  });

  it("signedAmount retorna negativo para expense", () => {
    expect(signedAmount("expense", 1000)).toBe(-1000);
    expect(signedAmount("transfer_out", 1000)).toBe(-1000);
    expect(signedAmount("bill_payment", 1000)).toBe(-1000);
    expect(signedAmount("adjustment", 1000)).toBe(-1000);
  });

  it("signedAmount usa Math.abs para garantir valor positivo", () => {
    expect(signedAmount("income", -500)).toBe(500);
    expect(signedAmount("expense", -500)).toBe(-500);
  });

  it("toBalanceTransaction converte direction/status com fallback seguro", () => {
    const result = toBalanceTransaction({ direction: "INVALID", amountCents: 1000, status: "UNKNOWN" });
    expect(result.direction).toBe("expense");
    expect(result.status).toBe("posted");
    expect(result.amountCents).toBe(1000);
  });

  it("toBalanceTransactions mapeia lista", () => {
    const result = toBalanceTransactions([
      { direction: "income", amountCents: 500, status: "posted" }
    ]);
    expect(result).toHaveLength(1);
    expect(result[0].direction).toBe("income");
  });

  it("divide parcelas preservando o total em centavos", () => {
    const installments = splitInstallments(10_000, 3);
    expect(installments).toEqual([3334, 3333, 3333]);
    expect(installments.reduce((sum, item) => sum + item, 0)).toBe(10_000);
  });

  it("splitInstallments com 1 parcela retorna total", () => {
    expect(splitInstallments(10000, 1)).toEqual([10000]);
  });

  it("splitInstallments com valor pequeno", () => {
    const result = splitInstallments(1, 3);
    expect(result).toEqual([1, 0, 0]);
    expect(result.reduce((s, v) => s + v, 0)).toBe(1);
  });

  it("resolve corretamente o mês da fatura conforme o dia de fechamento", () => {
    expect(resolveBillMonthForPurchase("2026-03-05", 10)).toBe("2026-03");
    expect(resolveBillMonthForPurchase("2026-03-25", 10)).toBe("2026-04");
  });

  it("resolveBillMonthForPurchase no último dia do mês", () => {
    expect(resolveBillMonthForPurchase("2026-01-31", 28)).toBe("2026-02");
    expect(resolveBillMonthForPurchase("2026-01-31", 31)).toBe("2026-01");
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

  it("materializa recorrências semanais", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-01-05",
      frequency: "weekly",
      amountCents: 5000,
      direction: "expense"
    }, 1);
    expect(result.length).toBeGreaterThanOrEqual(4);
    expect(result[0].dueOn).toBe("2026-01-05");
    expect(result[1].dueOn).toBe("2026-01-12");
  });

  it("materializa recorrências anuais", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-06-15",
      frequency: "yearly",
      amountCents: 120000,
      direction: "income"
    }, 24);
    expect(result.length).toBe(3);
    expect(result[0].dueOn).toBe("2026-06-15");
    expect(result[1].dueOn).toBe("2027-06-15");
    expect(result[2].dueOn).toBe("2028-06-15");
  });

  it("materializa recorrências respeitando endsOn", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-01-01",
      endsOn: "2026-03-15",
      frequency: "monthly",
      amountCents: 10000,
      direction: "expense"
    }, 12);
    expect(result.length).toBe(3);
    expect(result[0].dueOn).toBe("2026-01-01");
    expect(result[2].dueOn).toBe("2026-03-01");
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

  it("closeMonthSnapshot com valores zerados", () => {
    const snapshot = closeMonthSnapshot({
      openingBalanceCents: 0,
      incomesCents: 0,
      expensesCents: 0,
      transfersNetCents: 0,
      projectedBillPaymentsCents: 0
    });
    expect(snapshot.realizedNetCents).toBe(0);
    expect(snapshot.closingBalanceCents).toBe(0);
    expect(snapshot.projectedFreeCashCents).toBe(0);
  });

  it("interpreta rótulos de parcela corretamente", () => {
    expect(parseInstallmentLabel("Violino (4/10)")).toEqual({ current: 4, total: 10 });
    expect(parseInstallmentLabel("Compra sem parcela")).toBeNull();
    expect(parseInstallmentLabel("Item (1/1)")).toEqual({ current: 1, total: 1 });
  });

  it("generateInstallments preserva total em centavos", () => {
    const plan = generateInstallments({
      purchaseDate: "2026-01-15",
      totalAmountCents: 10000,
      installmentCount: 7,
      closeDay: 10,
      dueDay: 15
    });
    const total = plan.reduce((s, i) => s + i.amountCents, 0);
    expect(total).toBe(10000);
    expect(plan).toHaveLength(7);
  });
});
