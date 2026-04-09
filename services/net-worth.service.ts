import { desc, eq } from "drizzle-orm";
import { db, tableExists } from "@/db/client";
import { accounts, assetValueSnapshots, cryptoPositions, netWorthSnapshots, netWorthSummaries, reserves, stockPositions, transactions } from "@/db/schema";
import { archiveEntity, listArchivedEntityIds, restoreEntity } from "@/services/archive.service";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs, todayIso } from "@/lib/dates";
import { calculateBalance, toBalanceTransactions } from "@/lib/finance";
import { uid } from "@/lib/utils";

export type NetWorthSummary = {
  month: string | null;
  realizedLiquidCents: number;
  manualReservesCents: number;
  manualInvestmentsCents: number;
  manualDebtsCents: number;
  totalNetWorthCents: number;
};

export type AssetKind = "reserve" | "stock" | "crypto";

export type UnifiedAssetPosition = {
  assetType: AssetKind;
  assetId: string;
  label: string;
  fullName?: string;
  ticker?: string;
  quantity: number;
  investedCents: number;
  currentValueCents: number;
  previousValueCents: number;
  isArchived?: boolean;
  notes?: string;
};

function assetSnapshotsEnabled() {
  return tableExists("asset_value_snapshots");
}

function getLiquidAccountBalanceCents() {
  const includedAccounts = db.select().from(accounts).where(eq(accounts.includeInNetWorth, true)).all();
  return includedAccounts
    .filter((account) => ["checking", "savings", "cash"].includes(account.type))
    .reduce((sum, account) => {
      const related = db.select().from(transactions).where(eq(transactions.accountId, account.id)).all();
      return sum + calculateBalance(account.openingBalanceCents, toBalanceTransactions(related));
    }, 0);
}

function getLatestNetWorthSummaryRow() {
  return db.select().from(netWorthSummaries).all().sort((a, b) => b.month.localeCompare(a.month))[0] ?? null;
}

function getImportedReserveCents() {
  return listAssetPositions().filter((row) => row.assetType === "reserve" && !row.isArchived).reduce((sum, item) => sum + item.currentValueCents, 0);
}

function getImportedInvestmentCents() {
  return listAssetPositions().filter((row) => row.assetType !== "reserve" && !row.isArchived).reduce((sum, item) => sum + item.currentValueCents, 0);
}

function getAssetLabel(assetType: AssetKind, row: { name?: string; ticker?: string; fullName?: string }) {
  if (assetType === "stock") {
    return row.ticker && row.fullName ? `${row.ticker} · ${row.fullName}` : row.ticker ?? row.fullName ?? "Ativo";
  }
  return row.name ?? row.fullName ?? row.ticker ?? "Ativo";
}

function saveAssetSnapshot(values: { assetType: AssetKind; assetId: string; assetLabel: string; snapshotDate: string; quantity?: number; valueCents: number; notes?: string }) {
  if (!assetSnapshotsEnabled()) return null;
  const now = nowTs();
  const existing = db
    .select()
    .from(assetValueSnapshots)
    .all()
    .find((row) => row.assetType === values.assetType && row.assetId === values.assetId && row.snapshotDate === values.snapshotDate);

  if (existing) {
    db.update(assetValueSnapshots)
      .set({
        assetLabel: values.assetLabel,
        quantity: values.quantity ?? null,
        valueCents: values.valueCents,
        notes: values.notes ?? existing.notes,
        updatedAt: now
      })
      .where(eq(assetValueSnapshots.id, existing.id))
      .run();
    return existing.id;
  }

  const id = uid("avs");
  db.insert(assetValueSnapshots).values({
    id,
    assetType: values.assetType,
    assetId: values.assetId,
    assetLabel: values.assetLabel,
    snapshotDate: values.snapshotDate,
    quantity: values.quantity ?? null,
    valueCents: values.valueCents,
    notes: values.notes ?? "",
    createdAt: now,
    updatedAt: now
  }).run();
  return id;
}

export function getCurrentNetWorthSummary(): NetWorthSummary {
  const realizedLiquidCents = getLiquidAccountBalanceCents();
  const latest = getLatestNetWorthSummaryRow();
  const positions = listAssetPositions();
  const importedReserveCents = positions.filter((row) => row.assetType === "reserve" && !row.isArchived).reduce((sum, item) => sum + item.currentValueCents, 0);
  const importedInvestmentCents = positions.filter((row) => row.assetType !== "reserve" && !row.isArchived).reduce((sum, item) => sum + item.currentValueCents, 0);
  const manualReservesCents = importedReserveCents > 0 ? importedReserveCents : latest?.reservesCents ?? 0;
  const manualInvestmentsCents = importedInvestmentCents > 0 ? importedInvestmentCents : latest?.investmentsCents ?? 0;
  const manualDebtsCents = latest?.debtsCents ?? 0;

  return {
    month: latest?.month ?? null,
    realizedLiquidCents,
    manualReservesCents,
    manualInvestmentsCents,
    manualDebtsCents,
    totalNetWorthCents: realizedLiquidCents + manualReservesCents + manualInvestmentsCents - manualDebtsCents
  };
}

