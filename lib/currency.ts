const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function parseCurrencyToCents(input: string | number | null | undefined) {
  if (typeof input === "number") return Math.round(input * 100);
  if (!input) return 0;
  const normalized = input
    .toString()
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
}

export function toSafeCents(input: string | number | null | undefined) {
  return parseCurrencyToCents(input);
}

export function formatCurrencyFromCents(cents: number, currency = "BRL", locale = "pt-BR") {
  if (currency === "BRL" && locale === "pt-BR") {
    return brl.format((cents ?? 0) / 100);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format((cents ?? 0) / 100);
}
