import { addDays, addMonths, endOfMonth, format, parse, startOfMonth } from "date-fns";

export function nowTs() {
  return Date.now();
}

export function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

export function isoDate(value: Date | string) {
  return format(typeof value === "string" ? new Date(value) : value, "yyyy-MM-dd");
}

export function isoMonth(value: Date | string) {
  return format(typeof value === "string" ? new Date(value) : value, "yyyy-MM");
}

export function startOfMonthIso(value: Date | string) {
  return format(startOfMonth(typeof value === "string" ? new Date(value) : value), "yyyy-MM-dd");
}

export function endOfMonthIso(value: Date | string) {
  return format(endOfMonth(typeof value === "string" ? new Date(value) : value), "yyyy-MM-dd");
}

export function addMonthsIso(date: string, amount: number) {
  return format(addMonths(new Date(date), amount), "yyyy-MM-dd");
}

export function addDaysIso(date: string, amount: number) {
  return format(addDays(new Date(date), amount), "yyyy-MM-dd");
}

export function parseBrazilianDate(value: string) {
  return parse(value, "dd/MM/yyyy", new Date());
}
