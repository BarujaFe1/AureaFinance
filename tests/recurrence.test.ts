import { describe, expect, it } from "vitest";
import { generateOccurrences } from "@/lib/domain/recurrence";

describe("recurrence", () => {
  it("gera ocorrências mensais", () => {
    const result = generateOccurrences({
      startDate: new Date("2026-03-10"),
      frequency: "monthly",
      monthsAhead: 3,
      dayOfMonth: 10
    });

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].referenceKey).toContain("2026-03-10");
  });
});
