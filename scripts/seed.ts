import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, categories, creditCardBills, creditCards, cryptoPositions, netWorthSnapshots, recurringRules, reserves, settings, stockPositions, tags } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";

const now = nowTs();

function ensureMainSettings() {
  if (!db.select().from(settings).where(eq(settings.id, "main")).get()) {
    db.insert(settings).values({
      id: "main",
      baseCurrency: "BRL",
      themePreference: "dark",
      userDisplayName: "Você",
      isOnboarded: false,
      createdAt: now,
      updatedAt: now
    }).run();
  }
}

function ensureCategories() {
  for (const [name, kind, color] of [
    ["Salário", "income", "#2f855a"],
    ["Freelance", "income", "#22543d"],
    ["Moradia", "expense", "#7c83ff"],
    ["Alimentação", "expense", "#6366f1"],
    ["Transporte", "expense", "#4f46e5"],
    ["Assinaturas", "expense", "#71717a"],
    ["Investimentos", "neutral", "#0f766e"]
  ] as const) {
    const slug = slugify(name);
    if (!db.select().from(categories).where(eq(categories.slug, slug)).get()) {
      db.insert(categories).values({ id: uid("cat"), name, slug, kind, color, icon: "circle", createdAt: now, updatedAt: now }).run();
    }
  }
  for (const name of ["fixo", "essencial", "investimento", "familia"]) {
    const slug = slugify(name);
    if (!db.select().from(tags).where(eq(tags.slug, slug)).get()) {
      db.insert(tags).values({ id: uid("tag"), name, slug, color: "#71717a", createdAt: now }).run();
    }
  }
}

