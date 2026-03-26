import { describe, expect, it } from "vitest";
import { detectEntityFromSheet, guessColumns } from "@/lib/domain/import-mapping";

describe("import mapping", () => {
  it("detecta aba de cartões", () => {
    const detected = detectEntityFromSheet({
      name: "Cartões",
      rowCount: 20,
      columnCount: 8,
      sampleHeaders: ["Data", "Descrição", "Valor"]
    });

    expect(detected).toBe("credit_cards");
  });

  it("sugere colunas", () => {
    const guesses = guessColumns(["Data", "Descrição", "Valor", "Conta"]);
    expect(guesses.map((item) => item.target)).toContain("transactionDate");
    expect(guesses.map((item) => item.target)).toContain("amountCents");
  });
});
