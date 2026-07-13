import { describe, expect, it } from "vitest";
import { parseCurrencyToCents, toSafeCents } from "@/lib/currency";

describe("currency parse", () => {
  it("parseia valores BR para centavos", () => {
    expect(parseCurrencyToCents("1.234,56")).toBe(123456);
    expect(parseCurrencyToCents("R$ 10,00")).toBe(1000);
    expect(parseCurrencyToCents(12.34)).toBe(1234);
  });

  it("trata vazio como zero", () => {
    expect(parseCurrencyToCents("")).toBe(0);
    expect(parseCurrencyToCents(null)).toBe(0);
    expect(parseCurrencyToCents(undefined)).toBe(0);
  });

  it("falha alto em texto inválido não-vazio", () => {
    expect(() => parseCurrencyToCents("abc")).toThrow(/inválido/i);
  });

  it("toSafeCents engole inválidos", () => {
    expect(toSafeCents("abc")).toBe(0);
    expect(toSafeCents("79,89")).toBe(7989);
  });
});
