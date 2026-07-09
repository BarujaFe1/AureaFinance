import { describe, expect, it } from "vitest";
import { addDaysIso, addMonthsIso, endOfMonthIso, isoDate, isoMonth, startOfMonthIso, todayIso, withDayOfMonthIso } from "@/lib/dates";

describe("dates", () => {
  it("isoDate normaliza Date para string ISO", () => {
    expect(isoDate(new Date("2026-03-15"))).toBe("2026-03-15");
  });

  it("isoDate retorna string ISO como está", () => {
    expect(isoDate("2026-03-15")).toBe("2026-03-15");
  });

  it("isoDate normaliza data brasileira", () => {
    expect(isoDate("15/03/2026")).toBe("2026-03-15");
  });

  it("isoMonth extrai YYYY-MM de Date", () => {
    expect(isoMonth(new Date("2026-03-15"))).toBe("2026-03");
  });

  it("isoMonth extrai YYYY-MM de string ISO", () => {
    expect(isoMonth("2026-03-15")).toBe("2026-03");
  });

  it("startOfMonthIso retorna primeiro dia do mês", () => {
    expect(startOfMonthIso("2026-03-15")).toBe("2026-03-01");
  });

  it("endOfMonthIso retorna último dia do mês", () => {
    expect(endOfMonthIso("2026-03-15")).toBe("2026-03-31");
    expect(endOfMonthIso("2026-02-10")).toBe("2026-02-28");
  });

  it("addMonthsIso adiciona meses corretamente", () => {
    expect(addMonthsIso("2026-01-15", 1)).toBe("2026-02-15");
    expect(addMonthsIso("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonthsIso("2026-12-15", 2)).toBe("2027-02-15");
  });

  it("addDaysIso adiciona dias corretamente", () => {
    expect(addDaysIso("2026-03-15", 7)).toBe("2026-03-22");
    expect(addDaysIso("2026-12-30", 5)).toBe("2027-01-04");
  });

  it("withDayOfMonthIso ajusta dia respeitando limite do mês", () => {
    expect(withDayOfMonthIso("2026-03-15", 10)).toBe("2026-03-10");
    expect(withDayOfMonthIso("2026-02-15", 31)).toBe("2026-02-28");
    expect(withDayOfMonthIso("2026-04-15", 31)).toBe("2026-04-30");
  });

  it("todayIso retorna string ISO válida", () => {
    const today = todayIso();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
