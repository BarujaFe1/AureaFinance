import { db } from "@/db/client";
import {
  accounts,
  categories,
  creditCardBills,
  creditCards,
  netWorthSummaries,
  settings,
  tags,
  transactions
} from "@/db/schema";
import { nowTs, isoMonth } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { eq } from "drizzle-orm";

const now = nowTs();

function ensureSettings() {
  if (db.select().from(settings).where(eq(settings.id, "main")).get()) return;
  db.insert(settings)
    .values({
      id: "main",
      baseCurrency: "BRL",
      themePreference: "system",
      userDisplayName: "Você",
      isOnboarded: false,
      createdAt: now,
      updatedAt: now
    })
    .run();
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
    if (db.select().from(categories).where(eq(categories.slug, slug)).get()) continue;
    db.insert(categories)
      .values({
        id: uid("cat"),
        name,
        slug,
        kind,
        color,
        icon: "circle",
        createdAt: now,
        updatedAt: now
      })
      .run();
  }
}

function ensureTags() {
  for (const name of ["fixo", "essencial", "investimento", "familia"]) {
    const slug = slugify(name);
    if (db.select().from(tags).where(eq(tags.slug, slug)).get()) continue;
    db.insert(tags)
      .values({
        id: uid("tag"),
        name,
        slug,
        color: "#71717a",
        createdAt: now
      })
      .run();
  }
}

function ensurePrimaryAccount() {
  const existing = db.select().from(accounts).where(eq(accounts.slug, "banco-principal")).get();
  if (existing) return existing;

  const id = uid("acc");
  db.insert(accounts)
    .values({
      id,
      name: "Banco Principal",
      slug: "banco-principal",
      type: "checking",
      institution: "Conta local",
      openingBalanceCents: 250_000,
      color: "#111827",
      notes: "Conta seeded para testes.",
      includeInNetWorth: true,
      isArchived: false,
      sortOrder: 1,
      createdAt: now,
      updatedAt: now
    })
    .run();

  return db.select().from(accounts).where(eq(accounts.id, id)).get()!;
}

function ensureSampleTransactions(accountId: string) {
  const existing = db.select().from(transactions).all();
  if (existing.length > 0) return;

  const salaryDate = new Date().toISOString().slice(0, 10);
  const rentDate = new Date(new Date().setDate(5)).toISOString().slice(0, 10);

  db.insert(transactions)
    .values([
      {
        id: uid("txn"),
        accountId,
        categoryId: null,
        subcategoryId: null,
        direction: "income",
        status: "posted",
        description: "Salário",
        counterparty: "Empresa",
        amountCents: 650_000,
        occurredOn: salaryDate,
        dueOn: salaryDate,
        competenceMonth: isoMonth(salaryDate),
        notes: "Seed",
        isProjected: false,
        createdAt: now,
        updatedAt: now
      },
      {
        id: uid("txn"),
        accountId,
        categoryId: null,
        subcategoryId: null,
        direction: "expense",
        status: "posted",
        description: "Aluguel",
        counterparty: "Imobiliária",
        amountCents: 180_000,
        occurredOn: rentDate,
        dueOn: rentDate,
        competenceMonth: isoMonth(rentDate),
        notes: "Seed",
        isProjected: false,
        createdAt: now,
        updatedAt: now
      }
    ])
    .run();
}

function ensureSampleCard(accountId: string) {
  const existing = db.select().from(creditCards).where(eq(creditCards.slug, "cartao-principal")).get();
  if (existing) return;

  const cardId = uid("card");
  const billId = uid("bill");
  const billMonth = new Date().toISOString().slice(0, 7);
  const dueOn = `${billMonth}-28`;
  const closesOn = `${billMonth}-20`;

  db.insert(creditCards)
    .values({
      id: cardId,
      name: "Cartão Principal",
      slug: "cartao-principal",
      brand: "Mastercard",
      network: "Gold",
      settlementAccountId: accountId,
      limitTotalCents: 500_000,
      closeDay: 20,
      dueDay: 28,
      color: "#111827",
      isArchived: false,
      createdAt: now,
      updatedAt: now
    })
    .run();

  db.insert(creditCardBills)
    .values({
      id: billId,
      creditCardId: cardId,
      billMonth,
      closesOn,
      dueOn,
      totalAmountCents: 120_000,
      paidAmountCents: 0,
      status: "open",
      settlementTransactionId: null,
      createdAt: now,
      updatedAt: now
    })
    .run();
}

function ensureNetWorthSnapshot() {
  const month = new Date().toISOString().slice(0, 7);
  if (db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, month)).get()) return;

  db.insert(netWorthSummaries)
    .values({
      id: uid("nw"),
      month,
      reservesCents: 300_000,
      investmentsCents: 850_000,
      debtsCents: 50_000,
      notes: "Snapshot inicial seeded.",
      source: "manual",
      createdAt: now,
      updatedAt: now
    })
    .run();
}

ensureSettings();
ensureCategories();
ensureTags();
const account = ensurePrimaryAccount();
ensureSampleTransactions(account.id);
ensureSampleCard(account.id);
ensureNetWorthSnapshot();

console.log("Seed concluída com nomenclatura atualizada: occurredOn, dueOn, month e billMonth.");
