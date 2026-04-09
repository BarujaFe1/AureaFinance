function pad(value: number) {
  return String(value).padStart(2, "0");
}

function isIsoDateText(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isBrazilianDateText(value: string) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
}

function toUtcDate(year: number, month: number, day: number) {
  return new Date(Date.UTC(year, month - 1, day));
}

function fromDateParts(value: Date) {
  return {
    year: value.getUTCFullYear(),
    month: value.getUTCMonth() + 1,
    day: value.getUTCDate()
  };
}

function parseIsoDateParts(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  return { year, month, day };
}

function daysInMonth(year: number, month: number) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function normalizeDate(value: Date | string) {
  if (typeof value === "string") {
    if (isIsoDateText(value)) {
      const { year, month, day } = parseIsoDateParts(value);
      return toUtcDate(year, month, day);
    }
    if (isBrazilianDateText(value)) {
      const [day, month, year] = value.split("/").map(Number);
      return toUtcDate(year, month, day);
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return new Date(NaN);
    return parsed;
  }
  return new Date(value.getTime());
}

function formatIsoFromParts(parts: { year: number; month: number; day: number }) {
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}`;
}

export function nowTs() {
  return Date.now();
}

export function todayIso() {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

export function isoDate(value: Date | string) {
  if (typeof value === "string" && isIsoDateText(value)) return value;
  const normalized = normalizeDate(value);
  return formatIsoFromParts(fromDateParts(normalized));
}

export function isoMonth(value: Date | string) {
  if (typeof value === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(value)) return value.slice(0, 7);
  const normalized = normalizeDate(value);
  const { year, month } = fromDateParts(normalized);
  return `${year}-${pad(month)}`;
}

export function startOfMonthIso(value: Date | string) {
  if (typeof value === "string" && /^\d{4}-\d{2}(-\d{2})?$/.test(value)) return `${value.slice(0, 7)}-01`;
  const normalized = normalizeDate(value);
  const { year, month } = fromDateParts(normalized);
  return `${year}-${pad(month)}-01`;
}

export function endOfMonthIso(value: Date | string) {
  const month = isoMonth(value);
  const { year, month: monthIndex } = parseIsoDateParts(`${month}-01`);
  return `${month}-${pad(daysInMonth(year, monthIndex))}`;
}

export function withDayOfMonthIso(value: Date | string, desiredDay: number) {
  const month = isoMonth(value);
  const { year, month: monthIndex } = parseIsoDateParts(`${month}-01`);
  const day = Math.min(Math.max(desiredDay, 1), daysInMonth(year, monthIndex));
  return `${month}-${pad(day)}`;
}

export function addMonthsIso(value: string, amount: number) {
  const { year, month, day } = parseIsoDateParts(isoDate(value));
  const totalMonths = (year * 12) + (month - 1) + amount;
  const nextYear = Math.floor(totalMonths / 12);
  const nextMonth = (totalMonths % 12) + 1;
  const nextDay = Math.min(day, daysInMonth(nextYear, nextMonth));
  return formatIsoFromParts({ year: nextYear, month: nextMonth, day: nextDay });
}

export function addDaysIso(value: string, amount: number) {
  const { year, month, day } = parseIsoDateParts(isoDate(value));
  const date = toUtcDate(year, month, day);
  date.setUTCDate(date.getUTCDate() + amount);
  return isoDate(date);
}

export function parseBrazilianDate(value: string) {
  const [day, month, year] = value.split("/").map(Number);
  return toUtcDate(year, month, day);
}