function ensureAccount(name: string, institution: string, color: string) {
  const slug = slugify(name);
  const existing = db.select().from(accounts).where(eq(accounts.slug, slug)).get();
  if (existing) return existing;
  const id = uid("acc");
  db.insert(accounts).values({
    id,
    name,
    slug,
    type: "checking",
    institution,
    openingBalanceCents: 0,
    color,
    notes: "Conta seeded para liquidação e projeções iniciais.",
    includeInNetWorth: true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(accounts).where(eq(accounts.id, id)).get()!;
}

function ensureCard(definition: { name: string; slug: string; color: string; closeDay: number; dueDay: number; settlementAccountName: string; institution: string }) {
  const existing = db.select().from(creditCards).where(eq(creditCards.slug, definition.slug)).get();
  if (existing) return existing;
  const settlement = ensureAccount(definition.settlementAccountName, definition.institution, definition.color);
  const id = uid("card");
  db.insert(creditCards).values({
    id,
    name: definition.name,
    slug: definition.slug,
    brand: definition.name,
    network: definition.name,
    settlementAccountId: settlement.id,
    limitTotalCents: 0,
    closeDay: definition.closeDay,
    dueDay: definition.dueDay,
    color: definition.color,
    isArchived: false,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCards).where(eq(creditCards.id, id)).get()!;
}

function ensureBill(cardId: string, dueOn: string, amount: string) {
  const month = dueOn.slice(0, 7);
  const existing = db.select().from(creditCardBills).all().find((row) => row.creditCardId === cardId && row.dueOn === dueOn);
  if (existing) return;
  db.insert(creditCardBills).values({
    id: uid("bill"),
    creditCardId: cardId,
    billMonth: month,
    closesOn: `${month}-${String(month === "2026-03" ? 18 : 18).padStart(2, "0")}`,
    dueOn,
    totalAmountCents: parseCurrencyToCents(amount),
    paidAmountCents: 0,
    status: "open",
    createdAt: now,
    updatedAt: now
  }).run();
}


function ensureAccountSnapshot(accountId: string, snapshotDate: string, amount: string, source = "seed") {
  const existing = db.select().from(accountBalanceSnapshots).all().find((row) => row.accountId === accountId && row.snapshotDate === snapshotDate);
  if (existing) return;
  db.insert(accountBalanceSnapshots).values({
    id: uid("snap"),
    accountId,
    snapshotDate,
    balanceCents: parseCurrencyToCents(amount),
    source,
    createdAt: now
  }).run();
}

function ensureReserve(name: string, amount: string) {
  const existing = db.select().from(reserves).all().find((row) => row.name === name);
  if (existing) return existing;
  const id = uid("res");
  db.insert(reserves).values({
    id,
    name,
    investedCents: parseCurrencyToCents(amount),
    previousValueCents: parseCurrencyToCents(amount),
    currentValueCents: parseCurrencyToCents(amount),
    totalProfitCents: 0,
    monthlyProfitCents: 0,
    accountId: null,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(reserves).where(eq(reserves.id, id)).get()!;
}

function ensureStock(ticker: string, fullName: string, quantity: number, amount: string) {
  const existing = db.select().from(stockPositions).all().find((row) => row.ticker === ticker);
  if (existing) return existing;
  const id = uid("stk");
  db.insert(stockPositions).values({
    id,
    ticker,
    fullName,
    quantity,
    investedCents: parseCurrencyToCents(amount),
    previousCents: parseCurrencyToCents(amount),
    currentCents: parseCurrencyToCents(amount),
    resultTotalCents: 0,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(stockPositions).where(eq(stockPositions.id, id)).get()!;
}

function ensureCrypto(name: string, quantity: number, amount: string) {
  const existing = db.select().from(cryptoPositions).all().find((row) => row.name === name);
  if (existing) return existing;
  const id = uid("cry");
  db.insert(cryptoPositions).values({
    id,
    name,
    quantity,
    investedCents: parseCurrencyToCents(amount),
    previousCents: parseCurrencyToCents(amount),
    currentCents: parseCurrencyToCents(amount),
    totalProfitCents: 0,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(cryptoPositions).where(eq(cryptoPositions.id, id)).get()!;
}

function ensureDailyNetWorthSnapshot(date: string, totalCents: number) {
  const existing = db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.date, date)).get();
  if (existing) return;
  db.insert(netWorthSnapshots).values({
    id: uid("nws"),
    date,
    accountBalanceCents: 250_000,
    investment1Cents: 300_000,
    investment2Cents: totalCents - 550_000,
    totalCents,
    variationType: "seed",
    createdAt: now
  }).run();
}

function ensureRecurring(title: string, accountId: string, amount: string, nextRunOn: string, direction: "income" | "expense", notes = "") {
  const exists = db.select().from(recurringRules).all().find((row) => row.title === title);
  if (exists) return;
  db.insert(recurringRules).values({
    id: uid("rr"),
    accountId,
    categoryId: null,
    title,
    direction,
    frequency: "monthly",
    amountCents: parseCurrencyToCents(amount),
    startsOn: nextRunOn,
    endsOn: null,
    nextRunOn,
    autoPost: false,
    notes,
    isActive: true,
    createdAt: now,
    updatedAt: now
  }).run();
}

ensureMainSettings();
ensureCategories();

const mercadoPagoCc = ensureAccount("MercadoPago CC", "MercadoPago", "#00bbfe");
const nuBankCc = ensureAccount("NuBank CC", "NuBank", "#9900ff");

const nubankCard = ensureCard({ name: "Nubank", slug: "nubank", color: "#9900ff", closeDay: 18, dueDay: 25, settlementAccountName: "NuBank CC", institution: "NuBank" });
const mercadoPagoCard = ensureCard({ name: "MercadoPago", slug: "mercadopago", color: "#00bbfe", closeDay: 8, dueDay: 15, settlementAccountName: "MercadoPago CC", institution: "MercadoPago" });

for (const [dueOn, amount] of [
  ["2026-03-25", "990,33"],
  ["2026-04-25", "672,23"],
  ["2026-05-25", "672,23"],
  ["2026-06-25", "680,70"],
  ["2026-07-25", "566,25"],
  ["2026-08-25", "566,25"],
  ["2026-09-25", "416,35"],
  ["2026-10-25", "256,35"],
  ["2026-11-25", "256,35"],
  ["2026-12-25", "256,35"],
  ["2027-01-25", "256,35"],
  ["2027-02-25", "0,00"],
  ["2027-03-25", "0,00"]
] as const) ensureBill(nubankCard.id, dueOn, amount);

for (const [dueOn, amount] of [
  ["2026-04-15", "193,11"],
  ["2026-05-15", "138,76"],
  ["2026-06-15", "138,76"],
  ["2026-07-15", "138,76"],
  ["2026-08-15", "138,76"],
  ["2026-09-15", "100,12"],
  ["2026-10-15", "100,12"],
  ["2026-11-15", "100,12"],
  ["2026-12-15", "61,48"],
  ["2027-01-15", "61,48"],
  ["2027-02-15", "61,48"],
  ["2027-03-15", "33,48"],
  ["2027-04-15", "33,48"],
  ["2027-05-15", "33,48"],
  ["2027-06-15", "0,00"]
] as const) ensureBill(mercadoPagoCard.id, dueOn, amount);

function firstBusinessDayAfter12() {
  const date = new Date();
  date.setDate(13);
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

ensureRecurring("Mesada Olga", mercadoPagoCc.id, "1000,00", firstBusinessDayAfter12(), "income", "FIRST_BUSINESS_DAY_AFTER_12");
ensureRecurring("Internet/GloboPlay", mercadoPagoCc.id, "79,89", `${new Date().toISOString().slice(0, 7)}-21`, "expense");
ensureRecurring("SmartFit", nuBankCc.id, "149,90", `${new Date().toISOString().slice(0, 7)}-25`, "expense", "CARD_RECURRING");

ensureAccountSnapshot(mercadoPagoCc.id, new Date().toISOString().slice(0, 10), "1984,21");
ensureAccountSnapshot(nuBankCc.id, new Date().toISOString().slice(0, 10), "0,00");
ensureReserve("Reserva de emergência", "3806,69");
ensureReserve("Notebook", "695,93");
ensureStock("MELI34", "Mercado Livre", 1, "141,68");
ensureStock("BABA34", "Alibaba", 1, "118,00");
ensureCrypto("Bitcoin", 0.00032967, "239,71");
ensureCrypto("Ethereum", 0.02030612, "232,36");
ensureDailyNetWorthSnapshot(new Date().toISOString().slice(0, 10), parseCurrencyToCents("12856,52"));

console.log("Seed concluída.");
