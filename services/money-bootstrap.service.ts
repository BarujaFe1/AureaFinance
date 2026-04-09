import { eq } from "drizzle-orm";
import { db, sqlite } from "@/db/client";
import {
  accountBalanceSnapshots,
  accounts,
  assetTrades,
  billEntries,
  cardInstallments,
  creditCardBills,
  creditCards,
  cryptoPositions,
  importBatches,
  netWorthSummaries,
  recurringOccurrences,
  recurringRules,
  reserves,
  settings,
  stockPositions
} from "@/db/schema";
import { moneyBootstrapDataset } from "@/lib/money-bootstrap";
import { materializeOccurrences } from "@/lib/finance";
import { nowTs } from "@/lib/dates";
import { slugify, toJson, uid } from "@/lib/utils";
import { ensureSettings } from "@/services/settings.service";
import { repairDeepText } from "@/lib/text";

export type MoneyBootstrapResult = {
  accountsCreated: number;
  cardsCreated: number;
  billsCreated: number;
  recurringCreated: number;
  reservesUpserted: number;
  stocksUpserted: number;
  cryptosUpserted: number;
  tradesUpserted: number;
  netWorthUpdated: boolean;
  importBatchCreated: boolean;
};

function findAccountByName(name: string) {
  return db
    .select()
    .from(accounts)
    .all()
    .find((account) => account.name === name || account.slug === slugify(name));
}

function findCardBySlug(slug: string) {
  return db.select().from(creditCards).all().find((card) => card.slug === slug);
}

function ensureMoneyBatch(now: number) {
  const existing = db.select().from(importBatches).all().find((batch) => batch.filename === "Money.xlsx");
  if (existing) {
    db
      .update(importBatches)
      .set({
        status: "committed",
        workbookSummaryJson: toJson({ sheets: moneyBootstrapDataset.sheetInventory }),
        dryRunReportJson: toJson({
          recognizedSource: "money",
          detectedSheets: moneyBootstrapDataset.sheetInventory.length,
          importedAccounts: moneyBootstrapDataset.accounts.length,
          importedCards: moneyBootstrapDataset.cards.length,
          importedBills: moneyBootstrapDataset.cardBills.length,
          importedRecurring: moneyBootstrapDataset.recurring.length
        }),
        updatedAt: now
      })
      .where(eq(importBatches.id, existing.id))
      .run();

    return { created: false, id: existing.id };
  }

  const id = uid("batch");
  db
    .insert(importBatches)
    .values({
      id,
      filename: "Money.xlsx",
      status: "committed",
      workbookSummaryJson: toJson({ sheets: moneyBootstrapDataset.sheetInventory }),
      dryRunReportJson: toJson({
        recognizedSource: "money",
        detectedSheets: moneyBootstrapDataset.sheetInventory.length,
        importedAccounts: moneyBootstrapDataset.accounts.length,
        importedCards: moneyBootstrapDataset.cards.length,
        importedBills: moneyBootstrapDataset.cardBills.length,
        importedRecurring: moneyBootstrapDataset.recurring.length
      }),
      createdAt: now,
      updatedAt: now
    })
    .run();

  return { created: true, id };
}

export function getMoneyBootstrapDataset() {
  return repairDeepText(moneyBootstrapDataset);
}

export function getMoneyOnboardingDefaults() {
  const currentSettings = ensureSettings();

  return {
    source: "money" as const,
    initialSettings: {
      userDisplayName: currentSettings.userDisplayName === "Você" ? "Felipe" : currentSettings.userDisplayName,
      baseCurrency: currentSettings.baseCurrency || getMoneyBootstrapDataset().currency,
      locale: currentSettings.locale || getMoneyBootstrapDataset().locale,
      themePreference: currentSettings.themePreference || "system",
      projectionMonths: currentSettings.projectionMonths || 6
    },
    dataset: getMoneyBootstrapDataset()
  };
}