export function listNetWorthSummaries() {
  return db.select().from(netWorthSummaries).all().sort((a, b) => b.month.localeCompare(a.month));
}

export function listAssetPositions(includeArchived = false): UnifiedAssetPosition[] {
  const archivedReserves = new Set(listArchivedEntityIds("reserve"));
  const archivedStocks = new Set(listArchivedEntityIds("stock"));
  const archivedCryptos = new Set(listArchivedEntityIds("crypto"));

  const reserveRows = db.select().from(reserves).all().map((item) => ({
    assetType: "reserve" as const,
    assetId: item.id,
    label: getAssetLabel("reserve", item),
    fullName: item.name,
    quantity: 1,
    investedCents: item.investedCents,
    previousValueCents: item.previousValueCents,
    currentValueCents: item.currentValueCents,
    isArchived: archivedReserves.has(item.id)
  }));

  const stockRows = db.select().from(stockPositions).all().map((item) => ({
    assetType: "stock" as const,
    assetId: item.id,
    label: getAssetLabel("stock", item),
    fullName: item.fullName,
    ticker: item.ticker,
    quantity: item.quantity,
    investedCents: item.investedCents,
    previousValueCents: item.previousCents,
    currentValueCents: item.currentCents,
    isArchived: archivedStocks.has(item.id)
  }));

  const cryptoRows = db.select().from(cryptoPositions).all().map((item) => ({
    assetType: "crypto" as const,
    assetId: item.id,
    label: getAssetLabel("crypto", item),
    fullName: item.name,
    quantity: item.quantity,
    investedCents: item.investedCents,
    previousValueCents: item.previousCents,
    currentValueCents: item.currentCents,
    isArchived: archivedCryptos.has(item.id)
  }));

  const rows = [...reserveRows, ...stockRows, ...cryptoRows].sort((a, b) => a.label.localeCompare(b.label));
  return includeArchived ? rows : rows.filter((row) => !row.isArchived);
}

export function listAssetValueSnapshots(limit = 90) {
  if (!assetSnapshotsEnabled()) return [];
  return db
    .select()
    .from(assetValueSnapshots)
    .orderBy(desc(assetValueSnapshots.snapshotDate), desc(assetValueSnapshots.updatedAt))
    .all()
    .slice(0, limit);
}

export function deleteAssetSnapshot(snapshotId: string) {
  if (!assetSnapshotsEnabled()) return;
  db.delete(assetValueSnapshots).where(eq(assetValueSnapshots.id, snapshotId)).run();
}

function toNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;
  return Number(String(value ?? "0").replace(",", "."));
}

