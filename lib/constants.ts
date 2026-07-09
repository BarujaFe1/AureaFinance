export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Aurea Finance";
export const DB_PATH = process.env.DATABASE_URL ?? "./data/aurea-finance.sqlite";
export const DEFAULT_CURRENCY = "BRL";
export const INSTALLMENT_LABEL_PATTERN = /\((\d+)\/(\d+)\)/;

/** Hard limits for XLSX/CSV ingest (mitigates oversized uploads and xlsx CVE surface). */
export const MAX_IMPORT_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_IMPORT_SHEETS = 40;
export const MAX_IMPORT_ROWS_PER_SHEET = 10_000;
export const MAX_IMPORT_TOTAL_ROWS = 50_000;
