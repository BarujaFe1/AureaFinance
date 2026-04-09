const MOJIBAKE_HINT = /(Ã.|Â.|â€¦|â€™|â€œ|â€|�)/;

export function seemsMojibake(value: string) {
  return MOJIBAKE_HINT.test(value);
}

function latin1ToUtf8(value: string) {
  const bytes = Uint8Array.from(value, (char) => char.charCodeAt(0) & 0xff);
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export function repairMojibake(value: string) {
  if (!value || !seemsMojibake(value)) return value;
  try {
    const repaired = latin1ToUtf8(value);
    if (!repaired || repaired.includes("\u0000")) return value;
    const beforeScore = scoreMojibake(value);
    const afterScore = scoreMojibake(repaired);
    return afterScore <= beforeScore ? repaired : value;
  } catch {
    return value;
  }
}

function scoreMojibake(value: string) {
  return (value.match(MOJIBAKE_HINT) ?? []).length;
}

export function sanitizeText(value: unknown) {
  const text = typeof value === "string" ? value : value == null ? "" : String(value);
  return repairMojibake(text).trim();
}

export function sanitizeOptionalText(value: unknown) {
  const text = sanitizeText(value);
  return text.length > 0 ? text : "";
}

export function repairDeepText<T>(input: T): T {
  if (typeof input === "string") return repairMojibake(input) as T;
  if (Array.isArray(input)) return input.map((item) => repairDeepText(item)) as T;
  if (input && typeof input === "object") {
    return Object.fromEntries(Object.entries(input as Record<string, unknown>).map(([key, value]) => [key, repairDeepText(value)])) as T;
  }
  return input;
}

export function normalizeLooseText(value: unknown) {
  return sanitizeText(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
