import { describe, expect, it } from "vitest";
import { generateInstallments, splitInstallments } from "@/lib/finance";

describe("installments (lib/finance)", () => {
  it("gera parcelas futuras com mês de fatura", () => {
    const result = generateInstallments({
      purchaseDate: "2026-03-21",
      totalAmountCents: 100000,
      installmentCount: 3,
      closeDay: 25,
      dueDay: 3
    });

    expect(result).toHaveLength(3);
    expect(result[0].billMonth).toBe("2026-03");
    expect(result[0].amountCents + result[1].amountCents + result[2].amountCents).toBe(100000);
  });

  it("splitInstallments distribui resto sem perder centavos", () => {
    expect(splitInstallments(100, 3)).toEqual([34, 33, 33]);
    expect(splitInstallments(100, 3).reduce((a, b) => a + b, 0)).toBe(100);
  });
});
