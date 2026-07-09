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

  it("detecta aba de contas", () => {
    const detected = detectEntityFromSheet({
      name: "Contas",
      rowCount: 10,
      columnCount: 5,
      sampleHeaders: ["Banco", "Tipo", "Saldo"]
    });
    expect(detected).toBe("accounts_ledger");
  });

  it("detecta aba de acompanhamento mensal", () => {
    const detected = detectEntityFromSheet({
      name: "Acompanhamento Mensal",
      rowCount: 100,
      columnCount: 6,
      sampleHeaders: []
    });
    expect(detected).toBe("monthly_projection");
  });

  it("detecta aba de resumo do investimento", () => {
    const detected = detectEntityFromSheet({
      name: "Resumo do Investimento",
      rowCount: 30,
      columnCount: 4,
      sampleHeaders: []
    });
    expect(detected).toBe("investment_summary");
  });

  it("detecta aba de registro diário de investimentos", () => {
    const detected = detectEntityFromSheet({
      name: "Registro Diário de Investimentos",
      rowCount: 50,
      columnCount: 7,
      sampleHeaders: []
    });
    expect(detected).toBe("net_worth_timeseries");
  });

  it("detecta aba custom_planner pelo nome richard", () => {
    const detected = detectEntityFromSheet({
      name: "Richard",
      rowCount: 10,
      columnCount: 3,
      sampleHeaders: []
    });
    expect(detected).toBe("custom_planner");
  });

  it("retorna unknown para aba não reconhecida", () => {
    const detected = detectEntityFromSheet({
      name: "Planilha Qualquer",
      rowCount: 5,
      columnCount: 3,
      sampleHeaders: ["Foo", "Bar"]
    });
    expect(detected).toBe("unknown");
  });

  it("sugere colunas com base em headers em português", () => {
    const guesses = guessColumns(["Data", "Descrição", "Valor", "Conta"]);
    expect(guesses.map((item) => item.target)).toContain("transactionDate");
    expect(guesses.map((item) => item.target)).toContain("amountCents");
    expect(guesses.map((item) => item.target)).toContain("description");
    expect(guesses.map((item) => item.target)).toContain("accountName");
  });

  it("retorna manual_review para coluna não mapeável", () => {
    const guesses = guessColumns(["Código", "Observação"]);
    guesses.forEach((g) => expect(g.target).toBe("manual_review"));
  });

  it("retorna confidence high para data, descrição e valor", () => {
    const guesses = guessColumns(["Data", "Descrição", "Valor"]);
    guesses.forEach((g) => expect(g.confidence).toBe("high"));
  });

  it("detecta aba de registro diário (sem acento)", () => {
    const detected = detectEntityFromSheet({
      name: "Registro Diario",
      rowCount: 20,
      columnCount: 5,
      sampleHeaders: []
    });
    expect(detected).toBe("daily_balance_series");
  });

  it("detecta aba de contas via headers quando nome não é padrão", () => {
    const detected = detectEntityFromSheet({
      name: "Planilha 1",
      rowCount: 20,
      columnCount: 5,
      sampleHeaders: ["Valor", "Data", "Descrição"]
    });
    expect(detected).toBe("accounts_ledger");
  });
});
