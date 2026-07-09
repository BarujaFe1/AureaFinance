import { describe, expect, it } from "vitest";
import { materializeOccurrences } from "@/lib/finance";

describe("recurrence (lib/finance materializeOccurrences)", () => {
  it("gera ocorrências mensais a partir de nextRunOn", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-03-10",
      frequency: "monthly",
      amountCents: 10000,
      direction: "expense"
    }, 3);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].dueOn).toBe("2026-03-10");
    expect(result[1].dueOn).toBe("2026-04-10");
    expect(result[2].dueOn).toBe("2026-05-10");
  });

  it("gera ocorrências semanais", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-03-01",
      frequency: "weekly",
      amountCents: 1000,
      direction: "expense"
    }, 1);
    expect(result[0].dueOn).toBe("2026-03-01");
    expect(result[1].dueOn).toBe("2026-03-08");
    expect(result.some((row) => row.dueOn === "2026-03-29")).toBe(true);
  });

  it("gera ocorrências anuais", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-01-15",
      frequency: "yearly",
      amountCents: 5000,
      direction: "income"
    }, 24);
    expect(result[0].dueOn).toBe("2026-01-15");
    expect(result[1].dueOn).toBe("2027-01-15");
  });

  it("respeita endsOn", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-01-01",
      endsOn: "2026-02-01",
      frequency: "monthly",
      amountCents: 1000,
      direction: "expense"
    }, 12);
    expect(result.map((r) => r.dueOn)).toEqual(["2026-01-01", "2026-02-01"]);
  });

  it("é idempotente em conteúdo: duas chamadas iguais produzem o mesmo dueOn set", () => {
    const input = {
      nextRunOn: "2026-01-01",
      frequency: "monthly" as const,
      amountCents: 2500,
      direction: "expense" as const
    };
    const a = materializeOccurrences(input, 3).map((r) => r.dueOn);
    const b = materializeOccurrences(input, 3).map((r) => r.dueOn);
    expect(a).toEqual(b);
    expect(new Set(a).size).toBe(a.length);
  });

  it("ajusta dayOfMonth para último dia do mês quando necessário", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-01-31",
      frequency: "monthly",
      amountCents: 1000,
      direction: "expense"
    }, 3);
    expect(result[0].dueOn).toBe("2026-01-31");
    expect(result[1].dueOn).toBe("2026-02-28");
    expect(result[2].dueOn).toBe("2026-03-31");
  });

  it("horizonMonths=0 gera só a âncora", () => {
    const result = materializeOccurrences({
      nextRunOn: "2026-06-01",
      frequency: "monthly",
      amountCents: 1000,
      direction: "expense"
    }, 0);
    expect(result.map((r) => r.dueOn)).toEqual(["2026-06-01"]);
  });
});
