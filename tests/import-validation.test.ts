import { describe, expect, it } from "vitest";
import { validateGenericFinanceRow } from "@/lib/domain/import-validation";
import { normalizeBatchMeta, normalizeDryRunReport } from "@/lib/import-normalizers";

describe("import validation", () => {
  it("rejeita linha sem data", () => {
    const issues = validateGenericFinanceRow({ amountCents: 1000, description: "Teste" });
    expect(issues.some((i) => i.code === "missing_date" && i.severity === "error")).toBe(true);
  });

  it("rejeita linha sem valor", () => {
    const issues = validateGenericFinanceRow({ occurredOn: "2026-01-01", description: "Teste" });
    expect(issues.some((i) => i.code === "missing_amount" && i.severity === "error")).toBe(true);
  });

  it("aceita linha com date no lugar de occurredOn", () => {
    const issues = validateGenericFinanceRow({ date: "2026-01-01", amountCents: 1000, description: "Teste" });
    expect(issues.some((i) => i.code === "missing_date")).toBe(false);
  });

  it("aceita linha com amount/valor no lugar de amountCents", () => {
    const issues = validateGenericFinanceRow({ occurredOn: "2026-01-01", amount: 1000, descricao: "Teste" });
    expect(issues.some((i) => i.code === "missing_amount")).toBe(false);
  });

  it("emite warning para valor zero", () => {
    const issues = validateGenericFinanceRow({ occurredOn: "2026-01-01", amountCents: 0, description: "Teste" });
    expect(issues.some((i) => i.code === "zero_amount" && i.severity === "warning")).toBe(true);
  });

  it("emite warning para missing description", () => {
    const issues = validateGenericFinanceRow({ occurredOn: "2026-01-01", amountCents: 1000 });
    expect(issues.some((i) => i.code === "missing_description" && i.severity === "warning")).toBe(true);
  });

  it("aceita linha com nome no lugar de descricao", () => {
    const issues = validateGenericFinanceRow({ occurredOn: "2026-01-01", amountCents: 1000, nome: "Teste" });
    expect(issues.some((i) => i.code === "missing_description")).toBe(false);
  });
});

describe("import normalizers", () => {
  describe("normalizeBatchMeta", () => {
    it("retorna sheets vazia para null/undefined", () => {
      expect(normalizeBatchMeta(null)).toEqual({ sheets: [] });
      expect(normalizeBatchMeta(undefined)).toEqual({ sheets: [] });
    });

    it("normaliza formato canônico { sheets: [...] }", () => {
      const result = normalizeBatchMeta({ sheets: [{ name: "Contas", suggestedTarget: "accounts", rowCount: 10 }] });
      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].name).toBe("Contas");
      expect(result.sheets[0].suggestedTarget).toBe("accounts");
    });

    it("normaliza formato legado (array bruto)", () => {
      const result = normalizeBatchMeta([{ name: "Cartões", detectedEntity: "credit_cards", rows: 20 }]);
      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].suggestedTarget).toBe("credit_cards");
    });

    it("filtra sheets sem nome", () => {
      const result = normalizeBatchMeta({ sheets: [{ name: "", suggestedTarget: "accounts" }, { name: "Válida", suggestedTarget: "transactions", rowCount: 5 }] });
      expect(result.sheets).toHaveLength(1);
      expect(result.sheets[0].name).toBe("Válida");
    });
  });

  describe("normalizeDryRunReport", () => {
    it("retorna null para objeto sem summary", () => {
      expect(normalizeDryRunReport({})).toBeNull();
      expect(normalizeDryRunReport(null)).toBeNull();
    });

    it("normaliza report com summary e warnings", () => {
      const result = normalizeDryRunReport({ summary: { accounts: 5, transactions: 100, creditCards: 3, purchases: 10, installments: 30, issues: 2 }, warnings: ["Cartão sem fatura"] });
      expect(result?.summary.accounts).toBe(5);
      expect(result?.warnings).toContain("Cartão sem fatura");
    });

    it("filtra warnings não-string", () => {
      const result = normalizeDryRunReport({ summary: { accounts: 0, transactions: 0, creditCards: 0, purchases: 0, installments: 0, issues: 0 }, warnings: ["ok", 123 as unknown as string] });
      expect(result?.warnings).toEqual(["ok"]);
    });
  });
});
