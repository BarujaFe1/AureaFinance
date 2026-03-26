export function toCents(value: number | string): number {
  if (typeof value === "number") return Math.round(value * 100);

  const normalized = value
    .replace(/R\$/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) throw new Error(`Valor monetário inválido: ${value}`);
  return Math.round(parsed * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatCurrency(cents: number, locale = "pt-BR", currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(fromCents(cents));
}

export function splitEvenly(totalCents: number, parts: number) {
  if (parts <= 0) throw new Error("parts must be greater than zero");
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents % parts;

  return Array.from({ length: parts }, (_, index) => base + (index < remainder ? 1 : 0));
}
