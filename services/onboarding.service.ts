import { eq } from "drizzle-orm";
import { db, sqlite } from "@/db/client";
import { accounts, settings } from "@/db/schema";
import { nowTs, isoMonth } from "@/lib/dates";
import { createAccount } from "@/services/accounts.service";
import { createCreditCard } from "@/services/cards.service";
import { upsertNetWorthSummary } from "@/services/net-worth.service";
import { createRecurringRule } from "@/services/recurring.service";
import { ensureSettings } from "@/services/settings.service";

export type FinancialOnboardingAccount = {
  clientId: string;
  name: string;
  type: "checking" | "savings" | "cash" | "investment" | "reserve" | "credit_card_settlement";
  institution?: string;
  openingBalance?: string;
  includeInNetWorth?: boolean;
  notes?: string;
};

export type FinancialOnboardingCard = {
  name: string;
  brand?: string;
  network?: string;
  limitAmount: string;
  closeDay: number;
  dueDay: number;
  settlementAccountClientId: string;
};

export type FinancialOnboardingNetWorth = {
  month: string;
  reserves: string;
  investments: string;
  debts: string;
  notes?: string;
};

export type FinancialOnboardingRecurring = {
  title: string;
  accountClientId: string;
  direction: "income" | "expense" | "transfer_in" | "transfer_out" | "bill_payment" | "adjustment";
  amount: string;
  startsOn: string;
  nextRunOn: string;
  frequency: "weekly" | "monthly" | "yearly";
  categoryId?: string | null;
  notes?: string;
};

export type FinancialOnboardingPayload = {
  source: "manual" | "money";
  userDisplayName: string;
  baseCurrency: string;
  locale: string;
  projectionMonths: number;
  themePreference: "light" | "dark" | "system";
  destination: "dashboard" | "import";
  accounts: FinancialOnboardingAccount[];
  cards: FinancialOnboardingCard[];
  netWorth: FinancialOnboardingNetWorth;
  recurring: FinancialOnboardingRecurring[];
};

function findAccountIdByName(name: string) {
  const rows = db.select().from(accounts).all();
  const match = [...rows].reverse().find((account) => account.name === name);
  return match?.id ?? null;
}

export function completeFinancialOnboarding(payload: FinancialOnboardingPayload) {
  const accountIdMap = new Map<string, string>();

  const tx = sqlite.transaction(() => {
    ensureSettings();
    db
      .update(settings)
      .set({
        userDisplayName: payload.userDisplayName,
        baseCurrency: payload.baseCurrency,
        locale: payload.locale,
        projectionMonths: payload.projectionMonths,
        themePreference: payload.themePreference,
        isOnboarded: true,
        updatedAt: nowTs()
      })
      .where(eq(settings.id, "main"))
      .run();

    for (const account of payload.accounts) {
      if (!account.name.trim()) continue;
      createAccount({
        name: account.name,
        type: account.type,
        institution: account.institution ?? "",
        openingBalance: account.openingBalance ?? "0",
        color: "#5b7cfa",
        includeInNetWorth: account.includeInNetWorth ?? true,
        notes: account.notes ?? ""
      });
      const createdAccountId = findAccountIdByName(account.name);
      if (!createdAccountId) throw new Error(`Conta ${account.name}: nÃ£o foi possÃ­vel localizar o registro criado.`);
      accountIdMap.set(account.clientId, createdAccountId);
    }

    for (const card of payload.cards) {
      if (!card.name.trim()) continue;
      const settlementAccountId = accountIdMap.get(card.settlementAccountClientId);
      if (!settlementAccountId) throw new Error(`CartÃ£o ${card.name}: conta de pagamento nÃ£o encontrada no onboarding.`);
      createCreditCard({
        name: card.name,
        brand: card.brand ?? "",
        network: card.network ?? "",
        limitAmount: card.limitAmount,
        closeDay: card.closeDay,
        dueDay: card.dueDay,
        settlementAccountId
      });
    }

    const netWorthMonth = payload.netWorth.month || isoMonth(new Date().toISOString().slice(0, 10));
    const hasNetWorthData = Boolean(
      payload.netWorth.notes ||
        payload.netWorth.reserves !== "0" ||
        payload.netWorth.investments !== "0" ||
        payload.netWorth.debts !== "0"
    );

    if (hasNetWorthData || netWorthMonth) {
      upsertNetWorthSummary({
        month: netWorthMonth,
        reserves: payload.netWorth.reserves,
        investments: payload.netWorth.investments,
        debts: payload.netWorth.debts,
        notes: payload.netWorth.notes ?? ""
      });
    }

    for (const item of payload.recurring) {
      if (!item.title.trim()) continue;
      const accountId = accountIdMap.get(item.accountClientId);
      if (!accountId) throw new Error(`RecorrÃªncia ${item.title}: conta vinculada nÃ£o encontrada no onboarding.`);
      createRecurringRule({
        title: item.title,
        accountId,
        direction: item.direction,
        amount: item.amount,
        startsOn: item.startsOn,
        nextRunOn: item.nextRunOn,
        frequency: item.frequency,
        categoryId: item.categoryId ?? undefined,
        notes: item.notes ?? ""
      });
    }
  });

  tx();
  return payload.destination === "import" ? "/import" : "/dashboard";
}
