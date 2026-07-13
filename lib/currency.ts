const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

let formatDefaults = { currency: "BRL", locale: "pt-BR" };

/** Wire Settings.baseCurrency / Settings.locale so call sites keep using formatCurrencyFromCents. */
export function configureCurrencyFormat(currency: string, locale: string) {
  formatDefaults = {
    currency: currency || "BRL",
    locale: locale || "pt-BR"
  };
}

export function getCurrencyFormatDefaults() {
  return formatDefaults;
}

/**
 * Parses BR-style currency text into integer cents.
 * Empty/null → 0. Invalid non-empty text → throws (prefer fail-loud on import/forms).
 * For legacy soft parsing, use `toSafeCents`.
 */
export function parseCurrencyToCents(input: string | number | null | undefined) {
  if (typeof input === "number") return Math.round(input * 100);
  if (input == null) return 0;
  const raw = input.toString().trim();
  if (!raw) return 0;

  const normalized = raw
    .replace(/R\$/gi, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");

  if (!normalized || normalized === "-" || normalized === "." || normalized === "-.") {
    throw new Error(`Valor monetário inválido: ${raw}`);
  }

  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    throw new Error(`Valor monetário inválido: ${raw}`);
  }
  return Math.round(numeric * 100);
}

/** Soft parser for optional fields — invalid text becomes 0 instead of throwing. */
export function toSafeCents(input: string | number | null | undefined) {
  try {
    return parseCurrencyToCents(input);
  } catch {
    return 0;
  }
}

export function formatCurrencyFromCents(cents: number, currency = formatDefaults.currency, locale = formatDefaults.locale) {
  if (currency === "BRL" && locale === "pt-BR") {
    return brl.format((cents ?? 0) / 100);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format((cents ?? 0) / 100);
}
