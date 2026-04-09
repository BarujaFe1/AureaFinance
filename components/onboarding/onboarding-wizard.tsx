"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { completeFinancialOnboardingAction } from "@/features/onboarding/actions";
import type { MoneyBootstrapDataset } from "@/lib/money-bootstrap";
import { formatCurrencyFromCents } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type CategoryOption = { id: string; name: string };

type WizardMode = "manual" | "money";

type AccountDraft = {
  clientId: string;
  name: string;
  institution: string;
  type: "checking" | "savings" | "cash" | "investment" | "reserve" | "credit_card_settlement";
  openingBalance: string;
  includeInNetWorth: boolean;
  notes: string;
};

type CardDraft = {
  clientId: string;
  name: string;
  brand: string;
  network: string;
  limitAmount: string;
  closeDay: number;
  dueDay: number;
  settlementAccountClientId: string;
};

type RecurringDraft = {
  clientId: string;
  title: string;
  accountClientId: string;
  categoryId: string | null;
  amount: string;
  direction: "income" | "expense";
  frequency: "weekly" | "monthly" | "yearly";
  startsOn: string;
  nextRunOn: string;
  notes: string;
};

type NetWorthDraft = {
  month: string;
  reserves: string;
  investments: string;
  debts: string;
  notes: string;
};

const steps = [
  "Boas-vindas",
  "Preferências",
  "Contas",
  "Cartões",
  "Patrimônio",
  "Recorrências",
  "Revisão"
] as const;