export function bootstrapMoneyIntoDatabase(): MoneyBootstrapResult {
  const tx = sqlite.transaction(() => {
    ensureSettings();
    const now = nowTs();

    db
      .update(settings)
      .set({
        baseCurrency: moneyBootstrapDataset.currency,
        locale: moneyBootstrapDataset.locale,
        projectionMonths: 6,
        isOnboarded: true,
        updatedAt: now
      })
      .where(eq(settings.id, "main"))
      .run();

    let accountsCreated = 0;
    let cardsCreated = 0;
    let billsCreated = 0;
    let recurringCreated = 0;
    let reservesUpserted = 0;
    let stocksUpserted = 0;
    let cryptosUpserted = 0;
    let tradesUpserted = 0;

    for (const seed of moneyBootstrapDataset.accounts) {
      const slug = slugify(seed.name);
      const existing = db.select().from(accounts).all().find((account) => account.slug === slug);
      if (existing) {
        db
          .update(accounts)
          .set({
            institution: seed.institution,
            type: seed.type,
            includeInNetWorth: seed.includeInNetWorth,
            notes: seed.notes,
            updatedAt: now
          })
          .where(eq(accounts.id, existing.id))
          .run();

        const snapshot = db
          .select()
          .from(accountBalanceSnapshots)
          .all()
          .find((row) => row.accountId === existing.id && row.source === "money_bootstrap");
        if (snapshot) {
          db
            .update(accountBalanceSnapshots)
            .set({
              balanceCents: seed.openingBalanceCents
            })
            .where(eq(accountBalanceSnapshots.id, snapshot.id))
            .run();
        } else {
          db
            .insert(accountBalanceSnapshots)
            .values({
              id: uid("snap"),
              accountId: existing.id,
              snapshotDate: moneyBootstrapDataset.generatedAt,
              balanceCents: seed.openingBalanceCents,
              source: "money_bootstrap",
              createdAt: now
            })
            .run();
        }
        continue;
      }

      const accountId = uid("acc");
      db
        .insert(accounts)
        .values({
          id: accountId,
          name: seed.name,
          slug,
          type: seed.type,
          institution: seed.institution,
          openingBalanceCents: seed.openingBalanceCents,
          color: "#5b7cfa",
          notes: seed.notes,
          includeInNetWorth: seed.includeInNetWorth,
          isArchived: false,
          sortOrder: now + accountsCreated,
          createdAt: now,
          updatedAt: now
        })
        .run();

      db
        .insert(accountBalanceSnapshots)
        .values({
          id: uid("snap"),
          accountId,
          snapshotDate: moneyBootstrapDataset.generatedAt,
          balanceCents: seed.openingBalanceCents,
          source: "money_bootstrap",
          createdAt: now
        })
        .run();

      accountsCreated += 1;
    }

    for (const seed of moneyBootstrapDataset.cards) {
      const slug = slugify(seed.name);
      const settlementAccount = findAccountByName(seed.settlementAccountName);
      if (!settlementAccount) continue;
      const existing = findCardBySlug(slug);

      if (existing) {
        db
          .update(creditCards)
          .set({
            brand: seed.brand,
            network: seed.network,
            settlementAccountId: settlementAccount.id,
            limitTotalCents: seed.limitAmountCents,
            closeDay: seed.closeDay,
            dueDay: seed.dueDay,
            updatedAt: now
          })
          .where(eq(creditCards.id, existing.id))
          .run();
      } else {
        db
          .insert(creditCards)
          .values({
            id: uid("card"),
            name: seed.name,
            slug,
            brand: seed.brand,
            network: seed.network,
            settlementAccountId: settlementAccount.id,
            limitTotalCents: seed.limitAmountCents,
            closeDay: seed.closeDay,
            dueDay: seed.dueDay,
            color: slug.includes("nubank") ? "#7c3aed" : "#0ea5e9",
            isArchived: false,
            createdAt: now,
            updatedAt: now
          })
          .run();
        cardsCreated += 1;
      }
    }

    const cardIdBySlug = new Map(
      db.select().from(creditCards).all().map((card) => [card.slug, card.id] as const)
    );

    for (const billSeed of moneyBootstrapDataset.cardBills) {
      const cardId = cardIdBySlug.get(billSeed.cardSlug);
      if (!cardId) continue;
      const existingBill = db
        .select()
        .from(creditCardBills)
        .all()
        .find((bill) => bill.creditCardId === cardId && bill.billMonth === billSeed.billMonth);

      if (existingBill) {
        db
          .update(creditCardBills)
          .set({
            dueOn: billSeed.dueOn,
            closesOn: billSeed.closesOn,
            totalAmountCents: billSeed.totalAmountCents,
            updatedAt: now
          })
          .where(eq(creditCardBills.id, existingBill.id))
          .run();
        continue;
      }

      db
        .insert(creditCardBills)
        .values({
          id: uid("bill"),
          creditCardId: cardId,
          billMonth: billSeed.billMonth,
          closesOn: billSeed.closesOn,
          dueOn: billSeed.dueOn,
          totalAmountCents: billSeed.totalAmountCents,
          paidAmountCents: 0,
          status: billSeed.dueOn < moneyBootstrapDataset.generatedAt ? "closed" : "open",
          settlementTransactionId: null,
          createdAt: now,
          updatedAt: now
        })
        .run();
      billsCreated += 1;
    }

    const bills = db.select().from(creditCardBills).all();
    const billIdByKey = new Map(
      bills.map((bill) => {
        const card = db.select().from(creditCards).all().find((item) => item.id === bill.creditCardId);
        return [`${card?.slug ?? ""}:${bill.dueOn}`, bill.id] as const;
      })
    );

    for (const entry of moneyBootstrapDataset.cardEntries) {
      const billId = billIdByKey.get(`${entry.cardSlug}:${entry.dueOn}`);
      if (!billId) continue;
      const exists = db
        .select()
        .from(billEntries)
        .all()
        .find(
          (billEntry) =>
            billEntry.billId === billId &&
            billEntry.description === entry.description &&
            billEntry.amountCents === entry.amountCents
        );
      if (exists) continue;

      db
        .insert(billEntries)
        .values({
          id: uid("entry"),
          billId,
          entryType: entry.entryType,
          description: entry.description,
          amountCents: entry.amountCents,
          purchaseId: null,
          installmentId: null,
          createdAt: now
        })
        .run();
    }

    for (const seed of moneyBootstrapDataset.recurring) {
      const account = findAccountByName(seed.accountName);
      if (!account) continue;
      const existing = db
        .select()
        .from(recurringRules)
        .all()
        .find((rule) => rule.title === seed.title && rule.accountId === account.id);

      if (existing) {
        db
          .update(recurringRules)
          .set({
            direction: seed.direction,
            frequency: seed.frequency,
            amountCents: seed.amountCents,
            startsOn: seed.startsOn,
            nextRunOn: seed.nextRunOn,
            notes: seed.notes,
            isActive: true,
            updatedAt: now
          })
          .where(eq(recurringRules.id, existing.id))
          .run();
        continue;
      }

      const ruleId = uid("rr");
      db
        .insert(recurringRules)
        .values({
          id: ruleId,
          accountId: account.id,
          categoryId: null,
          title: seed.title,
          direction: seed.direction,
          frequency: seed.frequency,
          amountCents: seed.amountCents,
          startsOn: seed.startsOn,
          endsOn: null,
          nextRunOn: seed.nextRunOn,
          autoPost: false,
          notes: seed.notes,
          isActive: true,
          createdAt: now,
          updatedAt: now
        })
        .run();

      const occurrences = materializeOccurrences(
        {
          nextRunOn: seed.nextRunOn,
          endsOn: null,
          frequency: seed.frequency,
          amountCents: seed.amountCents,
          direction: seed.direction
        },
        6
      );

      for (const occurrence of occurrences) {
        db
          .insert(recurringOccurrences)
          .values({
            id: uid("ro"),
            ruleId,
            dueOn: occurrence.dueOn,
            amountCents: occurrence.amountCents,
            direction: occurrence.direction,
            status: "scheduled",
            transactionId: null,
            notes: "Gerado a partir da planilha Money.",
            createdAt: now,
            updatedAt: now
          })
          .run();
      }

      recurringCreated += 1;
    }

    const summarySeed = moneyBootstrapDataset.netWorthSummary;
    const existingSummary = db
      .select()
      .from(netWorthSummaries)
      .all()
      .find((row) => row.month === summarySeed.month);

    if (existingSummary) {
      db
        .update(netWorthSummaries)
        .set({
          reservesCents: summarySeed.reservesCents,
          investmentsCents: summarySeed.investmentsCents,
          debtsCents: summarySeed.debtsCents,
          notes: "Snapshot inicial importado da planilha Money.",
          source: "money_import",
          updatedAt: now
        })
        .where(eq(netWorthSummaries.id, existingSummary.id))
        .run();
    } else {
      db
        .insert(netWorthSummaries)
        .values({
          id: uid("nw"),
          month: summarySeed.month,
          reservesCents: summarySeed.reservesCents,
          investmentsCents: summarySeed.investmentsCents,
          debtsCents: summarySeed.debtsCents,
          notes: "Snapshot inicial importado da planilha Money.",
          source: "money_import",
          createdAt: now,
          updatedAt: now
        })
        .run();
    }

    for (const seed of moneyBootstrapDataset.reserves) {
      const existing = db.select().from(reserves).all().find((row) => row.name === seed.name);
      if (existing) {
        db
          .update(reserves)
          .set({
            investedCents: seed.investedCents,
            previousValueCents: seed.previousValueCents,
            currentValueCents: seed.currentValueCents,
            totalProfitCents: seed.totalProfitCents,
            yieldTotalPercent: seed.yieldTotalPercent,
            monthlyProfitCents: seed.monthlyProfitCents,
            yieldMonthlyPercent: seed.yieldMonthlyPercent,
            updatedAt: now
          })
          .where(eq(reserves.id, existing.id))
          .run();
      } else {
        db
          .insert(reserves)
          .values({
            id: uid("reserve"),
            name: seed.name,
            investedCents: seed.investedCents,
            previousValueCents: seed.previousValueCents,
            currentValueCents: seed.currentValueCents,
            totalProfitCents: seed.totalProfitCents,
            yieldTotalPercent: seed.yieldTotalPercent,
            monthlyProfitCents: seed.monthlyProfitCents,
            yieldMonthlyPercent: seed.yieldMonthlyPercent,
            accountId: null,
            createdAt: now,
            updatedAt: now
          })
          .run();
      }
      reservesUpserted += 1;
    }

    for (const seed of moneyBootstrapDataset.stockPositions) {
      const existing = db.select().from(stockPositions).all().find((row) => row.ticker === seed.ticker);
      if (existing) {
        db
          .update(stockPositions)
          .set({
            fullName: seed.fullName,
            quantity: seed.quantity,
            investedCents: seed.investedCents,
            previousCents: seed.previousCents,
            currentCents: seed.currentCents,
            resultTotalCents: seed.resultTotalCents,
            rentabilityTotalPercent: seed.rentabilityTotalPercent,
            updatedAt: now
          })
          .where(eq(stockPositions.id, existing.id))
          .run();
      } else {
        db
          .insert(stockPositions)
          .values({
            id: uid("stock"),
            ticker: seed.ticker,
            fullName: seed.fullName,
            quantity: seed.quantity,
            investedCents: seed.investedCents,
            previousCents: seed.previousCents,
            currentCents: seed.currentCents,
            resultTotalCents: seed.resultTotalCents,
            rentabilityTotalPercent: seed.rentabilityTotalPercent,
            createdAt: now,
            updatedAt: now
          })
          .run();
      }
      stocksUpserted += 1;
    }

    for (const seed of moneyBootstrapDataset.cryptoPositions) {
      const existing = db.select().from(cryptoPositions).all().find((row) => row.name === seed.name);
      if (existing) {
        db
          .update(cryptoPositions)
          .set({
            quantity: seed.quantity,
            investedCents: seed.investedCents,
            previousCents: seed.previousCents,
            currentCents: seed.currentCents,
            totalProfitCents: seed.totalProfitCents,
            updatedAt: now
          })
          .where(eq(cryptoPositions.id, existing.id))
          .run();
      } else {
        db
          .insert(cryptoPositions)
          .values({
            id: uid("crypto"),
            name: seed.name,
            quantity: seed.quantity,
            investedCents: seed.investedCents,
            previousCents: seed.previousCents,
            currentCents: seed.currentCents,
            totalProfitCents: seed.totalProfitCents,
            createdAt: now,
            updatedAt: now
          })
          .run();
      }
      cryptosUpserted += 1;
    }

    for (const seed of moneyBootstrapDataset.assetTrades) {
      const existing = db
        .select()
        .from(assetTrades)
        .all()
        .find(
          (trade) =>
            trade.assetName === seed.assetName &&
            trade.tradeDate === seed.tradeDate &&
            trade.action === seed.action &&
            trade.totalInitialCents === seed.totalInitialCents
        );
      if (existing) continue;

      db
        .insert(assetTrades)
        .values({
          id: uid("trade"),
          action: seed.action,
          assetName: seed.assetName,
          quantity: seed.quantity,
          tradeDate: seed.tradeDate,
          totalInitialCents: seed.totalInitialCents,
          pricePerUnitInitialCents: seed.pricePerUnitInitialCents,
          totalCurrentCents: seed.totalCurrentCents,
          pricePerUnitCurrentCents: seed.pricePerUnitCurrentCents,
          yieldPercent: seed.yieldPercent,
          descriptionText: seed.descriptionText,
          isCompleted: seed.isCompleted,
          createdAt: now
        })
        .run();
      tradesUpserted += 1;
    }

    const batch = ensureMoneyBatch(now);

    return {
      accountsCreated,
      cardsCreated,
      billsCreated,
      recurringCreated,
      reservesUpserted,
      stocksUpserted,
      cryptosUpserted,
      tradesUpserted,
      netWorthUpdated: true,
      importBatchCreated: batch.created
    };
  });

  return tx();
}
