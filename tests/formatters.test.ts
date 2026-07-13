import { describe, expect, it } from "vitest";
import { formatMonthRef, formatShortDate } from "@/lib/formatters";

describe("formatters dates", () => {
  it("formatShortDate não desloca yyyy-MM-dd por timezone", () => {
    expect(formatShortDate("2026-03-15")).toBe("15/03/2026");
    expect(formatShortDate("2026-01-01")).toBe("01/01/2026");
  });

  it("formatMonthRef extrai MM/yyyy de ISO", () => {
    expect(formatMonthRef("2026-03-15")).toBe("03/2026");
    expect(formatMonthRef("2026-12")).toBe("12/2026");
  });
});