function makeId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function centsToInput(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function emptyAccount(): AccountDraft {
  return {
    clientId: makeId("acc"),
    name: "",
    institution: "",
    type: "checking",
    openingBalance: "0,00",
    includeInNetWorth: true,
    notes: ""
  };
}

function emptyCard(defaultAccountId = ""): CardDraft {
  return {
    clientId: makeId("card"),
    name: "",
    brand: "",
    network: "",
    limitAmount: "0,00",
    closeDay: 1,
    dueDay: 10,
    settlementAccountClientId: defaultAccountId
  };
}

function emptyRecurring(defaultAccountId = ""): RecurringDraft {
  const today = new Date().toISOString().slice(0, 10);
  return {
    clientId: makeId("rec"),
    title: "",
    accountClientId: defaultAccountId,
    categoryId: null,
    amount: "0,00",
    direction: "expense",
    frequency: "monthly",
    startsOn: today,
    nextRunOn: today,
    notes: ""
  };
}

function buildDraftsFromMoney(dataset: MoneyBootstrapDataset) {
  const accounts = dataset.accounts.map<AccountDraft>((account) => ({
    clientId: makeId("acc"),
    name: account.name,
    institution: account.institution,
    type: account.type,
    openingBalance: centsToInput(account.openingBalanceCents),
    includeInNetWorth: account.includeInNetWorth,
    notes: account.notes
  }));

  const accountLookup = new Map(accounts.map((account) => [account.name, account.clientId] as const));

  const cards = dataset.cards.map<CardDraft>((card) => ({
    clientId: makeId("card"),
    name: card.name,
    brand: card.brand,
    network: card.network,
    limitAmount: centsToInput(card.limitAmountCents),
    closeDay: card.closeDay,
    dueDay: card.dueDay,
    settlementAccountClientId: accountLookup.get(card.settlementAccountName) ?? ""
  }));

  const recurring = dataset.recurring.map<RecurringDraft>((item) => ({
    clientId: makeId("rec"),
    title: item.title,
    accountClientId: accountLookup.get(item.accountName) ?? "",
    categoryId: null,
    amount: centsToInput(item.amountCents),
    direction: item.direction,
    frequency: item.frequency,
    startsOn: item.startsOn,
    nextRunOn: item.nextRunOn,
    notes: item.notes
  }));

  const netWorth: NetWorthDraft = {
    month: dataset.netWorthSummary.month,
    reserves: centsToInput(dataset.netWorthSummary.reservesCents),
    investments: centsToInput(dataset.netWorthSummary.investmentsCents),
    debts: centsToInput(dataset.netWorthSummary.debtsCents),
    notes: "Snapshot inferido da planilha Money. Revise antes de concluir."
  };

  return { accounts, cards, recurring, netWorth };
}

export function OnboardingWizard({
  categories,
  initialSettings,
  mode,
  dataset
}: {
  categories: CategoryOption[];
  initialSettings: {
    userDisplayName: string;
    baseCurrency: string;
    locale: string;
    themePreference: string;
    projectionMonths: number;
  };
  mode: WizardMode;
  dataset: MoneyBootstrapDataset;
}) {
  const moneyDrafts = useMemo(() => buildDraftsFromMoney(dataset), [dataset]);

  const [step, setStep] = useState(0);
  const [source] = useState<WizardMode>(mode);
  const [userDisplayName, setUserDisplayName] = useState(initialSettings.userDisplayName || "Você");
  const [baseCurrency, setBaseCurrency] = useState(initialSettings.baseCurrency || "BRL");
  const [locale, setLocale] = useState(initialSettings.locale || "pt-BR");
  const [themePreference, setThemePreference] = useState(initialSettings.themePreference || "system");
  const [projectionMonths, setProjectionMonths] = useState(String(initialSettings.projectionMonths || 6));
  const [accounts, setAccounts] = useState<AccountDraft[]>(source === "money" ? moneyDrafts.accounts : [emptyAccount()]);
  const [cards, setCards] = useState<CardDraft[]>(source === "money" ? moneyDrafts.cards : []);
  const [netWorth, setNetWorth] = useState<NetWorthDraft>(
    source === "money"
      ? moneyDrafts.netWorth
      : {
          month: new Date().toISOString().slice(0, 7),
          reserves: "0,00",
          investments: "0,00",
          debts: "0,00",
          notes: ""
        }
  );
  const [recurring, setRecurring] = useState<RecurringDraft[]>(
    source === "money" ? moneyDrafts.recurring : [emptyRecurring()]
  );
  const [destination, setDestination] = useState<"dashboard" | "import">(source === "money" ? "import" : "dashboard");

  const accountOptions = useMemo(
    () => accounts.filter((account) => account.name.trim()).map((account) => ({ id: account.clientId, name: account.name })),
    [accounts]
  );

  const preparedAccounts = useMemo(() => accounts.filter((account) => account.name.trim()), [accounts]);
  const preparedCards = useMemo(() => cards.filter((card) => card.name.trim()), [cards]);
  const preparedRecurring = useMemo(() => recurring.filter((item) => item.title.trim()), [recurring]);

  function updateAccount(clientId: string, patch: Partial<AccountDraft>) {
    setAccounts((current) => current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item)));
  }

  function updateCard(clientId: string, patch: Partial<CardDraft>) {
    setCards((current) => current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item)));
  }

  function updateRecurring(clientId: string, patch: Partial<RecurringDraft>) {
    setRecurring((current) => current.map((item) => (item.clientId === clientId ? { ...item, ...patch } : item)));
  }

  function removeAccount(clientId: string) {
    setAccounts((current) => current.filter((item) => item.clientId !== clientId));
    setCards((current) =>
      current.map((item) =>
        item.settlementAccountClientId === clientId ? { ...item, settlementAccountClientId: "" } : item
      )
    );
    setRecurring((current) =>
      current.map((item) => (item.accountClientId === clientId ? { ...item, accountClientId: "" } : item))
    );
  }

  function canContinue() {
    if (step === 1) return userDisplayName.trim().length > 0;
    if (step === 2) return preparedAccounts.length > 0 && preparedAccounts.every((account) => account.name.trim().length > 0);
    if (step === 3) return preparedCards.every((card) => !card.name.trim() || Boolean(card.settlementAccountClientId));
    if (step === 5) return preparedRecurring.every((item) => !item.title.trim() || Boolean(item.accountClientId));
    return true;
  }

  return (
    <Card className="border-[var(--border)]">
      <CardHeader>
        <CardDescription>Fluxo de primeiro uso</CardDescription>
        <CardTitle className="text-3xl">Configure a base financeira do app com contexto real.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-7">
          {steps.map((label, index) => {
            const active = index === step;
            const done = index < step;
            return (
              <div
                key={label}
                className={`rounded-2xl border px-3 py-3 text-sm ${
                  active
                    ? "border-[var(--primary)] bg-[var(--secondary)]"
                    : done
                      ? "border-[var(--border)] bg-[var(--card)]"
                      : "border-[var(--border)] bg-transparent"
                }`}
              >
                <div className="text-[11px] uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  {index + 1}
                </div>
                <div className="mt-1 font-medium">{label}</div>
              </div>
            );
          })}
        </div>

        <form action={completeFinancialOnboardingAction} className="space-y-6">
          <input type="hidden" name="source" value={source} />
          <input type="hidden" name="userDisplayName" value={userDisplayName} />
          <input type="hidden" name="baseCurrency" value={baseCurrency} />
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="projectionMonths" value={projectionMonths} />
          <input type="hidden" name="themePreference" value={themePreference} />
          <input type="hidden" name="destination" value={destination} />
          <input type="hidden" name="accountsJson" value={JSON.stringify(preparedAccounts)} />
          <input type="hidden" name="cardsJson" value={JSON.stringify(preparedCards)} />
          <input type="hidden" name="netWorthJson" value={JSON.stringify(netWorth)} />
          <input type="hidden" name="recurringJson" value={JSON.stringify(preparedRecurring)} />

          {step === 0 ? (
            <section className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4">
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-6">
                  <h3 className="text-xl font-semibold">
                    {source === "money" ? "A Money já foi reconhecida." : "Você pode começar manualmente ou migrando sua planilha."}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    O Aurea Finance foi pensado para substituir a planilha como fonte de verdade. Ele pode nascer vazio,
                    mas fica muito melhor quando recebe suas contas, faturas, patrimônio e compromissos desde o primeiro dia.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/onboarding?mode=money" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
                      Quero começar com meus dados da planilha
                    </Link>
                    <Link href="/onboarding?mode=manual" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
                      Quero configurar manualmente
                    </Link>
                  </div>
                </div>

                {source === "money" ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">O que a Money já entregou</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>{dataset.accounts.length} contas reconhecidas</p>
                        <p>{dataset.cards.length} cartões com vencimento detectado</p>
                        <p>{dataset.cardBills.length} faturas futuras estruturadas</p>
                        <p>{dataset.recurring.length} recorrências sugeridas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Patrimônio identificado</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>Reservas: {formatCurrencyFromCents(dataset.netWorthSummary.reservesCents)}</p>
                        <p>Investimentos: {formatCurrencyFromCents(dataset.netWorthSummary.investmentsCents)}</p>
                        <p>Dívidas abertas: {formatCurrencyFromCents(dataset.netWorthSummary.debtsCents)}</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Próximo passo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                  <p>Nas próximas etapas você ajusta preferências, confirma contas, valida cartões, patrimônio e compromissos fixos.</p>
                  <p>Partes opcionais podem ser puladas. O objetivo é sair do onboarding com o app inteligível e usável.</p>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome de exibição</Label>
                <Input value={userDisplayName} onChange={(event) => setUserDisplayName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Moeda base</Label>
                <Select value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>
                  <option value="BRL">BRL  Real brasileiro</option>
                  <option value="USD">USD  Dólar americano</option>
                  <option value="EUR">EUR  Euro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Locale</Label>
                <Select value={locale} onChange={(event) => setLocale(event.target.value)}>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">Español</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={themePreference} onChange={(event) => setThemePreference(event.target.value)}>
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Horizonte futuro padrão</Label>
                <Input
                  type="number"
                  min={1}
                  max={36}
                  value={projectionMonths}
                  onChange={(event) => setProjectionMonths(event.target.value)}
                />
              </div>
            </section>
          ) : null}

          {step === 2 ? (
            <section className="space-y-4">
              {accounts.map((account, index) => (
                <div key={account.clientId} className="grid gap-4 rounded-2xl border border-[var(--border)] p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da conta</Label>
                    <Input value={account.name} onChange={(event) => updateAccount(account.clientId, { name: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instituição</Label>
                    <Input value={account.institution} onChange={(event) => updateAccount(account.clientId, { institution: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={account.type} onChange={(event) => updateAccount(account.clientId, { type: event.target.value as AccountDraft["type"] })}>
                      <option value="checking">Conta corrente</option>
                      <option value="savings">Poupança / CDI</option>
                      <option value="cash">Dinheiro</option>
                      <option value="investment">Investimentos</option>
                      <option value="reserve">Reserva</option>
                      <option value="credit_card_settlement">Conta pagadora</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Saldo inicial / snapshot</Label>
                    <Input value={account.openingBalance} onChange={(event) => updateAccount(account.clientId, { openingBalance: event.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Observações</Label>
                    <Input value={account.notes} onChange={(event) => updateAccount(account.clientId, { notes: event.target.value })} />
                  </div>
                  <div className="flex items-center justify-between md:col-span-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={account.includeInNetWorth}
                        onChange={(event) => updateAccount(account.clientId, { includeInNetWorth: event.target.checked })}
                      />
                      Entra no patrimônio
                    </label>
                    <Button type="button" variant="outline" onClick={() => removeAccount(account.clientId)}>
                      Remover
                    </Button>
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] md:col-span-2">
                    Conta {index + 1}
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => setAccounts((current) => [...current, emptyAccount()])}>
                Adicionar conta
              </Button>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-4">
              {cards.map((card) => (
                <div key={card.clientId} className="grid gap-4 rounded-2xl border border-[var(--border)] p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input value={card.name} onChange={(event) => updateCard(card.clientId, { name: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Limite</Label>
                    <Input value={card.limitAmount} onChange={(event) => updateCard(card.clientId, { limitAmount: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Bandeira</Label>
                    <Input value={card.brand} onChange={(event) => updateCard(card.clientId, { brand: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Network</Label>
                    <Input value={card.network} onChange={(event) => updateCard(card.clientId, { network: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Fechamento</Label>
                    <Input
                      type="number"
                      value={card.closeDay}
                      onChange={(event) => updateCard(card.clientId, { closeDay: Number(event.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vencimento</Label>
                    <Input
                      type="number"
                      value={card.dueDay}
                      onChange={(event) => updateCard(card.clientId, { dueDay: Number(event.target.value) })}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Conta pagadora</Label>
                    <Select
                      value={card.settlementAccountClientId}
                      onChange={(event) => updateCard(card.clientId, { settlementAccountClientId: event.target.value })}
                    >
                      <option value="">Selecione uma conta</option>
                      {accountOptions.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCards((current) => [...current, emptyCard(accountOptions[0]?.id ?? "")])}
                >
                  Adicionar cartão
                </Button>
                <Button type="button" variant="ghost" onClick={() => setCards([])}>
                  Pular cartões
                </Button>
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Mês do snapshot</Label>
                <Input type="month" value={netWorth.month} onChange={(event) => setNetWorth((current) => ({ ...current, month: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Reservas</Label>
                <Input value={netWorth.reserves} onChange={(event) => setNetWorth((current) => ({ ...current, reserves: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Investimentos</Label>
                <Input value={netWorth.investments} onChange={(event) => setNetWorth((current) => ({ ...current, investments: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Dívidas</Label>
                <Input value={netWorth.debts} onChange={(event) => setNetWorth((current) => ({ ...current, debts: event.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Observações</Label>
                <Input value={netWorth.notes} onChange={(event) => setNetWorth((current) => ({ ...current, notes: event.target.value }))} />
              </div>
            </section>
          ) : null}

          {step === 5 ? (
            <section className="space-y-4">
              {recurring.map((item) => (
                <div key={item.clientId} className="grid gap-4 rounded-2xl border border-[var(--border)] p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Título</Label>
                    <Input value={item.title} onChange={(event) => updateRecurring(item.clientId, { title: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Conta</Label>
                    <Select value={item.accountClientId} onChange={(event) => updateRecurring(item.clientId, { accountClientId: event.target.value })}>
                      <option value="">Selecione uma conta</option>
                      {accountOptions.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Valor</Label>
                    <Input value={item.amount} onChange={(event) => updateRecurring(item.clientId, { amount: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Direção</Label>
                    <Select value={item.direction} onChange={(event) => updateRecurring(item.clientId, { direction: event.target.value as RecurringDraft["direction"] })}>
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Frequência</Label>
                    <Select value={item.frequency} onChange={(event) => updateRecurring(item.clientId, { frequency: event.target.value as RecurringDraft["frequency"] })}>
                      <option value="monthly">Mensal</option>
                      <option value="weekly">Semanal</option>
                      <option value="yearly">Anual</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select
                      value={item.categoryId ?? ""}
                      onChange={(event) => updateRecurring(item.clientId, { categoryId: event.target.value || null })}
                    >
                      <option value="">Sem categoria</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Começa em</Label>
                    <Input type="date" value={item.startsOn} onChange={(event) => updateRecurring(item.clientId, { startsOn: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Próxima ocorrência</Label>
                    <Input type="date" value={item.nextRunOn} onChange={(event) => updateRecurring(item.clientId, { nextRunOn: event.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Observações</Label>
                    <Input value={item.notes} onChange={(event) => updateRecurring(item.clientId, { notes: event.target.value })} />
                  </div>
                </div>
              ))}
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setRecurring((current) => [...current, emptyRecurring(accountOptions[0]?.id ?? "")])}
                >
                  Adicionar compromisso fixo
                </Button>
                <Button type="button" variant="ghost" onClick={() => setRecurring([])}>
                  Pular recorrências
                </Button>
              </div>
            </section>
          ) : null}

          {step === 6 ? (
            <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Resumo do que vai entrar</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium">Preferências</p>
                    <p className="text-[var(--muted-foreground)]">
                      {userDisplayName} · {baseCurrency} · {locale} · {themePreference} · horizonte {projectionMonths} meses
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Contas</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedAccounts.map((account) => (
                        <li key={account.clientId}>
                          {account.name}  {account.institution || "sem instituição"}  {account.openingBalance}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Cartões</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedCards.length ? preparedCards.map((card) => (
                        <li key={card.clientId}>
                          {card.name}  limite {card.limitAmount}  fecha dia {card.closeDay}, vence dia {card.dueDay}
                        </li>
                      )) : <li>Sem cartões iniciais.</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Patrimônio</p>
                    <p className="text-[var(--muted-foreground)]">
                      Reservas {netWorth.reserves} · Investimentos {netWorth.investments} · Dívidas {netWorth.debts}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Recorrências</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedRecurring.length ? preparedRecurring.map((item) => (
                        <li key={item.clientId}>
                          {item.title}  {item.amount}  {item.direction === "income" ? "receita" : "despesa"}
                        </li>
                      )) : <li>Sem recorrências iniciais.</li>}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Após concluir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <Label>Destino final</Label>
                    <Select value={destination} onChange={(event) => setDestination(event.target.value as "dashboard" | "import")}>
                      <option value="dashboard">Ir para o dashboard</option>
                      <option value="import">Ir para a central de importação</option>
                    </Select>
                  </div>
                  <p className="text-[var(--muted-foreground)]">
                    {source === "money"
                      ? "Como você escolheu a Money, faz sentido seguir para a central de importação e rodar o bootstrap completo."
                      : "Se preferir, finalize e comece usando o app manualmente; a importação continua disponível depois."}
                  </p>
                  <Button type="submit" className="w-full">
                    Concluir onboarding
                  </Button>
                </CardContent>
              </Card>
            </section>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] pt-4">
            <Button type="button" variant="outline" disabled={step === 0} onClick={() => setStep((current) => Math.max(current - 1, 0))}>
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              {step < steps.length - 1 ? (
                <Button type="button" disabled={!canContinue()} onClick={() => setStep((current) => Math.min(current + 1, steps.length - 1))}>
                  Continuar
                </Button>
              ) : null}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
