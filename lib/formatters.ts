import { format } from "date-fns";
import { formatCurrency } from "@/lib/money";

export function formatShortDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "dd/MM/yyyy");
}

export function formatMonthRef(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MM/yyyy");
}

export { formatCurrency };
