/**
 * Normalizers defensivos para BatchMeta e DryRunReport.
 *
 * Esses shapes são armazenados como JSON em SQLite e podem ter sido
 * gravados em formatos distintos por versões anteriores do sistema.
 * Em particular, o bootstrap Money gravava workbookSummaryJson como
 * array bruto e dryRunReportJson sem os campos summary/warnings.
 *
 * Todas as funções recebem `unknown` e sempre retornam shape seguro.
 * Nunca lançam exceção.
 */

// ── Tipos exportados ────────────────────────────────────────────────────────

export type NormalizedSheetMeta = {
  name: string;
  suggestedTarget: string;
  rowCount: number;
};

export type NormalizedBatchMeta = {
  sheets: NormalizedSheetMeta[];
};

export type NormalizedDryRunSummary = {
  accounts: number;
  transactions: number;
  creditCards: number;
  purchases: number;
  installments: number;
  issues: number;
};

export type NormalizedDryRunReport = {
  summary: NormalizedDryRunSummary;
  warnings: string[];
};

// ── Helpers internos ────────────────────────────────────────────────────────

function toNum(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function toStr(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function normalizeSheet(raw: unknown): NormalizedSheetMeta | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const name = toStr(s.name);
  if (!name) return null;
  return {
    name,
    // Aceita suggestedTarget (ingestWorkbook), detectedEntity (inventory)
    // ou ausente (sheetInventory legado do Money bootstrap)
    suggestedTarget:
      toStr(s.suggestedTarget) || toStr(s.detectedEntity) || "desconhecido",
    // Aceita rowCount (ingestWorkbook) ou rows (sheetInventory legado)
    rowCount: toNum(s.rowCount) || toNum(s.rows),
  };
}

// ── API pública ─────────────────────────────────────────────────────────────

/**
 * Normaliza o valor já parseado de workbookSummaryJson.
 *
 * Suporta:
 *   - formato canônico : { sheets: [...] }
 *   - formato legado   : array bruto [...] (bootstrap Money antigo)
 *   - qualquer outro   : retorna { sheets: [] }
 */
export function normalizeBatchMeta(parsed: unknown): NormalizedBatchMeta {
  if (!parsed) return { sheets: [] };

  // Formato canônico: { sheets: [...] }
  if (
    typeof parsed === "object" &&
    !Array.isArray(parsed) &&
    "sheets" in (parsed as object)
  ) {
    const candidate = parsed as { sheets: unknown };
    if (Array.isArray(candidate.sheets)) {
      const sheets = candidate.sheets
        .map(normalizeSheet)
        .filter((s): s is NormalizedSheetMeta => s !== null);
      return { sheets };
    }
    return { sheets: [] };
  }

  // Formato legado: array bruto de sheetInventory
  if (Array.isArray(parsed)) {
    const sheets = parsed
      .map(normalizeSheet)
      .filter((s): s is NormalizedSheetMeta => s !== null);
    return { sheets };
  }

  return { sheets: [] };
}

/**
 * Normaliza o valor já parseado de dryRunReportJson.
 *
 * Retorna null se o shape não corresponder ao DryRunReport real —
 * por exemplo, o formato Money legado usa { recognizedSource, ... }
 * sem summary nem warnings.
 *
 * Retorna NormalizedDryRunReport para qualquer objeto com summary presente.
 */
export function normalizeDryRunReport(
  parsed: unknown
): NormalizedDryRunReport | null {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return null;
  }

  const r = parsed as Record<string, unknown>;

  // Formato legado Money: não tem summary — retorna null para UI exibir fallback
  if (!r.summary || typeof r.summary !== "object") return null;

  const s = r.summary as Record<string, unknown>;

  return {
    summary: {
      accounts: toNum(s.accounts),
      transactions: toNum(s.transactions),
      creditCards: toNum(s.creditCards),
      purchases: toNum(s.purchases),
      installments: toNum(s.installments),
      issues: toNum(s.issues),
    },
    warnings: Array.isArray(r.warnings)
      ? (r.warnings as unknown[]).filter(
          (w): w is string => typeof w === "string"
        )
      : [],
  };
}
