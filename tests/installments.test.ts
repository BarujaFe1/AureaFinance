import { describe, expect, it } from "vitest";
import { generateCardInstallments } from "@/lib/domain/installments";

describe("installments", () => {
  it("gera parcelas futuras com mês de fatura", () => {
    const result = generateCardInstallments({
      purchaseDate: new Date("2026-03-21"),
      totalCents: 100000,
      installmentCount: 3,
      closingDay: 25,
      dueDay: 3
    });

    expect(result).toHaveLength(3);
    expect(result[0].statementMonth).toBe("2026-03");
    expect(result[0].amountCents + result[1].amountCents + result[2].amountCents).toBe(100000);
  });
});
