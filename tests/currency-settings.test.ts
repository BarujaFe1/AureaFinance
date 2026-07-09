import { describe, expect, it } from "vitest";
import { configureCurrencyFormat, formatCurrencyFromCents, getCurrencyFormatDefaults } from "@/lib/currency";

describe("currency settings wiring", () => {
  it("usa defaults BRL/pt-BR por padrão", () => {
    configureCurrencyFormat("BRL", "pt-BR");
    expect(getCurrencyFormatDefaults()).toEqual({ currency: "BRL", locale: "pt-BR" });
    expect(formatCurrencyFromCents(12345)).toContain("123,45");
  });

  it("respeita configureCurrencyFormat para USD/en-US", () => {
    configureCurrencyFormat("USD", "en-US");
    const formatted = formatCurrencyFromCents(12345);
    expect(formatted).toContain("123.45");
    expect(formatted).toMatch(/\$/);
    configureCurrencyFormat("BRL", "pt-BR");
  });
});