export function upsertAssetPosition(values: {
  assetType: AssetKind;
  assetId?: string;
  label: string;
  fullName?: string;
  quantity?: string | number;
  invested?: string | number;
  currentValue: string | number;
  snapshotDate?: string;
  notes?: string;
}) {
  const now = nowTs();
  const quantity = toNumber(values.quantity);
  const hasExplicitQuantity = values.quantity !== undefined && String(values.quantity).trim() !== "";
  const hasExplicitInvested = values.invested !== undefined && String(values.invested).trim() !== "";
  const investedCents = parseCurrencyToCents(values.invested ?? 0);
  const currentValueCents = parseCurrencyToCents(values.currentValue);
  const snapshotDate = values.snapshotDate ?? todayIso();

  if (values.assetType === "reserve") {
    const reserve = values.assetId
      ? db.select().from(reserves).where(eq(reserves.id, values.assetId)).get()
      : db.select().from(reserves).all().find((row) => row.name.toLowerCase() === values.label.toLowerCase());
    const id = reserve?.id ?? uid("res");
    const payload = {
      name: values.label,
      investedCents: hasExplicitInvested ? investedCents : (reserve?.investedCents ?? 0),
      previousValueCents: reserve?.currentValueCents ?? currentValueCents,
      currentValueCents,
      totalProfitCents: currentValueCents - (hasExplicitInvested ? investedCents : (reserve?.investedCents ?? 0)),
      monthlyProfitCents: currentValueCents - (reserve?.currentValueCents ?? currentValueCents),
      accountId: reserve?.accountId ?? null,
      updatedAt: now
    };
    if (reserve) db.update(reserves).set(payload).where(eq(reserves.id, reserve.id)).run();
    else db.insert(reserves).values({ id, ...payload, createdAt: now }).run();
    saveAssetSnapshot({ assetType: "reserve", assetId: id, assetLabel: values.label, snapshotDate, quantity: 1, valueCents: currentValueCents, notes: values.notes });
    return id;
  }

  if (values.assetType === "stock") {
    const ticker = values.label.trim().toUpperCase();
    const existing = values.assetId
      ? db.select().from(stockPositions).where(eq(stockPositions.id, values.assetId)).get()
      : db.select().from(stockPositions).all().find((row) => row.ticker.toUpperCase() === ticker);
    const id = existing?.id ?? uid("stk");
    const payload = {
      ticker,
      fullName: values.fullName?.trim() || existing?.fullName || ticker,
      quantity: hasExplicitQuantity && Number.isFinite(quantity) ? Math.round(quantity) : (existing?.quantity ?? 0),
      investedCents: hasExplicitInvested ? investedCents : (existing?.investedCents ?? 0),
      previousCents: existing?.currentCents ?? currentValueCents,
      currentCents: currentValueCents,
      resultTotalCents: currentValueCents - (hasExplicitInvested ? investedCents : (existing?.investedCents ?? 0)),
      updatedAt: now
    };
    if (existing) db.update(stockPositions).set(payload).where(eq(stockPositions.id, existing.id)).run();
    else db.insert(stockPositions).values({ id, ...payload, createdAt: now }).run();
    saveAssetSnapshot({ assetType: "stock", assetId: id, assetLabel: getAssetLabel("stock", { ticker, fullName: payload.fullName }), snapshotDate, quantity: payload.quantity, valueCents: currentValueCents, notes: values.notes });
    return id;
  }

  const name = values.label.trim();
  const crypto = values.assetId
    ? db.select().from(cryptoPositions).where(eq(cryptoPositions.id, values.assetId)).get()
    : db.select().from(cryptoPositions).all().find((row) => row.name.toLowerCase() === name.toLowerCase());
  const id = crypto?.id ?? uid("cry");
  const payload = {
    name,
    quantity: hasExplicitQuantity && Number.isFinite(quantity) ? quantity : (crypto?.quantity ?? 0),
    investedCents: hasExplicitInvested ? investedCents : (crypto?.investedCents ?? 0),
    previousCents: crypto?.currentCents ?? currentValueCents,
    currentCents: currentValueCents,
    totalProfitCents: currentValueCents - (hasExplicitInvested ? investedCents : (crypto?.investedCents ?? 0)),
    updatedAt: now
  };
  if (crypto) db.update(cryptoPositions).set(payload).where(eq(cryptoPositions.id, crypto.id)).run();
  else db.insert(cryptoPositions).values({ id, ...payload, createdAt: now }).run();
  saveAssetSnapshot({ assetType: "crypto", assetId: id, assetLabel: name, snapshotDate, quantity: payload.quantity, valueCents: currentValueCents, notes: values.notes });
  return id;
}

export function archiveAsset(assetType: AssetKind, assetId: string) {
  archiveEntity(assetType, assetId, "Arquivado pela UI");
}

export function restoreAsset(assetType: AssetKind, assetId: string) {
  restoreEntity(assetType, assetId);
}

export function deleteAsset(assetType: AssetKind, assetId: string) {
  if (assetSnapshotsEnabled()) {
    for (const snapshot of db.select().from(assetValueSnapshots).all().filter((row) => row.assetType === assetType && row.assetId === assetId)) {
      db.delete(assetValueSnapshots).where(eq(assetValueSnapshots.id, snapshot.id)).run();
    }
  }
  if (assetType === "reserve") db.delete(reserves).where(eq(reserves.id, assetId)).run();
  if (assetType === "stock") db.delete(stockPositions).where(eq(stockPositions.id, assetId)).run();
  if (assetType === "crypto") db.delete(cryptoPositions).where(eq(cryptoPositions.id, assetId)).run();
}

export function upsertNetWorthSummary(values: { month: string; reserves: string; investments: string; debts: string; notes?: string }) {
  const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, values.month)).get();
  const now = nowTs();
  const payload = {
    month: values.month,
    reservesCents: parseCurrencyToCents(values.reserves),
    investmentsCents: parseCurrencyToCents(values.investments),
    debtsCents: parseCurrencyToCents(values.debts),
    notes: values.notes ?? "",
    source: "manual",
    updatedAt: now
  };

  if (existing) {
    db.update(netWorthSummaries).set(payload).where(eq(netWorthSummaries.id, existing.id)).run();
    return existing.id;
  }

  const id = uid("nw");
  db.insert(netWorthSummaries).values({ id, ...payload, createdAt: now }).run();
  return id;
}

export function recordDailyNetWorthSnapshot(date = todayIso()) {
  const summary = getCurrentNetWorthSummary();
  const existing = db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.date, date)).get();
  const now = nowTs();
  const payload = {
    accountBalanceCents: summary.realizedLiquidCents,
    investment1Cents: summary.manualReservesCents,
    investment2Cents: summary.manualInvestmentsCents,
    totalCents: summary.totalNetWorthCents,
    variationType: "manual_review"
  };

  if (existing) {
    db.update(netWorthSnapshots).set(payload).where(eq(netWorthSnapshots.id, existing.id)).run();
    return existing.id;
  }

  const id = uid("nws");
  db.insert(netWorthSnapshots).values({ id, date, ...payload, createdAt: now }).run();
  return id;
}

export function getDailyNetWorthSnapshot(date = todayIso()) {
  return db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.date, date)).get() ?? null;
}
