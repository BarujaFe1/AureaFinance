export type RecurrenceFrequency = "weekly" | "monthly" | "quarterly";
export type GeneratedOccurrence = { dueOn: string; referenceKey: string };

function addDays(date: Date, amount: number) { const c = new Date(date); c.setDate(c.getDate() + amount); return c; }
function addWeeks(date: Date, amount: number) { return addDays(date, amount * 7); }
function addMonths(date: Date, amount: number) { const c = new Date(date); c.setMonth(c.getMonth() + amount); return c; }
function setDay(date: Date, day: number) { const c = new Date(date); c.setDate(day); return c; }
function toIsoDate(date: Date) { return date.toISOString().slice(0, 10); }

export function generateOccurrences(params: {
  startDate: Date; monthsAhead?: number; totalOccurrences?: number;
  frequency: RecurrenceFrequency; dayOfMonth?: number;
}): GeneratedOccurrence[] {
  const { startDate, monthsAhead = 6, totalOccurrences, frequency, dayOfMonth } = params;
  const results: GeneratedOccurrence[] = [];
  let cursor = new Date(startDate);
  let guard = 0;
  const maxDate = addMonths(startDate, monthsAhead);

  while (guard < 366) {
    if (frequency === "weekly") {
      cursor = results.length === 0 ? new Date(startDate) : addWeeks(cursor, 1);
    } else {
      const step = frequency === "monthly" ? results.length : results.length * 3;
      cursor = setDay(addMonths(startDate, step), dayOfMonth ?? startDate.getDate());
    }
    if (cursor > maxDate) break;
    results.push({ dueOn: toIsoDate(cursor), referenceKey: toIsoDate(cursor) });
    guard += 1;
    if (totalOccurrences && results.length >= totalOccurrences) break;
  }
  return results;
}
