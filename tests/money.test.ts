import { describe, expect, it } from "vitest";
import { formatCurrency, splitEvenly, toCents } from "@/lib/money";

describe("money", () => {
  it("converte string brasileira em centavos", () => {
    expect(toCents("1.234,56")).toBe(123456);
  });

  it("divide parcelas preservando centavos", () => {
    expect(splitEvenly(1000, 3)).toEqual([334, 333, 333]);
  });

  it("formata moeda", () => {
    expect(formatCurrency(123456)).toContain("1.234,56");
  });
});
