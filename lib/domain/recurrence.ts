import { addDaysIso, addMonthsIso, isoDate, startOfMonthIso, withDayOfMonthIso } from "../dates";

export type RecurrenceFrequency = "weekly" | "monthly" | "quarterly";
export type GeneratedOccurrence = { dueOn: string; referenceKey: string };

function occurrenceForStep(anchorDate: string, frequency: RecurrenceFrequency, step: number, dayOfMonth?: number) {
  if (frequency === "weekly") return step === 0 ? anchorDate : addDaysIso(anchorDate, step * 7);
  const anchorDay = dayOfMonth ?? Number(anchorDate.slice(8, 10));
  const monthsToAdd = frequency === "quarterly" ? step * 3 : step;
  return withDayOfMonthIso(addMonthsIso(startOfMonthIso(anchorDate), monthsToAdd), anchorDay);
}

export function generateOccurrences(params: {
  startDate: Date; monthsAhead?: number; totalOccurrences?: number;
  frequency: RecurrenceFrequency; dayOfMonth?: number;
}): GeneratedOccurrence[] {
  const { startDate, monthsAhead = 6, totalOccurrences, frequency, dayOfMonth } = params;
  const results: GeneratedOccurrence[] = [];
  const anchorDate = isoDate(startDate);
  const maxDate = addMonthsIso(anchorDate, monthsAhead);
  let step = 0;
  let guard = 0;

  while (guard < 366) {
    const dueOn = occurrenceForStep(anchorDate, frequency, step, dayOfMonth);
    if (dueOn > maxDate) break;
    results.push({ dueOn, referenceKey: dueOn });
    step += 1;
    guard += 1;
    if (totalOccurrences && results.length >= totalOccurrences) break;
  }

  return results;
}
