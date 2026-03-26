# Project Scan (lite) — aurea-finance
> Gerado em: 26/03/2026, 13:14:27
> Arquivos capturados: 106
> Pastas escaneadas: app, features, services, lib, db, components
> Componentes shadcn/ui (/components/ui) ignorados — gerados automaticamente

---

## `package.json`
```json
{
  "name": "aurea-finance",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@10.6.1",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "typecheck": "tsc --noEmit",
    "db:migrate": "tsx scripts/migrate.ts",
    "db:seed": "tsx scripts/seed.ts",
    "db:backup": "tsx scripts/backup.ts",
    "db:doctor": "tsx scripts/doctor.ts",
    "test": "vitest run",
    "test:watch": "vitest",
    "db:import-csv": "tsx scripts/import-csv.ts"
  },
  "dependencies": {
    "@hookform/resolvers": "^4.1.0",
    "better-sqlite3": "^11.8.1",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "date-fns": "^4.1.0",
    "drizzle-orm": "^0.39.2",
    "lucide-react": "^0.511.0",
    "next": "15.2.0",
    "next-themes": "^0.4.4",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "react-hook-form": "^7.54.2",
    "recharts": "^2.15.1",
    "tailwind-merge": "^2.6.0",
    "xlsx": "^0.18.5",
    "zod": "^3.24.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.0.15",
    "@types/better-sqlite3": "^7.6.12",
    "@types/node": "^22.13.4",
    "@types/react": "^19.0.8",
    "@types/react-dom": "^19.0.3",
    "drizzle-kit": "^0.30.5",
    "postcss": "^8.5.3",
    "tailwindcss": "^4.0.15",
    "tsx": "^4.19.3",
    "typescript": "^5.7.3",
    "vitest": "^3.0.8"
  },
  "pnpm": {
    "onlyBuiltDependencies": [
      "better-sqlite3"
    ]
  }
}
```

## `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "ES2022"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "baseUrl": ".",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "20mb"
    }
  }
};

export default nextConfig;
```

## `tailwind.config.ts`
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",
        danger: "hsl(var(--danger))"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem"
      },
      boxShadow: {
        soft: "0 10px 35px rgba(15, 23, 42, 0.08)",
        panel: "0 18px 48px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
```

## `app\(workspace)\accounts\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountForm } from "@/features/accounts/account-form";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccountsWithBalances } from "@/services/accounts.service";

export default function AccountsPage() {
  const accounts = listAccountsWithBalances();

  return (
    <>
      <PageHeader
        title="Contas"
        description="Contas correntes, poupanças, reservas e contas pagadoras de fatura com saldo atual e saldo projetado."
      />
      <AccountForm />
      <Card>
        <CardHeader>
          <CardTitle>Resumo por conta</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Conta</th>
                  <th>Instituição</th>
                  <th>Tipo</th>
                  <th>Saldo atual</th>
                  <th>Saldo projetado</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.name}</td>
                    <td>{account.institution || "—"}</td>
                    <td>{account.type}</td>
                    <td>{formatCurrencyFromCents(account.currentBalanceCents)}</td>
                    <td>{formatCurrencyFromCents(account.projectedBalanceCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhuma conta cadastrada"
              description="Crie a primeira conta ou importe sua base. Quando existir conta, os saldos serão calculados a partir do opening balance e das transações vinculadas."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\(workspace)\bills\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { markBillPaidAction } from "@/features/cards/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listBills } from "@/services/cards.service";

export default function BillsPage() {
  const bills = listBills();

  return (
    <>
      <PageHeader
        title="Faturas"
        description="Cada fatura é uma entidade própria e consolidada. Parcelas já entram previamente na fatura correta."
      />
      {bills.length > 0 ? (
        <div className="grid gap-4">
          {bills.map((bill) => (
            <Card key={bill.id}>
              <CardHeader>
                <CardTitle>Fatura {bill.billMonth}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>Fecha em {bill.closesOn}</span>
                  <span>Vence em {bill.dueOn}</span>
                  <span>Status: {bill.status}</span>
                  <strong className="text-[var(--foreground)]">
                    {formatCurrencyFromCents(bill.totalAmountCents - bill.paidAmountCents)}
                  </strong>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Entrada</th>
                      <th>Tipo</th>
                      <th>Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.entries.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.description}</td>
                        <td>{entry.entryType}</td>
                        <td>{formatCurrencyFromCents(entry.amountCents)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bill.status !== "paid" ? (
                  <form action={markBillPaidAction}>
                    <input type="hidden" name="billId" value={bill.id} />
                    <Button type="submit">Marcar como paga</Button>
                  </form>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma fatura gerada"
          description="Esse vazio é legítimo quando ainda não existem cartões ou compras lançadas no cartão."
        />
      )}
    </>
  );
}
```

## `app\(workspace)\calendar\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";

export default function CalendarPage() {
  const timeline = [
    ...listBills()
      .filter((bill) => bill.status !== "paid")
      .map((bill) => ({
        date: bill.dueOn,
        title: `Fatura ${bill.billMonth}`,
        kind: "Fatura",
        amountCents: bill.totalAmountCents - bill.paidAmountCents
      })),
    ...listRecurringRules()
      .flatMap((rule) => rule.occurrences)
      .filter((row) => row.status === "scheduled")
      .map((occurrence) => ({
        date: occurrence.dueOn,
        title: "Recorrência",
        kind: occurrence.direction,
        amountCents: occurrence.amountCents
      }))
  ].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <PageHeader
        title="Calendário financeiro"
        description="Linha do tempo prática dos próximos vencimentos, contas fixas, faturas abertas e compromissos projetados."
      />
      <Card>
        <CardHeader>
          <CardTitle>Próximos compromissos</CardTitle>
        </CardHeader>
        <CardContent>
          {timeline.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>
              <tbody>
                {timeline.map((item, index) => (
                  <tr key={`${item.date}-${index}`}>
                    <td>{item.date}</td>
                    <td>{item.title}</td>
                    <td>{item.kind}</td>
                    <td>{formatCurrencyFromCents(item.amountCents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Calendário sem eventos"
              description="Não há faturas abertas nem recorrências agendadas. Esse é um vazio legítimo quando a base ainda está no começo."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\(workspace)\cards\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createCardPurchaseAction, createCreditCardAction } from "@/features/cards/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { getCardsSummary } from "@/services/cards.service";

export default function CardsPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const cards = getCardsSummary();

  return (
    <>
      <PageHeader title="Cartões" description="Cartões têm fechamento, vencimento, limite total, limite disponível, compras à vista e parceladas com geração explícita de parcelas." />
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Novo cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCreditCardAction} className="grid gap-4 md:grid-cols-2">
              <Input name="name" placeholder="Nubank" />
              <Input name="limitAmount" placeholder="5000,00" />
              <Input name="brand" placeholder="Mastercard" />
              <Input name="network" placeholder="Gold, Black..." />
              <Input name="closeDay" type="number" placeholder="Dia fechamento" />
              <Input name="dueDay" type="number" placeholder="Dia vencimento" />
              <div className="md:col-span-2">
                <Select name="settlementAccountId">
                  <option value="">Selecione a conta de pagamento</option>
                  {accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}
                </Select>
              </div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Criar cartão</Button></div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Nova compra no cartão</CardTitle></CardHeader>
          <CardContent>
            <form action={createCardPurchaseAction} className="grid gap-4 md:grid-cols-2">
              <Select name="creditCardId">
                <option value="">Selecione o cartão</option>
                {cards.map((card) => <option key={card.id} value={card.id}>{card.name}</option>)}
              </Select>
              <Input name="description" placeholder="Monitor, SmartFit, tênis..." />
              <Input name="purchaseDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              <Input name="amount" placeholder="0,00" />
              <Input name="installmentCount" type="number" defaultValue={1} min={1} max={48} />
              <Select name="categoryId"><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
              <div className="md:col-span-2"><Input name="notes" placeholder="Observações da compra" /></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Lançar compra</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>
      <Card>
        <CardHeader><CardTitle>Resumo dos cartões</CardTitle></CardHeader>
        <CardContent>
          {cards.length > 0 ? (
            <table>
              <thead><tr><th>Cartão</th><th>Fechamento</th><th>Vencimento</th><th>Limite</th><th>Usado</th><th>Disponível</th></tr></thead>
              <tbody>{cards.map((card) => <tr key={card.id}><td>{card.name}</td><td>Dia {card.closeDay}</td><td>Dia {card.dueDay}</td><td>{formatCurrencyFromCents(card.limitTotalCents)}</td><td>{formatCurrencyFromCents(card.usedCents)}</td><td>{formatCurrencyFromCents(card.availableLimitCents)}</td></tr>)}</tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhum cartão cadastrado"
              description="Esse vazio é legítimo quando a base ainda está no começo. Depois do primeiro cartão, o limite, o usado e o disponível aparecem aqui."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\(workspace)\categories\page.tsx`
```tsx
import { db } from "@/db/client";
import { categories, subcategories, tags } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CategoriesPage() {
  const categoryRows = db.select().from(categories).all();
  const subcategoryRows = db.select().from(subcategories).all();
  const tagRows = db.select().from(tags).all();

  return (
    <div className="space-y-6">
      <PageHeader title="Categorias e tags" description="Taxonomia leve, flexível e preparada para busca e filtro." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader><CardTitle>Categorias</CardTitle></CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {categoryRows.map((category) => (
              <div key={category.id} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium">{category.name}</div>
                  <Badge variant="secondary">{category.kind}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {subcategoryRows.filter((item) => item.categoryId === category.id).map((item) => (
                    <Badge key={item.id} variant="outline">{item.name}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Tags</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {tagRows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma tag cadastrada ainda.</p> : null}
            {tagRows.map((tag) => <Badge key={tag.id} variant="outline">{tag.name}</Badge>)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

## `app\(workspace)\closings\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { runMonthlyClosingAction } from "@/features/monthly-closing/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listMonthlyClosings } from "@/services/monthly-closing.service";

export default function ClosingsPage() {
  const closings = listMonthlyClosings();

  return (
    <>
      <PageHeader
        title="Fechamentos mensais"
        description="ConsolidaÃ§Ã£o do mÃªs com saldo de abertura, entradas, saÃ­das, transferÃªncias, faturas abertas e caixa livre projetado."
      />
      <Card>
        <CardHeader>
          <CardTitle>Rodar fechamento</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={runMonthlyClosingAction} className="flex flex-wrap gap-2">
            <Input type="month" name="month" defaultValue={new Date().toISOString().slice(0, 7)} className="max-w-[240px]" />
            <Button type="submit">Fechar mÃªs</Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>HistÃ³rico de fechamentos</CardTitle>
        </CardHeader>
        <CardContent>
          {closings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted-foreground)]">
                    <th className="px-2 py-2">MÃªs</th>
                    <th className="px-2 py-2">Abertura</th>
                    <th className="px-2 py-2">Receitas</th>
                    <th className="px-2 py-2">Despesas</th>
                    <th className="px-2 py-2">TransferÃªncias</th>
                    <th className="px-2 py-2">Faturas em aberto</th>
                    <th className="px-2 py-2">Saldo final</th>
                    <th className="px-2 py-2">Caixa livre</th>
                  </tr>
                </thead>
                <tbody>
                  {closings.map((closing) => (
                    <tr key={closing.id} className="border-t border-[var(--border)]">
                      <td className="px-2 py-3">{closing.month}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.openingBalanceCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.incomesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.expensesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.transfersNetCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(closing.projectedBillPaymentsCents)}</td>
                      <td className="px-2 py-3 font-medium">{formatCurrencyFromCents(closing.closingBalanceCents)}</td>
                      <td className="px-2 py-3 font-medium">{formatCurrencyFromCents(closing.projectedFreeCashCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="Nenhum fechamento salvo"
              description="Depois do primeiro fechamento manual, o histÃ³rico mensal aparece aqui usando a coluna month e os campos reais do schema atual."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\(workspace)\dashboard\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AccountBalanceChart } from "@/components/charts/account-balance-chart";
import { formatCurrencyFromCents } from "@/lib/currency";
import { getDashboardData } from "@/services/dashboard.service";

export default function DashboardPage() {
  const data = getDashboardData();
  const hasTransactions = data.recentTransactions.length > 0;
  const hasCommitments = data.upcomingBills.length > 0 || data.recurring.length > 0;

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Visão consolidada do caixa atual, do caixa projetado, das próximas faturas e dos lançamentos recentes."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo consolidado" value={formatCurrencyFromCents(data.consolidatedCurrentCents)} description="Somatório das contas não-cartão." />
        <StatCard title="Saldo projetado" value={formatCurrencyFromCents(data.consolidatedProjectedCents)} description="Desconta faturas abertas e lançamentos futuros." />
        <StatCard title="Receitas do mês" value={formatCurrencyFromCents(data.incomeMonthCents)} />
        <StatCard title="Despesas do mês" value={formatCurrencyFromCents(data.expenseMonthCents)} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader><CardTitle>Saldo por conta</CardTitle></CardHeader>
          <CardContent><AccountBalanceChart data={data.chartSeries} /></CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Patrimônio resumido</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Liquidez atual</span><strong>{formatCurrencyFromCents(data.netWorth.realizedLiquidCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Reservas manuais</span><strong>{formatCurrencyFromCents(data.netWorth.manualReservesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Investimentos manuais</span><strong>{formatCurrencyFromCents(data.netWorth.manualInvestmentsCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Dívidas manuais</span><strong>{formatCurrencyFromCents(data.netWorth.manualDebtsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              {data.netWorth.month ? `Último snapshot manual: ${data.netWorth.month}` : "Nenhum snapshot manual salvo ainda."}
            </div>
            <div className="mt-1 rounded-2xl border border-[var(--border)] p-4 text-base font-semibold">Patrimônio total: {formatCurrencyFromCents(data.netWorth.totalNetWorthCents)}</div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader><CardTitle>Últimas transações</CardTitle></CardHeader>
          <CardContent>
            {hasTransactions ? (
              <table>
                <thead><tr><th>Data</th><th>Descrição</th><th>Direção</th><th>Valor</th></tr></thead>
                <tbody>
                  {data.recentTransactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.occurredOn}</td>
                      <td>{transaction.description}</td>
                      <td><Badge>{transaction.direction}</Badge></td>
                      <td>{formatCurrencyFromCents(transaction.amountCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState title="Nenhuma transação ainda" description="Isso é um vazio legítimo: ainda não há lançamentos no banco local para compor o histórico recente." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Próximos compromissos</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            {data.upcomingBills.map((bill) => (
              <div key={bill.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>Fatura {bill.billMonth}</strong><Badge>{bill.status}</Badge></div>
                <p className="mt-1 text-[var(--muted-foreground)]">Vencimento: {bill.dueOn}</p>
                <p>{formatCurrencyFromCents(bill.totalAmountCents - bill.paidAmountCents)}</p>
              </div>
            ))}

            {data.recurring.map((occurrence) => (
              <div key={occurrence.id} className="rounded-2xl border border-[var(--border)] p-3">
                <div className="flex items-center justify-between"><strong>Recorrência</strong><Badge>{occurrence.direction}</Badge></div>
                <p className="mt-1 text-[var(--muted-foreground)]">Prevista para {occurrence.dueOn}</p>
                <p>{formatCurrencyFromCents(occurrence.amountCents)}</p>
              </div>
            ))}

            {!hasCommitments ? (
              <EmptyState title="Nada a vencer agora" description="Não há faturas abertas nem ocorrências recorrentes agendadas. Se isso não fizer sentido para sua base, o próximo passo é revisar seed/importação." />
            ) : null}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
```

## `app\(workspace)\future\page.tsx`
```tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FutureCashflowChart } from "@/components/future/cashflow-chart";
import { FutureEventsTimeline } from "@/components/future/events-timeline";
import { FutureSummaryCards } from "@/components/future/summary-cards";
import { getProjectedCashflow } from "@/services/cashflow.service";

export default async function FuturePage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const params = (await searchParams) ?? {};
  const horizonParam = Array.isArray(params.horizon) ? params.horizon[0] : params.horizon;
  const horizon = Number.isFinite(Number(horizonParam)) ? Math.min(Math.max(Number(horizonParam), 15), 365) : 90;
  const projection = await getProjectedCashflow(horizon);
  const chartData = projection.days.map((day) => ({ date: day.date, balance: day.balance_cents / 100 }));

  return (
    <>
      <PageHeader
        title="VisÃ£o futura"
        description="Timeline projetada com recorrÃªncias, faturas, parcelas e alertas de caixa no horizonte selecionado."
      />

      <form className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="flex flex-wrap items-end gap-3">
          <label className="grid gap-2 text-sm">
            <span>Horizonte em dias</span>
            <Input name="horizon" type="number" min={15} max={365} defaultValue={String(horizon)} />
          </label>
          <button type="submit" className="inline-flex h-10 items-center justify-center rounded-2xl bg-[var(--primary)] px-4 text-sm font-medium text-[var(--primary-foreground)]">
            Atualizar projeÃ§Ã£o
          </button>
        </div>
      </form>

      <FutureSummaryCards
        initialBalanceCents={projection.initial_balance_cents}
        endingBalanceCents={projection.ending_balance_cents}
        minBalanceCents={projection.min_balance_cents}
        totalIncomeCents={projection.total_income_cents}
        totalExpensesCents={projection.total_expenses_cents}
        firstNegativeDate={projection.first_negative_date}
        minBalanceDate={projection.min_balance_date}
      />

      <Card>
        <CardHeader>
          <CardTitle>Curva de saldo projetado</CardTitle>
        </CardHeader>
        <CardContent>
          <FutureCashflowChart data={chartData} />
        </CardContent>
      </Card>

      <FutureEventsTimeline days={projection.days} />
    </>
  );
}
```

## `app\(workspace)\import\page.tsx`
```tsx
import { db } from "@/db/client";
import { importBatches, importIssues } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { ImportWizardOverview } from "@/components/import/import-wizard-overview";
import { ImportWorkbench } from "@/components/import/import-workbench";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { expectedCsvFiles } from "@/services/csv-import.service";
import { getMoneyBootstrapDataset } from "@/services/money-bootstrap.service";
import { bootstrapMoneyImportAction, commitBatchAction, validateBatchAction } from "@/features/import/actions";
import { fromJson } from "@/lib/utils";
import type { BatchMeta, DryRunReport } from "@/types/domain";

function formatCreatedAt(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("pt-BR");
}

export default function ImportPage() {
  const batches = db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt);
  const issues = db.select().from(importIssues).all().sort((a, b) => b.createdAt - a.createdAt);
  const money = getMoneyBootstrapDataset();

  return (
    <div className="space-y-6">
      <PageHeader
        title="MigraÃ§Ã£o e importaÃ§Ã£o"
        description="Centro Ãºnico para bootstrap da planilha Money, importaÃ§Ã£o genÃ©rica CSV/XLSX, dry-run, validaÃ§Ã£o e commit final."
      />

      <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Fluxo dedicado da Money.xlsx</CardTitle>
            <CardDescription>A planilha foi reconhecida e jÃ¡ gerou defaults confiÃ¡veis para onboarding, contas, cartÃµes, recorrÃªncias, patrimÃ´nio e visÃ£o futura.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.accounts.length}</strong><div className="text-[var(--muted-foreground)]">contas sugeridas</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cards.length}</strong><div className="text-[var(--muted-foreground)]">cartÃµes reconhecidos</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.recurring.length}</strong><div className="text-[var(--muted-foreground)]">compromissos recorrentes</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.cardBills.length}</strong><div className="text-[var(--muted-foreground)]">faturas futuras</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.reserves.length + money.stockPositions.length + money.cryptoPositions.length}</strong><div className="text-[var(--muted-foreground)]">posiÃ§Ãµes patrimoniais</div></div>
              <div className="rounded-2xl border border-[var(--border)] p-4 text-sm"><strong>{money.sheetInventory.length}</strong><div className="text-[var(--muted-foreground)]">abas reconhecidas</div></div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
              <p><strong className="text-[var(--foreground)]">Mapeamento principal:</strong> VisÃ£o Geral â†’ contas/saldos/patrimÃ´nio, CartÃµes â†’ faturas e parcelas futuras, Richard â†’ recorrÃªncias fixas, TransaÃ§Ãµes â†’ histÃ³rico de ativos e Registro DiÃ¡rio â†’ pistas para sÃ©rie temporal.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <form action={bootstrapMoneyImportAction}>
                <Button type="submit">Modo rÃ¡pido: preencher tudo com Money</Button>
              </form>
              <a href="/onboarding?mode=money" className="inline-flex h-10 items-center justify-center rounded-2xl border border-[var(--border)] px-4 text-sm font-medium">
                Revisar no onboarding assistido
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Abas reconhecidas da planilha</CardTitle>
            <CardDescription>HeurÃ­sticas e defaults especÃ­ficos para a sua Money.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {money.sheetInventory.map((sheet) => (
              <div key={sheet.name} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{sheet.name}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{sheet.rows} linhas Â· {sheet.columns} colunas</div>
                  </div>
                  <Badge variant="secondary">reconhecida</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <ImportWizardOverview />
      <ImportWorkbench expectedFiles={expectedCsvFiles()} />

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Lotes de importaÃ§Ã£o</CardTitle>
            <CardDescription>Workbooks enviados para staging, com inventÃ¡rio, dry-run e commit final.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {batches.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum lote carregado ainda.</p> : null}
            {batches.map((batch) => {
              const meta = fromJson<BatchMeta>(batch.workbookSummaryJson, { sheets: [] });
              const report = fromJson<DryRunReport | null>(batch.dryRunReportJson, null);
              return (
                <div key={batch.id} className="rounded-2xl border border-[var(--border)] p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-medium">{batch.filename}</div>
                      <div className="text-sm text-muted-foreground">Enviado em {formatCreatedAt(batch.createdAt)} Â· {meta.sheets.length} abas inventariadas</div>
                    </div>
                    <Badge variant={batch.status.includes("issues") ? "destructive" : "secondary"}>{batch.status}</Badge>
                  </div>

                  {meta.sheets.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {meta.sheets.map((sheet) => (
                        <Badge key={`${batch.id}-${sheet.name}`} variant="outline">{sheet.name}: {sheet.suggestedTarget}</Badge>
                      ))}
                    </div>
                  ) : null}

                  {report ? (
                    <div className="mt-4 rounded-2xl bg-[var(--secondary)] p-3 text-sm">
                      <div>Contas: {report.summary.accounts} Â· TransaÃ§Ãµes: {report.summary.transactions} Â· CartÃµes: {report.summary.creditCards} Â· Faturas/parcelas: {report.summary.installments}</div>
                      <div>Issues: {report.summary.issues}</div>
                      {report.warnings.length > 0 ? <div className="mt-2 text-[var(--muted-foreground)]">{report.warnings.join(" Â· ")}</div> : null}
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap gap-3">
                    <form action={validateBatchAction}>
                      <input type="hidden" name="batchId" value={batch.id} />
                      <Button type="submit" variant="outline">Rodar dry-run</Button>
                    </form>
                    <form action={commitBatchAction}>
                      <input type="hidden" name="batchId" value={batch.id} />
                      <input type="hidden" name="dryRun" value="false" />
                      <Button type="submit">Commitar lote</Button>
                    </form>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logs e inconsistÃªncias</CardTitle>
            <CardDescription>Mensagens legÃ­veis para revisar o que foi reconhecido, inferido ou precisa de confirmaÃ§Ã£o.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {issues.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma inconsistÃªncia registrada atÃ© agora.</p> : null}
            {issues.slice(0, 12).map((issue) => (
              <div key={issue.id} className="rounded-2xl border border-[var(--border)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">{issue.message}</div>
                    <div className="text-sm text-muted-foreground">{issue.sheetName} Â· {issue.issueCode}</div>
                  </div>
                  <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>{issue.severity}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
```

## `app\(workspace)\import\review\page.tsx`
```tsx
import { db } from "@/db/client";
import { importIssues, importRawRows } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function getValidationVariant(status: string) {
  if (status === "invalid") return "destructive";
  if (status === "pending") return "secondary";
  return "outline";
}

export default function ImportReviewPage() {
  const rows = db.select().from(importRawRows).all();
  const issues = db.select().from(importIssues).all();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revisão de importação"
        description="Linhas brutas em staging, status de validação e inconsistências antes do commit definitivo."
      />
      <Card>
        <CardHeader><CardTitle>Linhas em staging</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="p-2">Aba</th>
                  <th className="p-2">Linha</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">JSON bruto</th>
                </tr>
              </thead>
              <tbody>
                {rows.slice(0, 25).map((row) => (
                  <tr key={row.id} className="border-b align-top">
                    <td className="p-2">{row.sheetName}</td>
                    <td className="p-2">{row.rowNumber}</td>
                    <td className="p-2">
                      <Badge variant={getValidationVariant(row.validationStatus)}>{row.validationStatus}</Badge>
                    </td>
                    <td className="max-w-[520px] truncate p-2 font-mono text-xs">{row.payloadJson}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Issues registradas</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {issues.slice(0, 20).map((issue) => (
            <div key={issue.id} className="rounded-xl border p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="font-medium">{issue.message}</div>
                  <div className="text-sm text-muted-foreground">{issue.issueCode}</div>
                </div>
                <Badge variant={issue.severity === "error" ? "destructive" : "secondary"}>{issue.severity}</Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
```

## `app\(workspace)\layout.tsx`
```tsx
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ensureSettings } from "@/services/settings.service";

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  const settings = ensureSettings();

  if (!settings.isOnboarded) {
    redirect("/onboarding");
  }

  return <>{children}</>;
}
```

## `app\(workspace)\net-worth\page.tsx`
```tsx
import { db } from "@/db/client";
import { cryptoPositions, reserves, stockPositions } from "@/db/schema";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveNetWorthAction } from "@/features/net-worth/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { getCurrentNetWorthSummary, listNetWorthSummaries } from "@/services/net-worth.service";

export default function NetWorthPage() {
  const summary = getCurrentNetWorthSummary();
  const history = listNetWorthSummaries();
  const reserveItems = db.select().from(reserves).all();
  const stockItems = db.select().from(stockPositions).all();
  const cryptoItems = db.select().from(cryptoPositions).all();

  return (
    <>
      <PageHeader
        title="PatrimÃ´nio"
        description="Resumo patrimonial com reservas, investimentos, dÃ­vidas e snapshots manuais, conciliado com os dados importados da planilha." 
      />
      <section className="grid gap-4 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Liquidez atual</span><strong>{formatCurrencyFromCents(summary.realizedLiquidCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Reservas</span><strong>{formatCurrencyFromCents(summary.manualReservesCents)}</strong></div>
            <div className="flex items-center justify-between"><span>Investimentos</span><strong>{formatCurrencyFromCents(summary.manualInvestmentsCents)}</strong></div>
            <div className="flex items-center justify-between"><span>DÃ­vidas</span><strong>{formatCurrencyFromCents(summary.manualDebtsCents)}</strong></div>
            <div className="rounded-2xl border border-[var(--border)] p-3 text-xs text-[var(--muted-foreground)]">
              {summary.month ? `Ãšltimo snapshot consolidado: ${summary.month}` : "Nenhum snapshot manual salvo ainda."}
            </div>
            <div className="mt-1 rounded-2xl border border-[var(--border)] p-4 text-lg font-semibold">PatrimÃ´nio total: {formatCurrencyFromCents(summary.totalNetWorthCents)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Novo snapshot manual</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={saveNetWorthAction} className="grid gap-4 md:grid-cols-2">
              <Input name="month" type="month" defaultValue={new Date().toISOString().slice(0, 7)} />
              <Input name="reserves" placeholder="Reservas" defaultValue="0,00" />
              <Input name="investments" placeholder="Investimentos" defaultValue="0,00" />
              <Input name="debts" placeholder="DÃ­vidas" defaultValue="0,00" />
              <div className="md:col-span-2"><Input name="notes" placeholder="ObservaÃ§Ãµes" /></div>
              <div className="md:col-span-2 flex justify-end"><Button type="submit">Salvar snapshot</Button></div>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <Card>
          <CardHeader><CardTitle>Reservas importadas</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reserveItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma reserva importada.</p> : reserveItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.name}</strong><span>{formatCurrencyFromCents(item.currentValueCents)}</span></div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>AÃ§Ãµes</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {stockItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma posiÃ§Ã£o em aÃ§Ãµes importada.</p> : stockItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.ticker}</strong><span>{formatCurrencyFromCents(item.currentCents)}</span></div>
                <div className="text-xs text-[var(--muted-foreground)]">{item.fullName}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Cripto</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {cryptoItems.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhuma posiÃ§Ã£o cripto importada.</p> : cryptoItems.map((item) => (
              <div key={item.id} className="rounded-2xl border border-[var(--border)] p-3 text-sm">
                <div className="flex items-center justify-between"><strong>{item.name}</strong><span>{formatCurrencyFromCents(item.currentCents)}</span></div>
                <div className="text-xs text-[var(--muted-foreground)]">Quantidade: {item.quantity}</div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>HistÃ³rico manual</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--muted-foreground)]">
                    <th className="px-2 py-2">MÃªs</th>
                    <th className="px-2 py-2">Reservas</th>
                    <th className="px-2 py-2">Investimentos</th>
                    <th className="px-2 py-2">DÃ­vidas</th>
                    <th className="px-2 py-2">Fonte</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-t border-[var(--border)]">
                      <td className="px-2 py-3">{item.month}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.reservesCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.investmentsCents)}</td>
                      <td className="px-2 py-3">{formatCurrencyFromCents(item.debtsCents)}</td>
                      <td className="px-2 py-3">{item.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState title="Nenhum snapshot manual" description="O resumo acima continua funcional com base importada e liquidez atual das contas." />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\(workspace)\recurring\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { createRecurringRuleAction, materializeAllRulesAction, settleOccurrenceAction } from "@/features/recurring/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listRecurringRules } from "@/services/recurring.service";

export default function RecurringPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const rules = listRecurringRules();

  return (
    <>
      <PageHeader
        title="Recorrências e contas fixas"
        description="Regras geram ocorrências futuras controladas. O histórico realizado não é corrompido quando a regra muda."
        actions={
          <form action={materializeAllRulesAction}>
            <Button type="submit">Gerar próximas ocorrências</Button>
          </form>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Nova regra</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createRecurringRuleAction} className="grid gap-4 md:grid-cols-3">
            <Input name="title" placeholder="Aluguel, internet, mesada..." />
            <Select name="accountId"><option value="">Selecione a conta</option>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select>
            <Input name="amount" placeholder="0,00" />
            <Select name="direction"><option value="expense">Despesa</option><option value="income">Receita</option></Select>
            <Select name="frequency"><option value="monthly">Mensal</option><option value="weekly">Semanal</option><option value="yearly">Anual</option></Select>
            <Select name="categoryId"><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select>
            <Input name="startsOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <Input name="nextRunOn" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            <div className="md:col-span-3"><Input name="notes" placeholder="Observações" /></div>
            <div className="md:col-span-3 flex justify-end"><Button type="submit">Criar regra</Button></div>
          </form>
        </CardContent>
      </Card>

      {rules.length > 0 ? (
        <div className="grid gap-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader>
                <CardTitle>{rule.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-3 text-sm text-[var(--muted-foreground)]">
                  {rule.frequency} · próxima geração em {rule.nextRunOn} · {formatCurrencyFromCents(rule.amountCents)}
                </p>
                <table>
                  <thead>
                    <tr>
                      <th>Data</th>
                      <th>Status</th>
                      <th>Direção</th>
                      <th>Valor</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rule.occurrences.map((occurrence) => (
                      <tr key={occurrence.id}>
                        <td>{occurrence.dueOn}</td>
                        <td>{occurrence.status}</td>
                        <td>{occurrence.direction}</td>
                        <td>{formatCurrencyFromCents(occurrence.amountCents)}</td>
                        <td>
                          {occurrence.status !== "posted" ? (
                            <form action={settleOccurrenceAction}>
                              <input type="hidden" name="occurrenceId" value={occurrence.id} />
                              <Button type="submit">Marcar como realizado</Button>
                            </form>
                          ) : null}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhuma regra recorrente"
          description="Esse vazio é legítimo quando nenhuma conta fixa ainda foi cadastrada. Depois de criar a regra, as ocorrências futuras aparecem aqui."
        />
      )}
    </>
  );
}
```

## `app\(workspace)\settings\page.tsx`
```tsx
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateSettingsAction } from "@/features/settings/actions";
import { ensureSettings } from "@/services/settings.service";

export default function SettingsPage() {
  const settings = ensureSettings();

  return (
    <>
      <PageHeader title="ConfiguraÃ§Ãµes" description="PreferÃªncias gerais, horizonte de projeÃ§Ã£o e orientaÃ§Ãµes prÃ¡ticas de backup local." />
      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>PreferÃªncias do sistema</CardTitle>
            <CardDescription>Essas definiÃ§Ãµes afetam onboarding, importaÃ§Ã£o assistida e visÃ£o futura.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateSettingsAction} className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm md:col-span-2">
                <span>Nome de exibiÃ§Ã£o</span>
                <Input name="userDisplayName" defaultValue={settings.userDisplayName} />
              </label>
              <label className="grid gap-2 text-sm">
                <span>Moeda base</span>
                <Select name="baseCurrency" defaultValue={settings.baseCurrency}>
                  <option value="BRL">BRL</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Locale</span>
                <Select name="locale" defaultValue={settings.locale}>
                  <option value="pt-BR">pt-BR</option>
                  <option value="en-US">en-US</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Tema</span>
                <Select name="themePreference" defaultValue={settings.themePreference}>
                  <option value="system">Sistema</option>
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </Select>
              </label>
              <label className="grid gap-2 text-sm">
                <span>Horizonte futuro padrÃ£o (meses)</span>
                <Input name="projectionMonths" type="number" min={1} max={24} defaultValue={String(settings.projectionMonths)} />
              </label>
              <div className="md:col-span-2 flex justify-end">
                <Button type="submit">Salvar configuraÃ§Ãµes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Backup local</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>O banco principal mora em <code>data/aurea-finance.sqlite</code>.</p>
            <p>Para backup manual, feche o app e copie esse arquivo para outra pasta, pendrive ou nuvem.</p>
            <p>TambÃ©m existe o script <code>pnpm db:backup</code>, que cria uma cÃ³pia versionada em <code>backups/</code>.</p>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-foreground">
              <div className="text-sm"><strong>Onboarding concluÃ­do:</strong> {settings.isOnboarded ? "sim" : "nÃ£o"}</div>
              <div className="mt-1 text-sm"><strong>Modo atual:</strong> local-first com SQLite</div>
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
```

## `app\(workspace)\transactions\page.tsx`
```tsx
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/features/transactions/transaction-form";
import { deleteTransactionAction } from "@/features/transactions/actions";
import { formatCurrencyFromCents } from "@/lib/currency";
import { listAccounts } from "@/services/accounts.service";
import { listCategories } from "@/services/categories.service";
import { listTransactions } from "@/services/transactions.service";

export default function TransactionsPage() {
  const accounts = listAccounts();
  const categories = listCategories();
  const transactions = listTransactions();

  return (
    <>
      <PageHeader
        title="Transações"
        description="Lançamentos manuais, previstos, realizados e ajustes. Transferências não entram aqui como receita ou despesa líquida."
      />
      <TransactionForm
        accounts={accounts.map((row) => ({ id: row.id, name: row.name }))}
        categories={categories.map((row) => ({ id: row.id, name: row.name }))}
      />
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Direção</th>
                  <th>Status</th>
                  <th>Valor</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.occurredOn}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.direction}</td>
                    <td>{transaction.status}</td>
                    <td>{formatCurrencyFromCents(transaction.amountCents)}</td>
                    <td>
                      <form
                        action={async () => {
                          "use server";
                          await deleteTransactionAction(transaction.id);
                        }}
                      >
                        <Button type="submit" className="h-8 px-3 text-xs">
                          Excluir
                        </Button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState
              title="Nenhuma transação lançada"
              description="Esse vazio é legítimo quando a base ainda não recebeu lançamentos. Depois do primeiro lançamento ou da importação, o histórico aparece aqui."
            />
          )}
        </CardContent>
      </Card>
    </>
  );
}
```

## `app\api\import\analyze\route.ts`
```typescript
import { NextResponse } from "next/server";
import { inventoryWorkbook } from "@/features/import/services/inventory";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const inventory = inventoryWorkbook(buffer);

  return NextResponse.json(inventory);
}
```

## `app\error.tsx`
```tsx
"use client";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="space-y-4 rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-red-200">
      <div>
        <h2 className="text-xl font-semibold">Algo saiu do esperado</h2>
        <p className="mt-2 text-sm text-red-100/80">{error.message || "Falha inesperada ao renderizar a pÃ¡gina."}</p>
      </div>
      <button
        type="button"
        onClick={reset}
        className="inline-flex h-10 items-center justify-center rounded-2xl bg-white/10 px-4 text-sm font-medium text-white"
      >
        Tentar novamente
      </button>
    </div>
  );
}
```

## `app\import\actions.ts`
```typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { expectedCsvFiles, importCsvContents, renderImportSummary, type ImportRunResult } from "@/services/csv-import.service";

export type ImportActionState = ImportRunResult & {
  summaryText?: string;
  expectedFiles: string[];
};

export async function importCsvFiles(_prevState: ImportActionState, formData: FormData): Promise<ImportActionState> {
  try {
    const uploads = formData.getAll("files").filter((item): item is File => item instanceof File);
    const files: Array<{ name: string; content: string }> = [];
    for (const file of uploads) {
      files.push({ name: file.name, content: await file.text() });
    }
    const result = await importCsvContents(files);
    revalidatePath("/import");
    revalidatePath("/dashboard");
    revalidatePath("/accounts");
    revalidatePath("/transactions");
    revalidatePath("/cards");
    revalidatePath("/bills");
    revalidatePath("/net-worth");
    revalidatePath("/future");
    revalidateTag("cashflow");
    return { ...result, summaryText: renderImportSummary(result), expectedFiles: expectedCsvFiles() };
  } catch (error) {
    return {
      success: false,
      files: [],
      summary: {},
      error: error instanceof Error ? error.message : "Falha ao importar os CSVs.",
      expectedFiles: expectedCsvFiles()
    };
  }
}
```

## `app\layout.tsx`
```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AppShell } from "@/components/app-shell";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: "App financeiro pessoal local-first, premium e solo-friendly."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

## `app\loading.tsx`
```tsx
export default function GlobalLoading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 text-sm text-[var(--muted-foreground)]">
      Carregando Aurea Financeâ€¦
    </div>
  );
}
```

## `app\monthly-closing\page.tsx`
```tsx
import { redirect } from "next/navigation";

export default function MonthlyClosingRedirectPage() {
  redirect("/closings");
}
```

## `app\not-found.tsx`
```tsx
export default function NotFound() {
  return <div className="p-10 text-center text-sm text-[var(--muted-foreground)]">Página não encontrada.</div>;
}
```

## `app\onboarding\page.tsx`
```tsx
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listCategories } from "@/services/categories.service";
import { ensureSettings } from "@/services/settings.service";
import { getMoneyOnboardingDefaults } from "@/services/money-bootstrap.service";

export default function OnboardingPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const settings = ensureSettings();
  const categories = listCategories().map((category) => ({ id: category.id, name: category.name }));
  const moneyDefaults = getMoneyOnboardingDefaults();
  const requestedMode = typeof searchParams?.mode === "string" ? searchParams.mode : "money";
  const mode = requestedMode === "manual" ? "manual" : "money";

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-6 py-10">
      <PageHeader
        title="Primeiro acesso"
        description="O Aurea Finance pode nascer manualmente ou jÃ¡ carregando contexto Ãºtil da sua planilha Money."
        actions={
          <div className="flex flex-wrap gap-3">
            <Link href="/onboarding?mode=money" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
              Usar a Money
            </Link>
            <Link href="/onboarding?mode=manual" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
              Configurar manualmente
            </Link>
          </div>
        }
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className={mode === "money" ? "border-[var(--primary)]" : ""}>
          <CardHeader>
            <CardTitle className="text-base">ComeÃ§ar com a Money</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>PrÃ©-preenche contas, cartÃµes, patrimÃ´nio, compromissos fixos e leva vocÃª para a central de migraÃ§Ã£o assistida.</p>
            <p>Ideal para fazer o app nascer com contexto real desde o primeiro uso.</p>
          </CardContent>
        </Card>
        <Card className={mode === "manual" ? "border-[var(--primary)]" : ""}>
          <CardHeader>
            <CardTitle className="text-base">Configurar manualmente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>Fluxo mais enxuto para montar a base a partir do zero, pulando o que for opcional.</p>
            <p>Depois vocÃª continua podendo importar dados histÃ³ricos pela tela /import.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Seu estado atual</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>UsuÃ¡rio atual: {settings.userDisplayName}</p>
            <p>Moeda base: {settings.baseCurrency}</p>
            <p>Locale: {settings.locale}</p>
            <p>Horizonte futuro: {settings.projectionMonths} meses</p>
          </CardContent>
        </Card>
      </section>

      <OnboardingWizard
        categories={categories}
        initialSettings={{
          userDisplayName: mode === "money" ? moneyDefaults.initialSettings.userDisplayName : settings.userDisplayName,
          baseCurrency: mode === "money" ? moneyDefaults.initialSettings.baseCurrency : settings.baseCurrency,
          locale: mode === "money" ? moneyDefaults.initialSettings.locale : settings.locale,
          themePreference: settings.themePreference,
          projectionMonths: mode === "money" ? moneyDefaults.initialSettings.projectionMonths : settings.projectionMonths
        }}
        mode={mode}
        dataset={moneyDefaults.dataset}
      />
    </div>
  );
}
```

## `app\page.tsx`
```tsx
import { redirect } from "next/navigation";
import { ensureSettings } from "@/services/settings.service";

export default function HomePage() {
  const settings = ensureSettings();
  redirect(settings.isOnboarded ? "/dashboard" : "/onboarding?mode=money");
}
```

## `features\accounts\account-form.tsx`
```tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createAccountAction } from "@/features/accounts/actions";
import { accountCreateSchema, type AccountCreateInput } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function AccountForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<AccountCreateInput>({
    resolver: zodResolver(accountCreateSchema),
    defaultValues: { name: "", type: "checking", institution: "", openingBalance: "0,00", color: "#5b7cfa", includeInNetWorth: true, notes: "" }
  });
  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createAccountAction(values);
      form.reset();
      router.refresh();
    });
  });
  return (
    <Card>
      <CardHeader><CardTitle>Nova conta</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2 md:col-span-2"><Label>Nome</Label><Input {...form.register("name")} placeholder="Banco Principal" /></div>
          <div className="space-y-2"><Label>Tipo</Label><Select {...form.register("type")}><option value="checking">Conta corrente</option><option value="savings">Poupança</option><option value="cash">Carteira</option><option value="investment">Investimento</option><option value="reserve">Reserva</option><option value="credit_card_settlement">Conta pagadora de fatura</option></Select></div>
          <div className="space-y-2"><Label>Instituição</Label><Input {...form.register("institution")} placeholder="Banco do Brasil" /></div>
          <div className="space-y-2"><Label>Saldo inicial</Label><Input {...form.register("openingBalance")} placeholder="0,00" /></div>
          <div className="space-y-2"><Label>Cor</Label><Input type="color" {...form.register("color")} /></div>
          <div className="space-y-2 md:col-span-2"><Label>Notas</Label><Input {...form.register("notes")} placeholder="Observações úteis" /></div>
          <div className="md:col-span-2 flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar conta"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
```

## `features\accounts\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { accountCreateSchema, type AccountCreateInput } from "@/lib/validation";
import { createAccount } from "@/services/accounts.service";

export async function createAccountAction(input: AccountCreateInput) {
  createAccount(accountCreateSchema.parse(input));
  revalidatePath("/accounts");
  revalidatePath("/dashboard");
}
```

## `features\accounts\queries.ts`
```typescript
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, transactions } from "@/db/schema";
import { calculateBalance, calculateProjectedBalance } from "@/lib/finance";

export function getAccountsSnapshot() {
  const accountRows = db.select().from(accounts).all();
  const snapshotRows = db.select().from(accountBalanceSnapshots).orderBy(desc(accountBalanceSnapshots.snapshotDate)).all();
  const transactionRows = db.select().from(transactions).all();

  return accountRows.map((account) => {
    const relatedTransactions = transactionRows.filter((transaction) => transaction.accountId === account.id);
    const latestSnapshot = snapshotRows.find((snapshot) => snapshot.accountId === account.id) ?? null;
    return {
      ...account,
      realizedBalanceCents: calculateBalance(account.openingBalanceCents, relatedTransactions),
      projectedBalanceCents: calculateProjectedBalance(account.openingBalanceCents, relatedTransactions),
      latestSnapshot
    };
  });
}
```

## `features\cards\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { cardPurchaseCreateSchema, creditCardCreateSchema } from "@/lib/validation";
import { createCardPurchase, createCreditCard, markBillPaid } from "@/services/cards.service";

export async function createCreditCardAction(formData: FormData) {
  createCreditCard(creditCardCreateSchema.parse({
    name: formData.get("name"),
    brand: formData.get("brand"),
    network: formData.get("network"),
    limitAmount: formData.get("limitAmount"),
    closeDay: formData.get("closeDay"),
    dueDay: formData.get("dueDay"),
    settlementAccountId: formData.get("settlementAccountId")
  }));
  revalidatePath("/cards");
  revalidatePath("/dashboard");
}

export async function createCardPurchaseAction(formData: FormData) {
  createCardPurchase(cardPurchaseCreateSchema.parse({
    creditCardId: formData.get("creditCardId"),
    description: formData.get("description"),
    purchaseDate: formData.get("purchaseDate"),
    amount: formData.get("amount"),
    installmentCount: formData.get("installmentCount"),
    categoryId: formData.get("categoryId") || undefined,
    notes: formData.get("notes")
  }));
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/dashboard");
}

export async function markBillPaidAction(formData: FormData) {
  markBillPaid(String(formData.get("billId") ?? ""));
  revalidatePath("/bills");
  revalidatePath("/cards");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}
```

## `features\cards\queries.ts`
```typescript
import { desc } from "drizzle-orm";
import { db } from "@/db/client";
import { billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards } from "@/db/schema";

export function getCardsSnapshot() {
  const cards = db.select().from(creditCards).all();
  const bills = db.select().from(creditCardBills).orderBy(desc(creditCardBills.billMonth)).all();
  const purchases = db.select().from(cardPurchases).orderBy(desc(cardPurchases.purchaseDate)).all();
  const installments = db.select().from(cardInstallments).all();
  const entries = db.select().from(billEntries).all();

  return cards.map((card) => {
    const cardBills = bills.filter((bill) => bill.creditCardId === card.id);
    const openBill = cardBills.find((bill) => bill.status === "open") ?? null;
    const cardPurchasesRows = purchases.filter((purchase) => purchase.creditCardId === card.id);
    const unpaidCents = cardBills.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
    const availableLimitCents = Math.max(card.limitTotalCents - unpaidCents, 0);
    const futureInstallments = installments.filter((installment) => {
      if (installment.status === "paid") return false;
      const purchase = cardPurchasesRows.find((row) => row.id === installment.purchaseId);
      return purchase?.creditCardId === card.id;
    });
    return {
      ...card,
      availableLimitCents,
      bills: cardBills,
      openBill,
      purchases: cardPurchasesRows,
      futureInstallments,
      entries: entries.filter((entry) => cardBills.some((bill) => bill.id === entry.billId))
    };
  });
}
```

## `features\categories\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { createCategory, createTag } from "@/services/categories.service";

function parseCategoryKind(value: FormDataEntryValue | null): "income" | "expense" | "neutral" {
  return value === "income" || value === "neutral" ? value : "expense";
}

export async function createCategoryAction(formData: FormData) {
  createCategory(String(formData.get("name") ?? ""), parseCategoryKind(formData.get("kind")), String(formData.get("color") ?? "#7c83ff"));
  revalidatePath("/categories");
  revalidatePath("/transactions");
}

export async function createTagAction(formData: FormData) {
  createTag(String(formData.get("name") ?? ""));
  revalidatePath("/categories");
}
```

## `features\closings\queries.ts`
```typescript
import { db } from "@/db/client";
import { creditCardBills, monthlyClosings, transactions } from "@/db/schema";
import { desc } from "drizzle-orm";

export function getMonthlyClosingsPageData() {
  const closings = db
    .select()
    .from(monthlyClosings)
    .orderBy(desc(monthlyClosings.month), desc(monthlyClosings.updatedAt))
    .all();

  const latestTransactions = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.occurredOn), desc(transactions.createdAt))
    .all()
    .slice(0, 12);

  const openBills = db
    .select()
    .from(creditCardBills)
    .orderBy(desc(creditCardBills.billMonth), desc(creditCardBills.dueOn))
    .all()
    .filter((bill) => bill.status !== "paid")
    .slice(0, 12);

  return {
    closings,
    latestTransactions,
    openBills
  };
}
```

## `features\dashboard\queries.ts`
```typescript
import { format } from "date-fns";
import { listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { listBills, getCardsSummary } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";

function debug(step: string, payload?: unknown) {
  console.log(`[dashboard][${step}]`, payload ?? "ok");
}

export function getDashboardPageData() {
  try {
    debug("A:start");

    const accounts = listAccountsWithBalances();
    debug("B:accounts", { count: accounts.length });

    const cards = getCardsSummary();
    debug("C:cards", { count: cards.length });

    const recentTransactions = listTransactions({ limit: 10 });
    debug("D:recentTransactions", { count: recentTransactions.length });

    const upcomingBills = listBills()
      .filter((bill) => bill.status !== "paid")
      .slice(0, 6);
    debug("E:upcomingBills", { count: upcomingBills.length });

    const recurring = listRecurringRules()
      .flatMap((rule) => rule.occurrences)
      .filter((occurrence) => occurrence.status === "scheduled")
      .slice(0, 8);
    debug("F:recurring", { count: recurring.length });

    const month = format(new Date(), "yyyy-MM");
    const monthTransactions = listTransactions({ month });
    debug("G:monthTransactions", { month, count: monthTransactions.length });

    const netWorth = getCurrentNetWorthSummary();
    debug("H:netWorth", { month: netWorth.month });

    return {
      month,
      accounts,
      cards,
      recentTransactions,
      upcomingBills,
      recurring,
      netWorth,
      consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
      consolidatedProjectedCents:
        accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0) -
        upcomingBills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0),
      incomeMonthCents: monthTransactions
        .filter((row) => row.direction === "income")
        .reduce((sum, row) => sum + row.amountCents, 0),
      expenseMonthCents: monthTransactions
        .filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction))
        .reduce((sum, row) => sum + row.amountCents, 0),
      chartSeries: accounts.map((account) => ({
        name: account.name,
        current: account.currentBalanceCents / 100,
        projected: account.projectedBalanceCents / 100
      }))
    };
  } catch (error) {
    console.error("[dashboard][ERROR]", error);
    throw error;
  }
}
```

## `features\import\actions.ts`
```typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { bootstrapMoneyIntoDatabase } from "@/services/money-bootstrap.service";
import { commitBatch, ingestWorkbook, saveSheetMapping, validateBatch } from "@/services/import.service";
import type { ImportSheetTarget } from "@/types/domain";

function revalidateImportSurface() {
  revalidatePath("/import");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/transactions");
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/closings");
  revalidatePath("/future");
  revalidatePath("/net-worth");
  revalidatePath("/settings");
  revalidateTag("cashflow");
}

export async function bootstrapMoneyImportAction() {
  bootstrapMoneyIntoDatabase();
  revalidateImportSurface();
}

export async function uploadWorkbookAction(formData: FormData) {
  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("Arquivo invÃ¡lido.");
  await ingestWorkbook(file.name, await file.arrayBuffer());
  revalidatePath("/import");
}

export async function saveSheetMappingAction(formData: FormData) {
  saveSheetMapping(
    String(formData.get("batchId") ?? ""),
    String(formData.get("sheetName") ?? ""),
    String(formData.get("targetEntity") ?? "ignore") as ImportSheetTarget,
    JSON.parse(String(formData.get("columnMapJson") ?? "{}")) as Record<string, string>
  );
  revalidatePath("/import");
}

export async function validateBatchAction(formData: FormData) {
  validateBatch(String(formData.get("batchId") ?? ""));
  revalidatePath("/import");
}

export async function commitBatchAction(formData: FormData) {
  commitBatch(String(formData.get("batchId") ?? ""), String(formData.get("dryRun") ?? "false") === "true");
  revalidateImportSurface();
}
```

## `features\import\services\dry-run.ts`
```typescript
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { importBatches, importIssues, importRawRows } from "@/db/schema";

export function buildDryRunReport(batchId: string) {
  const batch = db.select().from(importBatches).where(eq(importBatches.id, batchId)).get();
  const rows = db.select().from(importRawRows).where(eq(importRawRows.batchId, batchId)).all();
  const issues = db.select().from(importIssues).where(eq(importIssues.batchId, batchId)).all();

  if (!batch) throw new Error("Lote de importação não encontrado.");

  const groupedBySheet = rows.reduce<Record<string, number>>((acc, row) => {
    acc[row.sheetName] = (acc[row.sheetName] ?? 0) + 1;
    return acc;
  }, {});

  return {
    batch,
    totals: {
      rows: rows.length,
      errors: issues.filter((i) => i.severity === "error").length,
      warnings: issues.filter((i) => i.severity === "warning").length
    },
    groupedBySheet
  };
}
```

## `features\import\services\inventory.ts`
```typescript
import * as XLSX from "xlsx";
import { detectEntityFromSheet, type SheetInventory } from "@/lib/domain/import-mapping";

export type WorkbookInventory = {
  sheets: Array<SheetInventory & { detectedEntity: string }>;
};

export function inventoryWorkbook(buffer: Buffer): WorkbookInventory {
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });

  const sheets = workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Array<string | number | null>>(sheet, { header: 1, raw: false });
    const rowCount = rows.length;
    const columnCount = rows.reduce((max, row) => Math.max(max, row.length), 0);
    const sampleHeaders = (rows[0] ?? []).map((cell) => String(cell ?? "")).filter(Boolean).slice(0, 12);
    const inventory: SheetInventory = { name: sheetName, rowCount, columnCount, sampleHeaders };

    return {
      ...inventory,
      detectedEntity: detectEntityFromSheet(inventory)
    };
  });

  return { sheets };
}
```

## `features\import\services\stage-workbook.ts`
```typescript
import { inventoryWorkbook } from "@/features/import/services/inventory";
import { ingestWorkbook } from "@/services/import.service";

export async function stageWorkbookImport(params: {
  buffer: Buffer;
  fileName: string;
  sourceLabel?: string;
}) {
  const batchId = await ingestWorkbook(params.fileName, params.buffer.buffer.slice(params.buffer.byteOffset, params.buffer.byteOffset + params.buffer.byteLength));
  const inventory = inventoryWorkbook(params.buffer);
  return {
    batchId,
    inventory,
    sourceLabel: params.sourceLabel ?? null
  };
}
```

## `features\monthly-closing\actions.ts`
```typescript
"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { runMonthlyClosing } from "@/services/monthly-closing.service";

export async function runMonthlyClosingAction(formData: FormData) {
  runMonthlyClosing(String(formData.get("month") ?? new Date().toISOString().slice(0, 7)));
  revalidatePath("/closings");
  revalidatePath("/dashboard");
  revalidatePath("/future");
  revalidateTag("cashflow");
}
```

## `features\net-worth\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { upsertNetWorthSummary } from "@/services/net-worth.service";

export async function saveNetWorthAction(formData: FormData) {
  upsertNetWorthSummary({
    month: String(formData.get("month") ?? new Date().toISOString().slice(0, 7)),
    reserves: String(formData.get("reserves") ?? "0"),
    investments: String(formData.get("investments") ?? "0"),
    debts: String(formData.get("debts") ?? "0"),
    notes: String(formData.get("notes") ?? "")
  });
  revalidatePath("/net-worth");
  revalidatePath("/dashboard");
}
```

## `features\net-worth\queries.ts`
```typescript
import { db } from "@/db/client";
import { netWorthSummaries } from "@/db/schema";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";
import { desc } from "drizzle-orm";

export function getNetWorthPageData() {
  const summary = getCurrentNetWorthSummary();
  const history = db
    .select()
    .from(netWorthSummaries)
    .orderBy(desc(netWorthSummaries.month), desc(netWorthSummaries.updatedAt))
    .all();

  return {
    summary,
    history
  };
}
```

## `features\onboarding\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { completeFinancialOnboarding, type FinancialOnboardingPayload } from "@/services/onboarding.service";

function parseJsonField<T>(formData: FormData, key: string, fallback: T): T {
  const raw = formData.get(key);
  if (typeof raw !== "string" || !raw.trim()) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function parseThemePreference(value: FormDataEntryValue | null): FinancialOnboardingPayload["themePreference"] {
  return value === "light" || value === "dark" || value === "system" ? value : "system";
}

function parseDestination(value: FormDataEntryValue | null): FinancialOnboardingPayload["destination"] {
  return value === "import" ? "import" : "dashboard";
}

function parseSource(value: FormDataEntryValue | null): FinancialOnboardingPayload["source"] {
  return value === "money" ? "money" : "manual";
}

export async function completeFinancialOnboardingAction(formData: FormData) {
  const payload: FinancialOnboardingPayload = {
    source: parseSource(formData.get("source")),
    userDisplayName: String(formData.get("userDisplayName") ?? "VocÃª"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6),
    themePreference: parseThemePreference(formData.get("themePreference")),
    destination: parseDestination(formData.get("destination")),
    accounts: parseJsonField(formData, "accountsJson", []),
    cards: parseJsonField(formData, "cardsJson", []),
    netWorth: parseJsonField(formData, "netWorthJson", {
      month: new Date().toISOString().slice(0, 7),
      reserves: "0",
      investments: "0",
      debts: "0",
      notes: ""
    }),
    recurring: parseJsonField(formData, "recurringJson", [])
  };

  const destination = completeFinancialOnboarding(payload);

  revalidatePath("/");
  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
  revalidatePath("/cards");
  revalidatePath("/bills");
  revalidatePath("/recurring");
  revalidatePath("/calendar");
  revalidatePath("/closings");
  revalidatePath("/future");
  revalidatePath("/net-worth");
  revalidatePath("/settings");
  revalidatePath("/import");

  redirect(destination);
}
```

## `features\recurring\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { recurringRuleCreateSchema } from "@/lib/validation";
import { createRecurringRule, materializeAllRules, settleOccurrence } from "@/services/recurring.service";

export async function createRecurringRuleAction(formData: FormData) {
  createRecurringRule(recurringRuleCreateSchema.parse({
    title: formData.get("title"),
    accountId: formData.get("accountId"),
    direction: formData.get("direction"),
    amount: formData.get("amount"),
    startsOn: formData.get("startsOn"),
    nextRunOn: formData.get("nextRunOn"),
    frequency: formData.get("frequency"),
    categoryId: formData.get("categoryId") || undefined,
    notes: formData.get("notes")
  }));
  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}

export async function materializeAllRulesAction() {
  materializeAllRules();
  revalidatePath("/recurring");
  revalidatePath("/dashboard");
}

export async function settleOccurrenceAction(formData: FormData) {
  settleOccurrence(String(formData.get("occurrenceId") ?? ""));
  revalidatePath("/recurring");
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
```

## `features\recurring\queries.ts`
```typescript
import { db } from "@/db/client";
import { recurringOccurrences, recurringRules } from "@/db/schema";

export function getRecurringSnapshot() {
  const rules = db.select().from(recurringRules).all();
  const occurrences = db.select().from(recurringOccurrences).all();
  return rules.map((rule) => ({
    ...rule,
    occurrences: occurrences.filter((o) => o.ruleId === rule.id).slice(0, 12)
  }));
}
```

## `features\settings\actions.ts`
```typescript
"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { settingsUpdateSchema } from "@/lib/validation";
import { ensureSettings } from "@/services/settings.service";

export async function updateSettingsAction(formData: FormData) {
  ensureSettings();
  const parsed = settingsUpdateSchema.parse({
    userDisplayName: String(formData.get("userDisplayName") ?? "VocÃª"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    themePreference: String(formData.get("themePreference") ?? "system"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6)
  });

  db.update(settings).set({ ...parsed, updatedAt: nowTs() }).where(eq(settings.id, "main")).run();

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/future");
}

export async function completeOnboardingAction(formData: FormData) {
  ensureSettings();
  const parsed = settingsUpdateSchema.parse({
    userDisplayName: String(formData.get("userDisplayName") ?? "VocÃª"),
    baseCurrency: String(formData.get("baseCurrency") ?? "BRL"),
    locale: String(formData.get("locale") ?? "pt-BR"),
    themePreference: String(formData.get("themePreference") ?? "system"),
    projectionMonths: Number(formData.get("projectionMonths") ?? 6)
  });

  db.update(settings).set({ ...parsed, isOnboarded: true, updatedAt: nowTs() }).where(eq(settings.id, "main")).run();

  revalidatePath("/");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
```

## `features\settings\queries.ts`
```typescript
import { db } from "@/db/client";
import { settings } from "@/db/schema";

export function getSettingsSnapshot() {
  return db.select().from(settings).limit(1).get() ?? null;
}
```

## `features\transactions\actions.ts`
```typescript
"use server";

import { revalidatePath } from "next/cache";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import { createTransaction, deleteTransaction } from "@/services/transactions.service";

export async function createTransactionAction(input: TransactionCreateInput) {
  createTransaction(transactionCreateSchema.parse(input));
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}

export async function deleteTransactionAction(id: string) {
  deleteTransaction(id);
  revalidatePath("/transactions");
  revalidatePath("/dashboard");
  revalidatePath("/accounts");
}
```

## `features\transactions\queries.ts`
```typescript
import { db } from "@/db/client";
import { accounts, categories, transactions } from "@/db/schema";
import { asc, desc, eq } from "drizzle-orm";

export function getTransactionsPageData() {
  const accountOptions = db
    .select({ id: accounts.id, name: accounts.name })
    .from(accounts)
    .where(eq(accounts.isArchived, false))
    .orderBy(asc(accounts.sortOrder), asc(accounts.name))
    .all();

  const categoryOptions = db
    .select({ id: categories.id, name: categories.name })
    .from(categories)
    .orderBy(asc(categories.name))
    .all();

  const rows = db
    .select()
    .from(transactions)
    .orderBy(desc(transactions.occurredOn), desc(transactions.createdAt))
    .all();

  return {
    accounts: accountOptions,
    categories: categoryOptions,
    transactions: rows
  };
}
```

## `features\transactions\transaction-form.tsx`
```tsx
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTransactionAction } from "@/features/transactions/actions";
import { transactionCreateSchema, type TransactionCreateInput } from "@/lib/validation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function TransactionForm({ accounts, categories }: { accounts: { id: string; name: string }[]; categories: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const form = useForm<TransactionCreateInput>({
    resolver: zodResolver(transactionCreateSchema),
    defaultValues: { accountId: accounts[0]?.id ?? "", description: "", amount: "0,00", direction: "expense", status: "posted", occurredOn: new Date().toISOString().slice(0, 10), dueOn: new Date().toISOString().slice(0, 10), notes: "" }
  });
  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createTransactionAction(values);
      form.reset({ ...values, description: "", amount: "0,00", notes: "" });
      router.refresh();
    });
  });
  return (
    <Card>
      <CardHeader><CardTitle>Novo lançamento</CardTitle></CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" onSubmit={onSubmit}>
          <div className="space-y-2 xl:col-span-2"><Label>Descrição</Label><Input {...form.register("description")} placeholder="Mercado, aluguel, salário..." /></div>
          <div className="space-y-2"><Label>Conta</Label><Select {...form.register("accountId")}>{accounts.map((account) => <option key={account.id} value={account.id}>{account.name}</option>)}</Select></div>
          <div className="space-y-2"><Label>Valor</Label><Input {...form.register("amount")} placeholder="0,00" /></div>
          <div className="space-y-2"><Label>Direção</Label><Select {...form.register("direction")}><option value="expense">Despesa</option><option value="income">Receita</option><option value="adjustment">Ajuste</option></Select></div>
          <div className="space-y-2"><Label>Status</Label><Select {...form.register("status")}><option value="posted">Realizado</option><option value="scheduled">Projetado</option><option value="void">Ignorado</option></Select></div>
          <div className="space-y-2"><Label>Data</Label><Input type="date" {...form.register("occurredOn")} /></div>
          <div className="space-y-2"><Label>Categoria</Label><Select {...form.register("categoryId")}><option value="">Sem categoria</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</Select></div>
          <div className="space-y-2 xl:col-span-4"><Label>Notas</Label><Input {...form.register("notes")} placeholder="Observação opcional" /></div>
          <div className="xl:col-span-4 flex justify-end"><Button type="submit" disabled={pending}>{pending ? "Salvando..." : "Criar lançamento"}</Button></div>
        </form>
      </CardContent>
    </Card>
  );
}
```

## `services\accounts.service.ts`
```typescript
import { db } from "@/db/client";
import { accountBalanceSnapshots, accounts, transactions } from "@/db/schema";
import { calculateBalance, calculateProjectedBalance } from "@/lib/finance";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { asc, eq } from "drizzle-orm";
import type { AccountCreateInput } from "@/lib/validation";

export function listAccounts() {
  return db.select().from(accounts).where(eq(accounts.isArchived, false)).orderBy(asc(accounts.sortOrder), asc(accounts.name)).all();
}

export function listAccountsWithBalances() {
  return listAccounts().map((account) => {
    const related = db.select().from(transactions).where(eq(transactions.accountId, account.id)).all();
    return {
      ...account,
      currentBalanceCents: calculateBalance(account.openingBalanceCents, related),
      projectedBalanceCents: calculateProjectedBalance(account.openingBalanceCents, related)
    };
  });
}

export function createAccount(input: AccountCreateInput) {
  const now = nowTs();
  const slugBase = slugify(input.name);
  const exists = db.select().from(accounts).where(eq(accounts.slug, slugBase)).get();
  const id = uid("acc");
  const openingBalanceCents = parseCurrencyToCents(input.openingBalance);
  db.insert(accounts).values({
    id,
    name: input.name,
    slug: exists ? `${slugBase}-${now}` : slugBase,
    type: input.type,
    institution: input.institution ?? "",
    openingBalanceCents,
    color: input.color ?? "#5b7cfa",
    notes: input.notes ?? "",
    includeInNetWorth: input.includeInNetWorth ?? true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  db.insert(accountBalanceSnapshots).values({
    id: uid("snap"),
    accountId: id,
    snapshotDate: new Date().toISOString().slice(0, 10),
    balanceCents: openingBalanceCents,
    source: "opening_balance",
    createdAt: now
  }).run();
}
```

## `services\cards.service.ts`
```typescript
import { db } from "@/db/client";
import { billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards, transactions } from "@/db/schema";
import { generateInstallments } from "@/lib/finance";
import { isoMonth, nowTs } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { slugify, uid } from "@/lib/utils";
import { asc, desc, eq } from "drizzle-orm";
import type { CardPurchaseCreateInput, CreditCardCreateInput } from "@/lib/validation";

function ensureBill(creditCardId: string, billMonth: string, closesOn: string, dueOn: string) {
  const existing = db.select().from(creditCardBills).all().find((bill) => bill.creditCardId === creditCardId && bill.billMonth === billMonth);
  if (existing) return existing;
  const now = nowTs();
  const id = uid("bill");
  db.insert(creditCardBills).values({
    id,
    creditCardId,
    billMonth,
    closesOn,
    dueOn,
    totalAmountCents: 0,
    paidAmountCents: 0,
    status: "open",
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCardBills).where(eq(creditCardBills.id, id)).get()!;
}

export function listCreditCards() {
  return db.select().from(creditCards).where(eq(creditCards.isArchived, false)).orderBy(asc(creditCards.name)).all().map((card) => ({
    ...card,
    bills: db.select().from(creditCardBills).all().filter((bill) => bill.creditCardId === card.id).sort((a, b) => b.billMonth.localeCompare(a.billMonth)),
    purchases: db.select().from(cardPurchases).all().filter((purchase) => purchase.creditCardId === card.id).sort((a, b) => b.purchaseDate.localeCompare(a.purchaseDate))
  }));
}

export function getCardsSummary() {
  return listCreditCards().map((card) => {
    const usedCents = card.bills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0);
    return { ...card, usedCents, availableLimitCents: Math.max(card.limitTotalCents - usedCents, 0) };
  });
}

export function createCreditCard(input: CreditCardCreateInput) {
  const now = nowTs();
  const slugBase = slugify(input.name);
  const exists = db.select().from(creditCards).where(eq(creditCards.slug, slugBase)).get();
  db.insert(creditCards).values({
    id: uid("card"),
    name: input.name,
    slug: exists ? `${slugBase}-${now}` : slugBase,
    brand: input.brand ?? "",
    network: input.network ?? "",
    settlementAccountId: input.settlementAccountId,
    limitTotalCents: parseCurrencyToCents(input.limitAmount),
    closeDay: input.closeDay,
    dueDay: input.dueDay,
    color: "#111827",
    isArchived: false,
    createdAt: now,
    updatedAt: now
  }).run();
}

export function createCardPurchase(input: CardPurchaseCreateInput) {
  const card = db.select().from(creditCards).where(eq(creditCards.id, input.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const now = nowTs();
  const purchaseId = uid("purchase");
  const totalAmountCents = parseCurrencyToCents(input.amount);
  const plan = generateInstallments({
    purchaseDate: input.purchaseDate,
    totalAmountCents,
    installmentCount: input.installmentCount,
    closeDay: card.closeDay,
    dueDay: card.dueDay
  });
  const firstBill = ensureBill(input.creditCardId, plan[0].billMonth, plan[0].billClosedOn, plan[0].billDueOn);

  db.insert(cardPurchases).values({
    id: purchaseId,
    creditCardId: input.creditCardId,
    categoryId: input.categoryId ?? null,
    subcategoryId: null,
    firstBillId: firstBill.id,
    description: input.description,
    merchant: input.description,
    purchaseDate: input.purchaseDate,
    totalAmountCents,
    installmentCount: input.installmentCount,
    notes: input.notes ?? "",
    createdAt: now,
    updatedAt: now
  }).run();

  for (const installment of plan) {
    const bill = ensureBill(input.creditCardId, installment.billMonth, installment.billClosedOn, installment.billDueOn);
    const installmentId = uid("inst");
    db.insert(cardInstallments).values({
      id: installmentId,
      purchaseId,
      billId: bill.id,
      installmentNumber: installment.installmentNumber,
      totalInstallments: input.installmentCount,
      amountCents: installment.amountCents,
      status: "billed",
      dueOn: installment.billDueOn,
      createdAt: now
    }).run();
    db.insert(billEntries).values({
      id: uid("entry"),
      billId: bill.id,
      entryType: "installment",
      description: `${input.description} (${installment.installmentNumber}/${input.installmentCount})`,
      amountCents: installment.amountCents,
      purchaseId,
      installmentId,
      createdAt: now
    }).run();
    db.update(creditCardBills)
      .set({ totalAmountCents: bill.totalAmountCents + installment.amountCents, updatedAt: now })
      .where(eq(creditCardBills.id, bill.id))
      .run();
  }
}

export function listBills() {
  return db.select().from(creditCardBills).orderBy(desc(creditCardBills.billMonth), desc(creditCardBills.dueOn)).all().map((bill) => ({
    ...bill,
    entries: db.select().from(billEntries).all().filter((entry) => entry.billId === bill.id)
  }));
}

export function markBillPaid(billId: string) {
  const bill = db.select().from(creditCardBills).where(eq(creditCardBills.id, billId)).get();
  if (!bill) throw new Error("Fatura não encontrada.");
  const card = db.select().from(creditCards).where(eq(creditCards.id, bill.creditCardId)).get();
  if (!card) throw new Error("Cartão não encontrado.");
  const now = nowTs();
  const transactionId = uid("txn");
  db.insert(transactions).values({
    id: transactionId,
    accountId: card.settlementAccountId,
    categoryId: null,
    subcategoryId: null,
    direction: "bill_payment",
    status: "posted",
    description: `Pagamento da fatura ${card.name} ${bill.billMonth}`,
    counterparty: card.name,
    amountCents: bill.totalAmountCents - bill.paidAmountCents,
    occurredOn: bill.dueOn,
    dueOn: bill.dueOn,
    competenceMonth: isoMonth(bill.dueOn),
    notes: "Pagamento de fatura gerado automaticamente.",
    isProjected: false,
    createdAt: now,
    updatedAt: now
  }).run();
  db.update(creditCardBills)
    .set({ paidAmountCents: bill.totalAmountCents, status: "paid", settlementTransactionId: transactionId, updatedAt: now })
    .where(eq(creditCardBills.id, bill.id))
    .run();
}
```

## `services\cashflow.service.ts`
```typescript
import { unstable_cache } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, billEntries, cardInstallments, cardPurchases, creditCardBills, creditCards, recurringOccurrences, recurringRules } from "@/db/schema";
import { addDaysIso, addMonthsIso, todayIso } from "@/lib/dates";
import { materializeOccurrences, type TransactionDirection } from "@/lib/finance";
import { listAccountsWithBalances } from "@/services/accounts.service";

export type CashflowEvent = {
  date: string;
  type: "fatura_cartao" | "parcela_cartao" | "recorrencia_despesa" | "recorrencia_receita" | "manual";
  description: string;
  amount_cents: number;
  direction: "entrada" | "saida";
  account_name: string;
  card_name?: string;
  responsible?: string;
  balance_after_cents?: number;
};

export type CashflowDay = {
  date: string;
  balance_cents: number;
  events: CashflowEvent[];
  total_income_cents: number;
  total_expense_cents: number;
  is_negative: boolean;
};

function firstBusinessDayAfter12(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 13);
  while (date.getDay() === 0 || date.getDay() === 6) date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
}

function normalizeRuleDirection(value: string): TransactionDirection {
  return ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"].includes(value) ? (value as TransactionDirection) : "expense";
}

function normalizeRuleFrequency(value: string): "weekly" | "monthly" | "yearly" {
  return value === "weekly" || value === "yearly" ? value : "monthly";
}

function expandRule(rule: typeof recurringRules.$inferSelect, endDate: string) {
  if (rule.notes?.includes("FIRST_BUSINESS_DAY_AFTER_12")) {
    const out: string[] = [];
    let cursor = new Date(rule.nextRunOn);
    const end = new Date(endDate);
    while (cursor <= end) {
      out.push(firstBusinessDayAfter12(cursor.getFullYear(), cursor.getMonth()));
      cursor = new Date(addMonthsIso(cursor.toISOString().slice(0, 10), 1));
    }
    return out;
  }
  return materializeOccurrences({
    nextRunOn: rule.nextRunOn,
    endsOn: rule.endsOn,
    frequency: normalizeRuleFrequency(rule.frequency),
    amountCents: rule.amountCents,
    direction: normalizeRuleDirection(rule.direction)
  }, 4)
    .map((item) => item.dueOn)
    .filter((date) => date <= endDate);
}

async function computeProjectedCashflow(days: number) {
  const currentAccounts = listAccountsWithBalances();
  const initialBalanceCents = currentAccounts.reduce((sum, account) => sum + account.currentBalanceCents, 0);
  const accountMap = new Map(db.select().from(accounts).all().map((row) => [row.id, row]));
  const cardMap = new Map(db.select().from(creditCards).all().map((row) => [row.id, row]));
  const today = todayIso();
  const end = addDaysIso(today, days - 1);
  const events: CashflowEvent[] = [];

  const bills = db.select().from(creditCardBills).all().filter((bill) => bill.status !== "paid" && bill.dueOn >= today && bill.dueOn <= end);
  const billIdsInRange = new Set(bills.map((bill) => bill.id));

  for (const bill of bills) {
    const card = cardMap.get(bill.creditCardId);
    const account = card ? accountMap.get(card.settlementAccountId) : null;
    events.push({
      date: bill.dueOn,
      type: "fatura_cartao",
      description: `Fatura ${card?.name ?? "CartÃ£o"} ${bill.billMonth}`,
      amount_cents: Math.max(bill.totalAmountCents - bill.paidAmountCents, 0),
      direction: "saida",
      account_name: account?.name ?? "Conta de pagamento",
      card_name: card?.name
    });
  }

  const installments = db.select().from(cardInstallments).all().filter((item) => item.dueOn >= today && item.dueOn <= end && !billIdsInRange.has(item.billId));
  for (const installment of installments) {
    const purchase = db.select().from(cardPurchases).where(eq(cardPurchases.id, installment.purchaseId)).get();
    if (!purchase) continue;
    const card = cardMap.get(purchase.creditCardId);
    const account = card ? accountMap.get(card.settlementAccountId) : null;
    events.push({
      date: installment.dueOn,
      type: "parcela_cartao",
      description: `${purchase.description} (${installment.installmentNumber}/${installment.totalInstallments})`,
      amount_cents: installment.amountCents,
      direction: "saida",
      account_name: account?.name ?? "Conta de pagamento",
      card_name: card?.name,
      responsible: purchase.responsible || undefined
    });
  }

  const rules = db.select().from(recurringRules).all().filter((rule) => rule.isActive);
  const occurrencesByRule = db.select().from(recurringOccurrences).all();
  for (const rule of rules) {
    const account = accountMap.get(rule.accountId);
    const generatedDates = expandRule(rule, end).filter((date) => date >= today);
    for (const dueOn of generatedDates) {
      const existing = occurrencesByRule.find((item) => item.ruleId === rule.id && item.dueOn === dueOn);
      if (existing?.status === "posted") continue;
      if (rule.notes?.includes("CARD_RECURRING")) {
        const card = db.select().from(creditCards).all().find((row) => row.settlementAccountId === rule.accountId);
        events.push({
          date: dueOn,
          type: rule.direction === "income" ? "recorrencia_receita" : "recorrencia_despesa",
          description: rule.title,
          amount_cents: rule.amountCents,
          direction: rule.direction === "income" ? "entrada" : "saida",
          account_name: account?.name ?? "Conta",
          card_name: card?.name
        });
        continue;
      }
      events.push({
        date: dueOn,
        type: rule.direction === "income" ? "recorrencia_receita" : "recorrencia_despesa",
        description: rule.title,
        amount_cents: rule.amountCents,
        direction: rule.direction === "income" ? "entrada" : "saida",
        account_name: account?.name ?? "Conta"
      });
    }
  }

  const grouped = new Map<string, CashflowEvent[]>();
  events.sort((a, b) => a.date.localeCompare(b.date) || a.amount_cents - b.amount_cents);
  for (const event of events) {
    const existing = grouped.get(event.date) ?? [];
    existing.push(event);
    grouped.set(event.date, existing);
  }

  const daysOut: CashflowDay[] = [];
  let running = initialBalanceCents;
  let firstNegativeDate: string | null = null;
  let minBalanceCents = initialBalanceCents;
  let minBalanceDate = today;
  let totalExpensesCents = 0;
  let totalIncomeCents = 0;

  for (let offset = 0; offset < days; offset++) {
    const date = addDaysIso(today, offset);
    const dayEvents = grouped.get(date) ?? [];
    const totalIncome = dayEvents.filter((event) => event.direction === "entrada").reduce((sum, event) => sum + event.amount_cents, 0);
    const totalExpense = dayEvents.filter((event) => event.direction === "saida").reduce((sum, event) => sum + event.amount_cents, 0);
    running = running + totalIncome - totalExpense;
    totalIncomeCents += totalIncome;
    totalExpensesCents += totalExpense;
    if (running < 0 && !firstNegativeDate) firstNegativeDate = date;
    if (running < minBalanceCents) {
      minBalanceCents = running;
      minBalanceDate = date;
    }
    daysOut.push({
      date,
      balance_cents: running,
      events: dayEvents.map((event) => ({ ...event, balance_after_cents: running })),
      total_income_cents: totalIncome,
      total_expense_cents: totalExpense,
      is_negative: running < 0
    });
  }

  return {
    initial_balance_cents: initialBalanceCents,
    days: daysOut,
    first_negative_date: firstNegativeDate,
    min_balance_cents: minBalanceCents,
    min_balance_date: minBalanceDate,
    total_expenses_cents: totalExpensesCents,
    total_income_cents: totalIncomeCents,
    ending_balance_cents: daysOut.at(-1)?.balance_cents ?? initialBalanceCents
  };
}

export const getProjectedCashflow = unstable_cache(computeProjectedCashflow, ["cashflow-project"], {
  revalidate: 300,
  tags: ["cashflow"]
});
```

## `services\categories.service.ts`
```typescript
import { db } from "@/db/client";
import { categories, subcategories, tags } from "@/db/schema";
import { nowTs } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";
import { eq } from "drizzle-orm";

export function listCategories() {
  const cats = db.select().from(categories).all();
  const subs = db.select().from(subcategories).all();
  return cats.map((category) => ({ ...category, subcategories: subs.filter((sub) => sub.categoryId === category.id) }));
}

export function listTags() {
  return db.select().from(tags).all();
}

export function createCategory(name: string, kind: "income" | "expense" | "neutral", color: string) {
  const slug = slugify(name);
  const existing = db.select().from(categories).where(eq(categories.slug, slug)).get();
  if (existing) return existing;
  const now = nowTs();
  db.insert(categories).values({ id: uid("cat"), name, slug, kind, color, icon: "circle", createdAt: now, updatedAt: now }).run();
}

export function createTag(name: string) {
  const slug = slugify(name);
  const existing = db.select().from(tags).where(eq(tags.slug, slug)).get();
  if (existing) return existing;
  db.insert(tags).values({ id: uid("tag"), name, slug, color: "#71717a", createdAt: nowTs() }).run();
}
```

## `services\csv-import.service.ts`
```typescript
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db, sqlite } from "@/db/client";
import {
  accounts,
  assetTrades,
  billEntries,
  cardInstallments,
  cardPurchases,
  creditCardBills,
  creditCards,
  cryptoPositions,
  netWorthSnapshots,
  netWorthSummaries,
  recurringRules,
  reserves,
  stockPositions,
  transactions
} from "@/db/schema";
import { parseCurrencyToCents, toSafeCents } from "@/lib/currency";
import { addMonthsIso, isoMonth, nowTs, todayIso } from "@/lib/dates";
import { slugify, uid } from "@/lib/utils";

export type ImportLogger = (message: string) => void;

export type ImportFileResult = {
  fileName: string;
  linesProcessed: number;
  linesWithError: number;
  status: "success" | "partial" | "error" | "skipped";
  errors: string[];
};

export type ImportRunResult = {
  success: boolean;
  files: ImportFileResult[];
  summary: Record<string, number>;
  error?: string;
};

const EXPECTED_FILES = [
  "contas.csv",
  "reservas.csv",
  "acoes.csv",
  "criptomoedas.csv",
  "parcelas_cartao.csv",
  "faturas_futuras.csv",
  "transacoes_historicas.csv",
  "registro_diario.csv",
  "operacoes_ativos.csv"
] as const;

const accountRowSchema = z.object({
  banco: z.string().min(1),
  tipo_conta: z.string().min(1),
  saldo_atual_centavos: z.string().min(1),
  produto_investimento: z.string().optional().default(""),
  cor_hex: z.string().optional().default("#6b7280")
});

const reserveRowSchema = z.object({
  nome: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  lucro_total_centavos: z.string(),
  rendimento_total_percentual: z.string().optional().default(""),
  lucro_mensal_centavos: z.string().optional().default("0"),
  rendimento_mensal_percentual: z.string().optional().default("")
});

const stockRowSchema = z.object({
  ticker: z.string().min(1),
  nome_completo: z.string().min(1),
  quantidade: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  resultado_total_centavos: z.string().optional().default("0"),
  rentabilidade_total_percentual: z.string().optional().default("")
});

const cryptoRowSchema = z.object({
  nome: z.string().min(1),
  quantidade: z.string().min(1),
  valor_investido_centavos: z.string(),
  valor_anterior_centavos: z.string(),
  valor_atual_centavos: z.string(),
  lucro_total_centavos: z.string().optional().default("0")
});

const installmentRowSchema = z.object({
  cartao: z.enum(["nubank", "mercadopago"]),
  data_vencimento_iso: z.string().min(10),
  descricao_compra: z.string().min(1),
  valor_parcela_centavos: z.string().min(1),
  numero_parcela: z.string().optional().default(""),
  total_parcelas: z.string().optional().default(""),
  tipo: z.enum(["recorrente", "parcelado"]),
  responsavel: z.string().optional().default("")
});

const billRowSchema = z.object({
  cartao: z.enum(["nubank", "mercadopago"]),
  data_vencimento_iso: z.string().min(10),
  valor_total_centavos: z.string().min(1)
});

const transactionRowSchema = z.object({
  data_iso: z.string().min(10),
  conta: z.string().min(1),
  descricao: z.string().min(1),
  valor_centavos: z.string().min(1),
  tipo: z.enum(["receita", "despesa", "transferencia"]),
  saldo_apos_centavos: z.string().min(1)
});

const snapshotRowSchema = z.object({
  data_iso: z.string().min(10),
  saldo_conta_centavos: z.string().min(1),
  investimento_1_centavos: z.string().min(1),
  investimento_2_centavos: z.string().min(1),
  patrimonio_total_centavos: z.string().min(1),
  tipo_variacao: z.string().optional().default("")
});

const tradeRowSchema = z.object({
  action: z.enum(["compra", "venda"]),
  asset_name: z.string().min(1),
  quantity: z.string().min(1),
  trade_date: z.string().min(10),
  total_initial_cents: z.string().min(1),
  price_per_unit_initial_cents: z.string().min(1),
  total_current_cents: z.string().min(1),
  price_per_unit_current_cents: z.string().min(1),
  yield_percent: z.string().optional().default(""),
  description_text: z.string().optional().default(""),
  is_completed: z.string().optional().default("1")
});

function inferAccountPresentation(bank: string, type: string) {
  const normalized = slugify(type);
  if (normalized.includes("conta-corrente")) {
    return {
      name: `${bank} CC`,
      slug: slugify(`${bank}-cc`),
      type: "checking"
    };
  }
  if (normalized.includes("fundos-investimento") || normalized.includes("investimento")) {
    return {
      name: `${bank} Investimentos`,
      slug: slugify(`${bank}-investimentos`),
      type: "investment"
    };
  }
  return {
    name: `${bank} ${type}`,
    slug: slugify(`${bank}-${type}`),
    type: "checking"
  };
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        field += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') i += 1;
      row.push(field);
      if (row.some((cell) => cell.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  if (field.length || row.length) {
    row.push(field);
    if (row.some((cell) => cell.trim() !== "")) rows.push(row);
  }

  return rows;
}

function rowsToObjects<T extends Record<string, string>>(text: string) {
  const rows = parseCsv(text);
  if (!rows.length) return [] as T[];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((row) => Object.fromEntries(headers.map((header, index) => [header, (row[index] ?? "").trim()])) as T);
}

function humanSummaryKey(fileName: string) {
  return fileName
    .replace(".csv", "")
    .replace(/_/g, " ");
}

function ensureCreditCard(cardKey: "nubank" | "mercadopago") {
  const wanted = cardKey === "nubank"
    ? { name: "Nubank", slug: "nubank", closeDay: 18, dueDay: 25, color: "#9900ff" }
    : { name: "MercadoPago", slug: "mercadopago", closeDay: 8, dueDay: 15, color: "#00bbfe" };
  const existing = db.select().from(creditCards).where(eq(creditCards.slug, wanted.slug)).get();
  if (existing) return existing;

  const settlement = getOrCreateSettlementAccount(cardKey);
  const now = nowTs();
  const id = uid("card");
  db.insert(creditCards).values({
    id,
    name: wanted.name,
    slug: wanted.slug,
    brand: wanted.name,
    network: wanted.name,
    settlementAccountId: settlement.id,
    limitTotalCents: 0,
    closeDay: wanted.closeDay,
    dueDay: wanted.dueDay,
    color: wanted.color,
    isArchived: false,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCards).where(eq(creditCards.id, id)).get()!;
}

function getOrCreateSettlementAccount(cardKey: "nubank" | "mercadopago") {
  const targetBank = cardKey === "nubank" ? "NuBank" : "MercadoPago";
  const existing = db.select().from(accounts).all().find((row) => row.name === `${targetBank} CC` || (row.institution === targetBank && row.type === "checking"));
  if (existing) return existing;
  const now = nowTs();
  const id = uid("acc");
  db.insert(accounts).values({
    id,
    name: `${targetBank} CC`,
    slug: slugify(`${targetBank}-cc`),
    type: "checking",
    institution: targetBank,
    openingBalanceCents: 0,
    color: cardKey === "nubank" ? "#9900ff" : "#00bbfe",
    notes: "Conta criada automaticamente para liquidar faturas importadas.",
    includeInNetWorth: true,
    isArchived: false,
    sortOrder: now,
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(accounts).where(eq(accounts.id, id)).get()!;
}

function findAccountByLabel(label: string) {
  const normalized = slugify(label);
  const allAccounts = db.select().from(accounts).all();
  return allAccounts.find((row) => slugify(row.name) === normalized)
    || allAccounts.find((row) => slugify(row.institution) === normalized && row.type === "checking")
    || allAccounts.find((row) => (row.notes || "").toLowerCase().includes(label.toLowerCase()))
    || allAccounts[0]
    || null;
}

function ensureBill(cardId: string, dueOn: string, closeDay: number, amountCents = 0) {
  const billMonth = isoMonth(dueOn);
  const closesOn = `${billMonth}-${String(closeDay).padStart(2, "0")}`;
  const existing = db.select().from(creditCardBills).all().find((row) => row.creditCardId === cardId && row.dueOn === dueOn);
  const now = nowTs();
  if (existing) {
    if (amountCents > 0) {
      db.update(creditCardBills)
        .set({ totalAmountCents: Math.max(existing.totalAmountCents, amountCents), updatedAt: now })
        .where(eq(creditCardBills.id, existing.id))
        .run();
    }
    return db.select().from(creditCardBills).where(eq(creditCardBills.id, existing.id)).get()!;
  }
  const id = uid("bill");
  db.insert(creditCardBills).values({
    id,
    creditCardId: cardId,
    billMonth,
    closesOn,
    dueOn,
    totalAmountCents: amountCents,
    paidAmountCents: 0,
    status: "open",
    createdAt: now,
    updatedAt: now
  }).run();
  return db.select().from(creditCardBills).where(eq(creditCardBills.id, id)).get()!;
}

function upsertMonthlySummaryFromSnapshot(dateIso: string, totalCents: number) {
  const month = isoMonth(dateIso);
  const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, month)).get();
  const now = nowTs();
  if (existing) {
    db.update(netWorthSummaries)
      .set({ investmentsCents: Math.max(existing.investmentsCents, totalCents), updatedAt: now, source: "import" })
      .where(eq(netWorthSummaries.id, existing.id))
      .run();
    return;
  }
  db.insert(netWorthSummaries).values({
    id: uid("nw"),
    month,
    reservesCents: 0,
    investmentsCents: totalCents,
    debtsCents: 0,
    notes: "Resumo mensal derivado do registro diário importado.",
    source: "import",
    createdAt: now,
    updatedAt: now
  }).run();
}

function firstBusinessDayAfter12(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 13);
  while (date.getDay() === 0 || date.getDay() === 6) {
    date.setDate(date.getDate() + 1);
  }
  return date.toISOString().slice(0, 10);
}

export async function importCsvContents(files: { name: string; content: string }[], logger?: ImportLogger): Promise<ImportRunResult> {
  const started = Date.now();
  const normalizedFiles = files.filter((file) => EXPECTED_FILES.includes(file.name as any));
  const fileMap = new Map(normalizedFiles.map((file) => [file.name, file.content]));
  const results: ImportFileResult[] = [];
  const summary: Record<string, number> = {
    contas: 0,
    reservas: 0,
    acoes: 0,
    criptomoedas: 0,
    parcelas_cartao: 0,
    faturas_futuras: 0,
    transacoes_historicas: 0,
    duplicatas_transacoes: 0,
    operacoes_ativos: 0,
    registro_diario: 0,
    erros: 0
  };

  const processFile = (fileName: string, handler: (text: string, result: ImportFileResult) => void) => {
    const text = fileMap.get(fileName);
    if (!text) return;
    const result: ImportFileResult = { fileName, linesProcessed: 0, linesWithError: 0, status: "success", errors: [] };
    try {
      const tx = sqlite.transaction(() => {
        handler(text, result);
      });
      tx();
      result.status = result.linesWithError > 0 ? "partial" : "success";
    } catch (error) {
      result.status = "error";
      result.errors.push(error instanceof Error ? error.message : "Erro desconhecido");
      summary.erros += 1;
    }
    results.push(result);
  };

  processFile("contas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando contas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = accountRowSchema.parse(raw);
        const preset = inferAccountPresentation(row.banco, row.tipo_conta);
        const existing = db.select().from(accounts).where(eq(accounts.slug, preset.slug)).get();
        const now = nowTs();
        const payload = {
          name: preset.name,
          slug: preset.slug,
          type: preset.type,
          institution: row.banco,
          openingBalanceCents: toSafeCents(row.saldo_atual_centavos),
          color: row.cor_hex || "#6b7280",
          notes: row.produto_investimento ? `Produto vinculado: ${row.produto_investimento}` : "",
          includeInNetWorth: true,
          isArchived: false,
          sortOrder: now,
          updatedAt: now
        };
        if (existing) {
          db.update(accounts).set(payload).where(eq(accounts.id, existing.id)).run();
        } else {
          db.insert(accounts).values({ id: uid("acc"), ...payload, createdAt: now }).run();
        }
        result.linesProcessed += 1;
        summary.contas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("reservas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando reservas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = reserveRowSchema.parse(raw);
        const existing = db.select().from(reserves).where(eq(reserves.name, row.nome)).get();
        const payload = {
          name: row.nome,
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousValueCents: toSafeCents(row.valor_anterior_centavos),
          currentValueCents: toSafeCents(row.valor_atual_centavos),
          totalProfitCents: toSafeCents(row.lucro_total_centavos),
          yieldTotalPercent: row.rendimento_total_percentual ? Number(String(row.rendimento_total_percentual).replace(",", ".")) : null,
          monthlyProfitCents: toSafeCents(row.lucro_mensal_centavos),
          yieldMonthlyPercent: row.rendimento_mensal_percentual ? Number(String(row.rendimento_mensal_percentual).replace(",", ".")) : null,
          accountId: null,
          updatedAt: nowTs()
        };
        if (existing) db.update(reserves).set(payload).where(eq(reserves.id, existing.id)).run();
        else db.insert(reserves).values({ id: uid("res"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.reservas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("acoes.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando acoes.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = stockRowSchema.parse(raw);
        const existing = db.select().from(stockPositions).where(eq(stockPositions.ticker, row.ticker)).get();
        const payload = {
          ticker: row.ticker,
          fullName: row.nome_completo,
          quantity: Number(row.quantidade || 0),
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousCents: toSafeCents(row.valor_anterior_centavos),
          currentCents: toSafeCents(row.valor_atual_centavos),
          resultTotalCents: toSafeCents(row.resultado_total_centavos),
          rentabilityTotalPercent: row.rentabilidade_total_percentual ? Number(String(row.rentabilidade_total_percentual).replace(",", ".")) : null,
          updatedAt: nowTs()
        };
        if (existing) db.update(stockPositions).set(payload).where(eq(stockPositions.id, existing.id)).run();
        else db.insert(stockPositions).values({ id: uid("stk"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.acoes += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("criptomoedas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando criptomoedas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = cryptoRowSchema.parse(raw);
        const existing = db.select().from(cryptoPositions).where(eq(cryptoPositions.name, row.nome)).get();
        const payload = {
          name: row.nome,
          quantity: Number(String(row.quantidade).replace(",", ".")),
          investedCents: toSafeCents(row.valor_investido_centavos),
          previousCents: toSafeCents(row.valor_anterior_centavos),
          currentCents: toSafeCents(row.valor_atual_centavos),
          totalProfitCents: toSafeCents(row.lucro_total_centavos),
          updatedAt: nowTs()
        };
        if (existing) db.update(cryptoPositions).set(payload).where(eq(cryptoPositions.id, existing.id)).run();
        else db.insert(cryptoPositions).values({ id: uid("cry"), ...payload, createdAt: nowTs() }).run();
        result.linesProcessed += 1;
        summary.criptomoedas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("parcelas_cartao.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando parcelas_cartao.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = installmentRowSchema.parse(raw);
        const card = ensureCreditCard(row.cartao);
        if (row.tipo === "recorrente") {
          const title = row.descricao_compra;
          const existingRule = db.select().from(recurringRules).all().find((rule) => rule.title === title && rule.accountId === card.settlementAccountId);
          if (!existingRule) {
            db.insert(recurringRules).values({
              id: uid("rr"),
              accountId: card.settlementAccountId,
              categoryId: null,
              title,
              direction: "expense",
              frequency: "monthly",
              amountCents: toSafeCents(row.valor_parcela_centavos),
              startsOn: row.data_vencimento_iso,
              endsOn: null,
              nextRunOn: row.data_vencimento_iso,
              autoPost: false,
              notes: `Importado de ${card.name}.`,
              isActive: true,
              createdAt: nowTs(),
              updatedAt: nowTs()
            }).run();
          }
          result.linesProcessed += 1;
          summary.parcelas_cartao += 1;
          return;
        }

        const currentInstallment = Number(row.numero_parcela || 1);
        const totalInstallments = Number(row.total_parcelas || currentInstallment || 1);
        const purchaseKey = `${card.id}|${row.descricao_compra}|${row.data_vencimento_iso}|${currentInstallment}`;
        const existingPurchase = db.select().from(cardPurchases).all().find((purchase) => `${purchase.creditCardId}|${purchase.description}|${purchase.purchaseDate}|${purchase.installmentCount}` === purchaseKey);
        const purchaseId = existingPurchase?.id ?? uid("purchase");
        if (!existingPurchase) {
          const totalAmountCents = toSafeCents(row.valor_parcela_centavos) * Math.max(totalInstallments, 1);
          db.insert(cardPurchases).values({
            id: purchaseId,
            creditCardId: card.id,
            categoryId: null,
            subcategoryId: null,
            firstBillId: null,
            description: row.descricao_compra,
            merchant: row.descricao_compra,
            purchaseDate: row.data_vencimento_iso,
            totalAmountCents,
            installmentCount: totalInstallments,
            notes: `Importado do cronograma do cartão ${card.name}.`,
            purchaseType: "parcelado",
            responsible: row.responsavel,
            createdAt: nowTs(),
            updatedAt: nowTs()
          }).run();
        }

        for (let number = currentInstallment; number <= totalInstallments; number++) {
          const dueOn = addMonthsIso(row.data_vencimento_iso, number - currentInstallment);
          const bill = ensureBill(card.id, dueOn, card.closeDay);
          const existingInstallment = db.select().from(cardInstallments).all().find((item) => item.purchaseId === purchaseId && item.installmentNumber === number);
          if (!existingInstallment) {
            const installmentId = uid("inst");
            db.insert(cardInstallments).values({
              id: installmentId,
              purchaseId,
              billId: bill.id,
              installmentNumber: number,
              totalInstallments,
              amountCents: toSafeCents(row.valor_parcela_centavos),
              status: "billed",
              dueOn,
              createdAt: nowTs()
            }).run();
            db.insert(billEntries).values({
              id: uid("entry"),
              billId: bill.id,
              entryType: "installment",
              description: `${row.descricao_compra} (${number}/${totalInstallments})`,
              amountCents: toSafeCents(row.valor_parcela_centavos),
              purchaseId,
              installmentId,
              createdAt: nowTs()
            }).run();
            db.update(creditCardBills)
              .set({ totalAmountCents: bill.totalAmountCents + toSafeCents(row.valor_parcela_centavos), updatedAt: nowTs() })
              .where(eq(creditCardBills.id, bill.id))
              .run();
          }
        }
        result.linesProcessed += 1;
        summary.parcelas_cartao += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("faturas_futuras.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando faturas_futuras.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = billRowSchema.parse(raw);
        const card = ensureCreditCard(row.cartao);
        const bill = ensureBill(card.id, row.data_vencimento_iso, card.closeDay, toSafeCents(row.valor_total_centavos));
        db.update(creditCardBills)
          .set({ totalAmountCents: toSafeCents(row.valor_total_centavos), updatedAt: nowTs(), status: toSafeCents(row.valor_total_centavos) > 0 ? "open" : "open" })
          .where(eq(creditCardBills.id, bill.id))
          .run();
        result.linesProcessed += 1;
        summary.faturas_futuras += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("transacoes_historicas.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando transacoes_historicas.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = transactionRowSchema.parse(raw);
        const account = findAccountByLabel(row.conta);
        const direction = row.tipo === "receita" ? "income" : row.tipo === "despesa" ? "expense" : "adjustment";
        const exists = db.select().from(transactions).all().find((item) => item.occurredOn === row.data_iso && item.accountId === (account?.id ?? null) && item.amountCents === toSafeCents(row.valor_centavos) && item.direction === direction);
        if (exists) {
          summary.duplicatas_transacoes += 1;
          return;
        }
        db.insert(transactions).values({
          id: uid("txn"),
          accountId: account?.id ?? null,
          categoryId: null,
          subcategoryId: null,
          transferId: null,
          recurringOccurrenceId: null,
          sourceImportRowId: null,
          direction,
          status: "posted",
          description: row.descricao,
          counterparty: row.conta,
          amountCents: toSafeCents(row.valor_centavos),
          occurredOn: row.data_iso,
          dueOn: row.data_iso,
          competenceMonth: isoMonth(row.data_iso),
          notes: `Saldo após: ${row.saldo_apos_centavos}`,
          isProjected: false,
          createdAt: nowTs(),
          updatedAt: nowTs()
        }).run();
        result.linesProcessed += 1;
        summary.transacoes_historicas += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("operacoes_ativos.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando operacoes_ativos.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = tradeRowSchema.parse(raw);
        const exists = db.select().from(assetTrades).all().find((item) => item.assetName === row.asset_name && item.tradeDate === row.trade_date && item.action === row.action);
        if (exists) return;
        db.insert(assetTrades).values({
          id: uid("trade"),
          action: row.action,
          assetName: row.asset_name,
          quantity: Number(String(row.quantity).replace(",", ".")),
          tradeDate: row.trade_date,
          totalInitialCents: toSafeCents(row.total_initial_cents),
          pricePerUnitInitialCents: toSafeCents(row.price_per_unit_initial_cents),
          totalCurrentCents: toSafeCents(row.total_current_cents),
          pricePerUnitCurrentCents: toSafeCents(row.price_per_unit_current_cents),
          yieldPercent: row.yield_percent ? Number(String(row.yield_percent).replace(",", ".")) : null,
          descriptionText: row.description_text,
          isCompleted: row.is_completed !== "0",
          createdAt: nowTs()
        }).run();
        result.linesProcessed += 1;
        summary.operacoes_ativos += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  processFile("registro_diario.csv", (text, result) => {
    const rows = rowsToObjects<Record<string, string>>(text);
    rows.forEach((raw, index) => {
      logger?.(`⏳ Processando registro_diario.csv (linha ${index + 1}/${rows.length})...`);
      try {
        const row = snapshotRowSchema.parse(raw);
        const existing = db.select().from(netWorthSnapshots).where(eq(netWorthSnapshots.date, row.data_iso)).get();
        const payload = {
          date: row.data_iso,
          accountBalanceCents: toSafeCents(row.saldo_conta_centavos),
          investment1Cents: toSafeCents(row.investimento_1_centavos),
          investment2Cents: toSafeCents(row.investimento_2_centavos),
          totalCents: toSafeCents(row.patrimonio_total_centavos),
          variationType: row.tipo_variacao,
          createdAt: nowTs()
        };
        if (existing) {
          db.update(netWorthSnapshots)
            .set({
              accountBalanceCents: payload.accountBalanceCents,
              investment1Cents: payload.investment1Cents,
              investment2Cents: payload.investment2Cents,
              totalCents: payload.totalCents,
              variationType: payload.variationType
            })
            .where(eq(netWorthSnapshots.id, existing.id))
            .run();
        } else {
          db.insert(netWorthSnapshots).values({ id: uid("nws"), ...payload }).run();
        }
        upsertMonthlySummaryFromSnapshot(row.data_iso, payload.totalCents);
        result.linesProcessed += 1;
        summary.registro_diario += 1;
      } catch (error) {
        result.linesWithError += 1;
        result.errors.push(`Linha ${index + 2}: ${error instanceof Error ? error.message : "inválida"}`);
      }
    });
  });

  return {
    success: results.every((item) => item.status === "success" || item.status === "partial"),
    files: results,
    summary: {
      ...summary,
      tempo_ms: Date.now() - started
    }
  };
}

export function renderImportSummary(result: ImportRunResult) {
  const lines = [
    "====================================",
    "  Relatório de Importação",
    "====================================",
    `  ✅ Contas:              ${result.summary.contas} inseridas`,
    `  ✅ Reservas:            ${result.summary.reservas} inseridas`,
    `  ✅ Ações:               ${result.summary.acoes} inseridas`,
    `  ✅ Criptomoedas:        ${result.summary.criptomoedas} inseridas`,
    `  ✅ Parcelas cartão:     ${result.summary.parcelas_cartao} inseridas`,
    `  ✅ Faturas futuras:     ${result.summary.faturas_futuras} inseridas`,
    `  ✅ Transações:          ${result.summary.transacoes_historicas} inseridas, ${result.summary.duplicatas_transacoes} duplicatas ignoradas`,
    `  ✅ Operações de ativo:  ${result.summary.operacoes_ativos} inseridas`,
    `  ✅ Snapshots diários:   ${result.summary.registro_diario} inseridos`,
    `  ⚠️  Erros:              ${result.summary.erros}`,
    "====================================",
    `  Tempo total: ${(result.summary.tempo_ms / 1000).toFixed(2)}s`,
    "===================================="
  ];
  return lines.join("\n");
}

export function expectedCsvFiles() {
  return [...EXPECTED_FILES];
}

export function seedProjectionRulesIfMissing() {
  const mercadoPago = db.select().from(accounts).all().find((item) => item.name === "MercadoPago CC" || item.institution === "MercadoPago") || db.select().from(accounts).all()[0];
  const nubank = db.select().from(accounts).all().find((item) => item.name === "NuBank CC" || item.institution === "NuBank") || mercadoPago;
  if (!mercadoPago || !nubank) return;

  const definitions = [
    {
      title: "Mesada Olga",
      accountId: mercadoPago.id,
      amountCents: parseCurrencyToCents("1000,00"),
      nextRunOn: firstBusinessDayAfter12(new Date().getFullYear(), new Date().getMonth()),
      notes: "FIRST_BUSINESS_DAY_AFTER_12"
    },
    {
      title: "Internet/GloboPlay",
      accountId: mercadoPago.id,
      amountCents: parseCurrencyToCents("79,89"),
      nextRunOn: `${isoMonth(todayIso())}-21`,
      notes: ""
    },
    {
      title: "SmartFit",
      accountId: nubank.id,
      amountCents: parseCurrencyToCents("149,90"),
      nextRunOn: `${isoMonth(todayIso())}-25`,
      notes: "CARD_RECURRING"
    }
  ];

  definitions.forEach((definition) => {
    const exists = db.select().from(recurringRules).all().find((rule) => rule.title === definition.title);
    if (exists) return;
    db.insert(recurringRules).values({
      id: uid("rr"),
      accountId: definition.accountId,
      categoryId: null,
      title: definition.title,
      direction: definition.title === "Mesada Olga" ? "income" : "expense",
      frequency: "monthly",
      amountCents: definition.amountCents,
      startsOn: definition.nextRunOn,
      endsOn: null,
      nextRunOn: definition.nextRunOn,
      autoPost: false,
      notes: definition.notes,
      isActive: true,
      createdAt: nowTs(),
      updatedAt: nowTs()
    }).run();
  });
}
```

## `services\dashboard.service.ts`
```typescript
import { listAccountsWithBalances } from "@/services/accounts.service";
import { listTransactions } from "@/services/transactions.service";
import { getCardsSummary, listBills } from "@/services/cards.service";
import { listRecurringRules } from "@/services/recurring.service";
import { getCurrentNetWorthSummary } from "@/services/net-worth.service";
import { format } from "date-fns";

export function getDashboardData() {
  const accounts = listAccountsWithBalances();
  const cards = getCardsSummary();
  const recentTransactions = listTransactions({ limit: 10 });
  const upcomingBills = listBills().filter((bill) => bill.status !== "paid").slice(0, 6);
  const recurring = listRecurringRules().flatMap((rule) => rule.occurrences).filter((row) => row.status === "scheduled").slice(0, 8);
  const month = format(new Date(), "yyyy-MM");
  const monthTransactions = listTransactions({ month });
  return {
    month,
    accounts,
    cards,
    recentTransactions,
    upcomingBills,
    recurring,
    netWorth: getCurrentNetWorthSummary(),
    consolidatedCurrentCents: accounts.reduce((sum, account) => sum + account.currentBalanceCents, 0),
    consolidatedProjectedCents:
      accounts.reduce((sum, account) => sum + account.projectedBalanceCents, 0) - upcomingBills.reduce((sum, bill) => sum + (bill.totalAmountCents - bill.paidAmountCents), 0),
    incomeMonthCents: monthTransactions.filter((row) => row.direction === "income").reduce((sum, row) => sum + row.amountCents, 0),
    expenseMonthCents: monthTransactions.filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction)).reduce((sum, row) => sum + row.amountCents, 0),
    chartSeries: accounts.map((account) => ({ name: account.name, current: account.currentBalanceCents / 100, projected: account.projectedBalanceCents / 100 }))
  };
}
```

## `services\import.service.ts`
```typescript
import * as XLSX from "xlsx";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, creditCardBills, creditCards, importBatches, importIssues, importMappings, importRawRows, netWorthSummaries, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { isoMonth, nowTs } from "@/lib/dates";
import { fromJson, slugify, toJson, uid } from "@/lib/utils";
import type { BatchMeta, BatchSheetInventory, DryRunReport, ImportSheetTarget } from "@/types/domain";

function normalizeHeader(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function inferTarget(headers: string[], sheetName: string): ImportSheetTarget {
  const joined = `${sheetName} ${headers.join(" ")}`.toLowerCase();
  if (joined.includes("cart") && (joined.includes("fatura") || joined.includes("venc") || joined.includes("fechamento"))) return "card_bills";
  if (joined.includes("cart") && (joined.includes("limite") || joined.includes("bandeira") || joined.includes("fech"))) return "credit_cards";
  if (joined.includes("patrimonio") || joined.includes("invest") || joined.includes("reserva") || joined.includes("divida")) return "net_worth";
  if (joined.includes("saldo") || joined.includes("conta")) return "accounts";
  if (joined.includes("data") && (joined.includes("valor") || joined.includes("descr") || joined.includes("transa"))) return "transactions";
  return "ignore";
}

function inventory(workbook: XLSX.WorkBook): BatchSheetInventory[] {
  return workbook.SheetNames.map((name) => {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | boolean | null>>(workbook.Sheets[name], { header: 1, defval: null, raw: false });
    const headers = (rows[0] ?? []).map((cell) => String(cell ?? "").trim()).filter(Boolean);
    return { name, rowCount: Math.max(rows.length - 1, 0), headers, suggestedTarget: inferTarget(headers, name) };
  });
}

function inferDefaultColumnMap(headers: string[], target: ImportSheetTarget) {
  const normalizedHeaders = headers.map((header) => ({ raw: header, normalized: normalizeHeader(header) }));
  const pick = (...patterns: string[]) => normalizedHeaders.find((header) => patterns.some((pattern) => header.normalized.includes(pattern)))?.raw ?? "";

  switch (target) {
    case "accounts":
      return {
        name: pick("nome", "conta"),
        balance: pick("saldo", "valor"),
        type: pick("tipo"),
        institution: pick("instit", "banco"),
        includeInNetWorth: pick("patrimonio", "incluir")
      };
    case "transactions":
      return {
        description: pick("descricao", "descri", "nome"),
        amount: pick("valor", "amount"),
        date: pick("data", "date"),
        account: pick("conta", "account"),
        direction: pick("tipo", "direcao", "natureza"),
        counterparty: pick("favorecido", "contraparte", "counterparty"),
        notes: pick("obs", "nota")
      };
    case "credit_cards":
      return {
        name: pick("nome", "cartao"),
        brand: pick("bandeira", "brand"),
        network: pick("network"),
        limitAmount: pick("limite", "valor"),
        closeDay: pick("fech"),
        dueDay: pick("venc"),
        settlementAccount: pick("conta", "pagadora")
      };
    case "card_bills":
      return {
        cardName: pick("cartao", "card"),
        billMonth: pick("mes", "compet"),
        dueOn: pick("venc", "due"),
        closesOn: pick("fech"),
        totalAmount: pick("total", "valor"),
        paidAmount: pick("pago")
      };
    case "net_worth":
    case "investment_snapshots":
      return {
        month: pick("mes", "month", "compet"),
        reserves: pick("reserva"),
        investments: pick("invest"),
        debts: pick("divida", "debt"),
        notes: pick("obs", "nota")
      };
    default:
      return {};
  }
}

function getCell(payload: Record<string, unknown>, key: string) {
  return key ? payload[key] : undefined;
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : value == null ? "" : String(value).trim();
}

function toBoolean(value: unknown) {
  const normalized = toText(value).toLowerCase();
  return ["1", "true", "sim", "yes", "y", "ok", "x"].includes(normalized);
}

export function listImportBatches() {
  return db.select().from(importBatches).all().sort((a, b) => b.createdAt - a.createdAt);
}

export function getImportBatch(batchId: string) {
  const batch = db.select().from(importBatches).where(eq(importBatches.id, batchId)).get();
  if (!batch) return null;
  return {
    ...batch,
    meta: fromJson<BatchMeta>(batch.workbookSummaryJson, { sheets: [] }),
    dryRunReport: fromJson<DryRunReport | null>(batch.dryRunReportJson, null),
    mappings: db.select().from(importMappings).all().filter((row) => row.batchId === batchId),
    issues: db.select().from(importIssues).all().filter((row) => row.batchId === batchId),
    rows: db.select().from(importRawRows).all().filter((row) => row.batchId === batchId)
  };
}

export async function ingestWorkbook(fileName: string, arrayBuffer: ArrayBuffer) {
  const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true, raw: false });
  const now = nowTs();
  const batchId = uid("batch");
  const sheets = inventory(workbook);
  const meta: BatchMeta = { sheets };
  db.insert(importBatches).values({
    id: batchId,
    filename: fileName,
    status: "uploaded",
    workbookSummaryJson: toJson(meta),
    dryRunReportJson: null,
    createdAt: now,
    updatedAt: now
  }).run();

  for (const sheet of sheets) {
    const rows = XLSX.utils.sheet_to_json<Array<string | number | boolean | null>>(workbook.Sheets[sheet.name], { header: 1, defval: null, raw: false });
    const headers = (rows[0] ?? []).map((cell) => String(cell ?? "").trim());
    if (sheet.suggestedTarget !== "ignore") {
      db.insert(importMappings).values({
        id: uid("map"),
        batchId,
        sheetName: sheet.name,
        targetEntity: sheet.suggestedTarget,
        columnMapJson: toJson(inferDefaultColumnMap(headers, sheet.suggestedTarget)),
        optionsJson: toJson({ autoSuggested: true }),
        createdAt: now,
        updatedAt: now
      }).run();
    }

    for (let index = 1; index < rows.length; index += 1) {
      const row = rows[index];
      if (!row || row.every((cell) => cell == null || String(cell).trim() === "")) continue;
      const payload: Record<string, unknown> = {};
      headers.forEach((header, headerIndex) => {
        if (!header) return;
        payload[header] = row[headerIndex] ?? null;
      });
      db.insert(importRawRows).values({
        id: uid("raw"),
        batchId,
        sheetName: sheet.name,
        rowNumber: index + 1,
        rowHash: JSON.stringify(payload),
        payloadJson: toJson(payload),
        validationStatus: "pending",
        createdAt: now
      }).run();
    }
  }

  return batchId;
}

export function saveSheetMapping(batchId: string, sheetName: string, targetEntity: ImportSheetTarget, columnMap: Record<string, string>) {
  const existing = db.select().from(importMappings).all().find((row) => row.batchId === batchId && row.sheetName === sheetName);
  const now = nowTs();
  if (existing) {
    db.update(importMappings).set({ targetEntity, columnMapJson: toJson(columnMap), updatedAt: now }).where(eq(importMappings.id, existing.id)).run();
    return existing.id;
  }
  const id = uid("map");
  db.insert(importMappings).values({
    id,
    batchId,
    sheetName,
    targetEntity,
    columnMapJson: toJson(columnMap),
    optionsJson: toJson({ autoSuggested: false }),
    createdAt: now,
    updatedAt: now
  }).run();
  return id;
}

function addIssue(batchId: string, rawRowId: string | null, sheetName: string, severity: "error" | "warning", issueCode: string, message: string) {
  db.insert(importIssues).values({ id: uid("issue"), batchId, rawRowId, sheetName, severity, issueCode, message, createdAt: nowTs() }).run();
}

export function validateBatch(batchId: string) {
  db.select().from(importIssues).all().filter((row) => row.batchId === batchId).forEach((row) => {
    db.delete(importIssues).where(eq(importIssues.id, row.id)).run();
  });

  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote nÃ£o encontrado.");

  const summary: DryRunReport["summary"] = { accounts: 0, transactions: 0, creditCards: 0, purchases: 0, installments: 0, issues: 0 };
  const warnings: string[] = [];

  for (const mapping of batch.mappings) {
    const rows = batch.rows.filter((row) => row.sheetName === mapping.sheetName);
    const map = fromJson<Record<string, string>>(mapping.columnMapJson, {});
    if (Object.keys(map).length === 0) {
      warnings.push(`A aba ${mapping.sheetName} ainda estÃ¡ sem mapeamento.`);
      continue;
    }

    for (const row of rows) {
      const payload = fromJson<Record<string, unknown>>(row.payloadJson, {});
      if (mapping.targetEntity === "accounts") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "account_missing_name", `Linha ${row.rowNumber}: nome da conta ausente.`);
        } else summary.accounts += 1;
      }

      if (mapping.targetEntity === "transactions") {
        const description = toText(getCell(payload, map.description ?? ""));
        const amount = toText(getCell(payload, map.amount ?? ""));
        const date = toText(getCell(payload, map.date ?? ""));
        if (!description || !amount || !date) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "transaction_missing_required", `Linha ${row.rowNumber}: faltam descriÃ§Ã£o, valor ou data.`);
        } else summary.transactions += 1;
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "error", "credit_card_missing_name", `Linha ${row.rowNumber}: nome do cartÃ£o ausente.`);
        } else summary.creditCards += 1;
      }

      if (mapping.targetEntity === "card_bills") {
        const dueOn = toText(getCell(payload, map.dueOn ?? ""));
        const totalAmount = toText(getCell(payload, map.totalAmount ?? ""));
        if (!dueOn || !totalAmount) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "warning", "card_bill_incomplete", `Linha ${row.rowNumber}: revisar vencimento ou valor total da fatura.`);
        } else summary.installments += 1;
      }

      if (mapping.targetEntity === "net_worth" || mapping.targetEntity === "investment_snapshots") {
        const month = toText(getCell(payload, map.month ?? ""));
        if (!month) {
          summary.issues += 1;
          addIssue(batchId, row.id, mapping.sheetName, "warning", "net_worth_missing_month", `Linha ${row.rowNumber}: competÃªncia do patrimÃ´nio nÃ£o identificada.`);
        }
      }
    }
  }

  const report: DryRunReport = { summary, warnings };
  db.update(importBatches).set({ dryRunReportJson: toJson(report), status: summary.issues > 0 ? "validated_with_issues" : "validated", updatedAt: nowTs() }).where(eq(importBatches.id, batchId)).run();
  return report;
}

export function commitBatch(batchId: string, dryRun = false) {
  const batch = getImportBatch(batchId);
  if (!batch) throw new Error("Lote nÃ£o encontrado.");
  const report = validateBatch(batchId);
  if (dryRun) return report;
  if (report.summary.issues > 0) throw new Error("Corrija os problemas crÃ­ticos antes de confirmar a importaÃ§Ã£o.");
  const now = nowTs();

  for (const mapping of batch.mappings) {
    const rows = batch.rows.filter((row) => row.sheetName === mapping.sheetName);
    const map = fromJson<Record<string, string>>(mapping.columnMapJson, {});

    for (const row of rows) {
      const payload = fromJson<Record<string, unknown>>(row.payloadJson, {});

      if (mapping.targetEntity === "accounts") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) continue;
        const slug = slugify(name);
        const existing = db.select().from(accounts).where(eq(accounts.slug, slug)).get();
        const accountPayload = {
          name,
          slug,
          type: toText(getCell(payload, map.type ?? "")) || "checking",
          institution: toText(getCell(payload, map.institution ?? "")),
          openingBalanceCents: parseCurrencyToCents(getCell(payload, map.balance ?? "") ?? 0),
          color: "#5b7cfa",
          notes: `Importado do lote ${batch.filename}.`,
          includeInNetWorth: map.includeInNetWorth ? toBoolean(getCell(payload, map.includeInNetWorth)) : true,
          isArchived: false,
          sortOrder: now,
          updatedAt: now
        };
        if (existing) {
          db.update(accounts).set(accountPayload).where(eq(accounts.id, existing.id)).run();
        } else {
          db.insert(accounts).values({ id: uid("acc"), ...accountPayload, createdAt: now }).run();
        }
      }

      if (mapping.targetEntity === "transactions") {
        const description = toText(getCell(payload, map.description ?? ""));
        if (!description) continue;
        const accountName = toText(getCell(payload, map.account ?? ""));
        const account = db.select().from(accounts).all().find((item) => item.name === accountName || item.slug === slugify(accountName));
        const date = toText(getCell(payload, map.date ?? "")) || new Date().toISOString().slice(0, 10);
        const rawDirection = toText(getCell(payload, map.direction ?? "")).toLowerCase();
        const direction = rawDirection.startsWith("r") || rawDirection.includes("rece") ? "income" : rawDirection.includes("transfer") ? "transfer_out" : "expense";
        db.insert(transactions).values({
          id: uid("txn"),
          accountId: account?.id ?? null,
          categoryId: null,
          subcategoryId: null,
          transferId: null,
          recurringOccurrenceId: null,
          sourceImportRowId: row.id,
          direction,
          status: "posted",
          description,
          counterparty: toText(getCell(payload, map.counterparty ?? "")),
          amountCents: parseCurrencyToCents(getCell(payload, map.amount ?? "") ?? 0),
          occurredOn: date,
          dueOn: date,
          competenceMonth: isoMonth(date),
          notes: toText(getCell(payload, map.notes ?? "")) || `Importado do lote ${batch.filename}.`,
          isProjected: false,
          createdAt: now,
          updatedAt: now
        }).run();
      }

      if (mapping.targetEntity === "credit_cards") {
        const name = toText(getCell(payload, map.name ?? ""));
        if (!name) continue;
        const settlementName = toText(getCell(payload, map.settlementAccount ?? ""));
        const settlementAccount = db.select().from(accounts).all().find((item) => item.name === settlementName || item.slug === slugify(settlementName));
        if (!settlementAccount) continue;
        const slug = slugify(name);
        const existing = db.select().from(creditCards).where(eq(creditCards.slug, slug)).get();
        const cardPayload = {
          name,
          slug,
          brand: toText(getCell(payload, map.brand ?? "")),
          network: toText(getCell(payload, map.network ?? "")),
          settlementAccountId: settlementAccount.id,
          limitTotalCents: parseCurrencyToCents(getCell(payload, map.limitAmount ?? "") ?? 0),
          closeDay: Number(toText(getCell(payload, map.closeDay ?? "")) || 8),
          dueDay: Number(toText(getCell(payload, map.dueDay ?? "")) || 15),
          color: "#111827",
          isArchived: false,
          updatedAt: now
        };
        if (existing) db.update(creditCards).set(cardPayload).where(eq(creditCards.id, existing.id)).run();
        else db.insert(creditCards).values({ id: uid("card"), ...cardPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "card_bills") {
        const cardName = toText(getCell(payload, map.cardName ?? ""));
        const card = db.select().from(creditCards).all().find((item) => item.name === cardName || item.slug === slugify(cardName));
        if (!card) continue;
        const billMonth = toText(getCell(payload, map.billMonth ?? "")) || isoMonth(toText(getCell(payload, map.dueOn ?? "")) || new Date().toISOString().slice(0, 10));
        const existing = db.select().from(creditCardBills).all().find((item) => item.creditCardId === card.id && item.billMonth === billMonth);
        const billPayload = {
          creditCardId: card.id,
          billMonth,
          closesOn: toText(getCell(payload, map.closesOn ?? "")) || `${billMonth}-08`,
          dueOn: toText(getCell(payload, map.dueOn ?? "")) || `${billMonth}-15`,
          totalAmountCents: parseCurrencyToCents(getCell(payload, map.totalAmount ?? "") ?? 0),
          paidAmountCents: parseCurrencyToCents(getCell(payload, map.paidAmount ?? "") ?? 0),
          status: "open",
          settlementTransactionId: null,
          updatedAt: now
        };
        if (existing) db.update(creditCardBills).set(billPayload).where(eq(creditCardBills.id, existing.id)).run();
        else db.insert(creditCardBills).values({ id: uid("bill"), ...billPayload, createdAt: now }).run();
      }

      if (mapping.targetEntity === "net_worth" || mapping.targetEntity === "investment_snapshots") {
        const month = toText(getCell(payload, map.month ?? "")) || new Date().toISOString().slice(0, 7);
        const existing = db.select().from(netWorthSummaries).where(eq(netWorthSummaries.month, month)).get();
        const snapshot = {
          month,
          reservesCents: parseCurrencyToCents(getCell(payload, map.reserves ?? "") ?? 0),
          investmentsCents: parseCurrencyToCents(getCell(payload, map.investments ?? "") ?? 0),
          debtsCents: parseCurrencyToCents(getCell(payload, map.debts ?? "") ?? 0),
          notes: toText(getCell(payload, map.notes ?? "")) || `Importado do lote ${batch.filename}.`,
          source: "import",
          updatedAt: now
        };
        if (existing) db.update(netWorthSummaries).set(snapshot).where(eq(netWorthSummaries.id, existing.id)).run();
        else db.insert(netWorthSummaries).values({ id: uid("nw"), ...snapshot, createdAt: now }).run();
      }
    }
  }

  db.update(importBatches).set({ status: "committed", updatedAt: now }).where(eq(importBatches.id, batchId)).run();
  return report;
}
```

## `services\money-bootstrap.service.ts`
```typescript
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
        workbookSummaryJson: toJson(moneyBootstrapDataset.sheetInventory),
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
      workbookSummaryJson: toJson(moneyBootstrapDataset.sheetInventory),
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
  return moneyBootstrapDataset;
}

export function getMoneyOnboardingDefaults() {
  const currentSettings = ensureSettings();

  return {
    source: "money" as const,
    initialSettings: {
      userDisplayName: currentSettings.userDisplayName === "VocÃª" ? "Felipe" : currentSettings.userDisplayName,
      baseCurrency: currentSettings.baseCurrency || moneyBootstrapDataset.currency,
      locale: currentSettings.locale || moneyBootstrapDataset.locale,
      themePreference: currentSettings.themePreference || "system",
      projectionMonths: currentSettings.projectionMonths || 6
    },
    dataset: moneyBootstrapDataset
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
```

## `services\monthly-closing.service.ts`
```typescript
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { creditCardBills, monthlyClosings, transactions } from "@/db/schema";
import { endOfMonthIso, nowTs } from "@/lib/dates";
import { closeMonthSnapshot, signedAmount, type TransactionDirection } from "@/lib/finance";
import { uid, fromJson, toJson } from "@/lib/utils";

function getMonthRange(month: string) {
  const start = `${month}-01`;
  const end = endOfMonthIso(start);
  return { start, end };
}

function getOpeningBalanceForMonth(month: string) {
  const { start } = getMonthRange(month);
  const priorTransactions = db.select().from(transactions).all().filter((row) => row.occurredOn < start && row.status !== "void");
  return priorTransactions.reduce((sum, row) => sum + signedAmount(row.direction as TransactionDirection, row.amountCents), 0);
}

export function buildMonthlyClosing(month: string) {
  const { start, end } = getMonthRange(month);
  const tx = db.select().from(transactions).all().filter((row) => row.occurredOn >= start && row.occurredOn <= end && row.status !== "void");
  const bills = db.select().from(creditCardBills).all().filter((bill) => bill.dueOn >= start && bill.dueOn <= end && bill.status !== "paid");
  const incomesCents = tx.filter((row) => row.direction === "income").reduce((sum, row) => sum + row.amountCents, 0);
  const expensesCents = tx.filter((row) => ["expense", "bill_payment", "adjustment"].includes(row.direction)).reduce((sum, row) => sum + row.amountCents, 0);
  const transfersNetCents = tx.filter((row) => row.direction === "transfer_in").reduce((sum, row) => sum + row.amountCents, 0)
    - tx.filter((row) => row.direction === "transfer_out").reduce((sum, row) => sum + row.amountCents, 0);
  const projectedBillPaymentsCents = bills.reduce((sum, bill) => sum + Math.max(bill.totalAmountCents - bill.paidAmountCents, 0), 0);
  const openingBalanceCents = getOpeningBalanceForMonth(month);
  const snapshot = closeMonthSnapshot({
    openingBalanceCents,
    incomesCents,
    expensesCents,
    transfersNetCents,
    projectedBillPaymentsCents
  });

  return {
    month,
    openingBalanceCents,
    incomesCents,
    expensesCents,
    transfersNetCents,
    projectedBillPaymentsCents,
    closingBalanceCents: snapshot.closingBalanceCents,
    projectedFreeCashCents: snapshot.projectedFreeCashCents,
    snapshotJson: toJson({ transactionCount: tx.length, openBills: bills.length })
  };
}

export function runMonthlyClosing(month: string) {
  const now = nowTs();
  const built = buildMonthlyClosing(month);
  const existing = db.select().from(monthlyClosings).where(eq(monthlyClosings.month, month)).get();
  if (existing) {
    db.update(monthlyClosings).set({ ...built, updatedAt: now }).where(eq(monthlyClosings.id, existing.id)).run();
    return existing.id;
  }
  const id = uid("close");
  db.insert(monthlyClosings).values({ id, ...built, notes: "", createdAt: now, updatedAt: now }).run();
  return id;
}

export function listMonthlyClosings() {
  return db.select().from(monthlyClosings).all().sort((a, b) => b.month.localeCompare(a.month)).map((row) => ({
    ...row,
    snapshot: fromJson<{ transactionCount?: number; openBills?: number }>(row.snapshotJson, {})
  }));
}
```

## `services\net-worth.service.ts`
```typescript
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { accounts, cryptoPositions, netWorthSummaries, reserves, stockPositions, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { nowTs } from "@/lib/dates";
import { calculateBalance } from "@/lib/finance";
import { uid } from "@/lib/utils";

type NetWorthSummary = {
  month: string | null;
  realizedLiquidCents: number;
  manualReservesCents: number;
  manualInvestmentsCents: number;
  manualDebtsCents: number;
  totalNetWorthCents: number;
};

function getLiquidAccountBalanceCents() {
  const includedAccounts = db.select().from(accounts).where(eq(accounts.includeInNetWorth, true)).all();
  return includedAccounts
    .filter((account) => ["checking", "savings", "cash"].includes(account.type))
    .reduce((sum, account) => {
      const related = db.select().from(transactions).where(eq(transactions.accountId, account.id)).all();
      return sum + calculateBalance(account.openingBalanceCents, related);
    }, 0);
}

function getLatestNetWorthSummaryRow() {
  return db.select().from(netWorthSummaries).all().sort((a, b) => b.month.localeCompare(a.month))[0] ?? null;
}

function getImportedReserveCents() {
  const rows = db.select().from(reserves).all();
  return rows.reduce((sum, item) => sum + item.currentValueCents, 0);
}

function getImportedInvestmentCents() {
  const stocks = db.select().from(stockPositions).all().reduce((sum, item) => sum + item.currentCents, 0);
  const cryptos = db.select().from(cryptoPositions).all().reduce((sum, item) => sum + item.currentCents, 0);
  return stocks + cryptos;
}

export function getCurrentNetWorthSummary(): NetWorthSummary {
  const realizedLiquidCents = getLiquidAccountBalanceCents();
  const latest = getLatestNetWorthSummaryRow();
  const importedReserveCents = getImportedReserveCents();
  const importedInvestmentCents = getImportedInvestmentCents();
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
```

## `services\onboarding.service.ts`
```typescript
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
```

## `services\recurring.service.ts`
```typescript
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { recurringOccurrences, recurringRules, transactions } from "@/db/schema";
import { parseCurrencyToCents } from "@/lib/currency";
import { isoMonth, nowTs } from "@/lib/dates";
import { materializeOccurrences, type TransactionDirection } from "@/lib/finance";
import { uid } from "@/lib/utils";
import type { RecurringRuleCreateInput } from "@/lib/validation";

function normalizeDirection(value: string): TransactionDirection {
  return ["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"].includes(value) ? (value as TransactionDirection) : "expense";
}

function normalizeFrequency(value: string): "weekly" | "monthly" | "yearly" {
  return value === "weekly" || value === "yearly" ? value : "monthly";
}

export function listRecurringRules() {
  return db.select().from(recurringRules).all().map((rule) => ({
    ...rule,
    occurrences: db.select().from(recurringOccurrences).all().filter((occurrence) => occurrence.ruleId === rule.id).sort((a, b) => a.dueOn.localeCompare(b.dueOn))
  }));
}

export function createRecurringRule(input: RecurringRuleCreateInput) {
  const now = nowTs();
  const id = uid("rr");
  db.insert(recurringRules).values({
    id,
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    title: input.title,
    direction: input.direction,
    frequency: input.frequency,
    amountCents: parseCurrencyToCents(input.amount),
    startsOn: input.startsOn,
    endsOn: null,
    nextRunOn: input.nextRunOn,
    autoPost: false,
    notes: input.notes ?? "",
    isActive: true,
    createdAt: now,
    updatedAt: now
  }).run();
  materializeRule(id);
}

export function materializeRule(ruleId: string) {
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, ruleId)).get();
  if (!rule) return;
  const generated = materializeOccurrences({
    nextRunOn: rule.nextRunOn,
    endsOn: rule.endsOn,
    frequency: normalizeFrequency(rule.frequency),
    amountCents: rule.amountCents,
    direction: normalizeDirection(rule.direction)
  });
  const now = nowTs();
  for (const occurrence of generated) {
    const exists = db.select().from(recurringOccurrences).all().find((row) => row.ruleId === rule.id && row.dueOn === occurrence.dueOn);
    if (exists) continue;
    db.insert(recurringOccurrences).values({
      id: uid("ro"),
      ruleId: rule.id,
      dueOn: occurrence.dueOn,
      amountCents: occurrence.amountCents,
      direction: occurrence.direction,
      status: "scheduled",
      transactionId: null,
      notes: "",
      createdAt: now,
      updatedAt: now
    }).run();
  }
}

export function materializeAllRules() {
  db.select().from(recurringRules).where(eq(recurringRules.isActive, true)).all().forEach((rule) => materializeRule(rule.id));
}

export function settleOccurrence(occurrenceId: string) {
  const occurrence = db.select().from(recurringOccurrences).where(eq(recurringOccurrences.id, occurrenceId)).get();
  if (!occurrence) throw new Error("OcorrÃªncia nÃ£o encontrada.");
  const rule = db.select().from(recurringRules).where(eq(recurringRules.id, occurrence.ruleId)).get();
  if (!rule) throw new Error("Regra nÃ£o encontrada.");
  const now = nowTs();
  const transactionId = uid("txn");
  db.insert(transactions).values({
    id: transactionId,
    accountId: rule.accountId,
    categoryId: rule.categoryId,
    subcategoryId: null,
    transferId: null,
    recurringOccurrenceId: occurrence.id,
    sourceImportRowId: null,
    direction: occurrence.direction,
    status: "posted",
    description: rule.title,
    counterparty: "",
    amountCents: occurrence.amountCents,
    occurredOn: occurrence.dueOn,
    dueOn: occurrence.dueOn,
    competenceMonth: isoMonth(occurrence.dueOn),
    notes: "Gerado a partir de recorrÃªncia.",
    isProjected: false,
    createdAt: now,
    updatedAt: now
  }).run();
  db.update(recurringOccurrences).set({ status: "posted", transactionId, updatedAt: now }).where(eq(recurringOccurrences.id, occurrence.id)).run();
}
```

## `services\settings.service.ts`
```typescript
import { db } from "@/db/client";
import { settings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { nowTs } from "@/lib/dates";

export function getSettings() {
  return db.select().from(settings).where(eq(settings.id, "main")).get();
}

export function ensureSettings() {
  const existing = getSettings();
  if (existing) return existing;
  const now = nowTs();
  db
    .insert(settings)
    .values({
      id: "main",
      baseCurrency: "BRL",
      locale: "pt-BR",
      projectionMonths: 6,
      themePreference: "system",
      userDisplayName: "VocÃª",
      isOnboarded: false,
      createdAt: now,
      updatedAt: now
    })
    .run();
  return getSettings()!;
}
```

## `services\transactions.service.ts`
```typescript
import { db } from "@/db/client";
import { transfers, transactions } from "@/db/schema";
import { isoMonth, nowTs } from "@/lib/dates";
import { parseCurrencyToCents } from "@/lib/currency";
import { uid } from "@/lib/utils";
import { desc, eq } from "drizzle-orm";
import type { TransactionCreateInput } from "@/lib/validation";

export function listTransactions(params?: { month?: string; accountId?: string; limit?: number }) {
  let rows = db.select().from(transactions).orderBy(desc(transactions.occurredOn), desc(transactions.createdAt)).all();
  if (params?.month) rows = rows.filter((row) => row.competenceMonth === params.month);
  if (params?.accountId) rows = rows.filter((row) => row.accountId === params.accountId);
  return rows.slice(0, params?.limit ?? rows.length);
}

export function createTransaction(input: TransactionCreateInput) {
  const now = nowTs();
  db.insert(transactions).values({
    id: uid("txn"),
    accountId: input.accountId,
    categoryId: input.categoryId ?? null,
    subcategoryId: input.subcategoryId ?? null,
    direction: input.direction,
    status: input.status,
    description: input.description,
    counterparty: "",
    amountCents: parseCurrencyToCents(input.amount),
    occurredOn: input.occurredOn,
    dueOn: input.dueOn ?? input.occurredOn,
    competenceMonth: isoMonth(input.occurredOn),
    notes: input.notes ?? "",
    isProjected: input.status !== "posted",
    createdAt: now,
    updatedAt: now
  }).run();
}

export function deleteTransaction(id: string) {
  db.delete(transactions).where(eq(transactions.id, id)).run();
}

export function createTransfer(values: { fromAccountId: string; toAccountId: string; amountCents: number; occurredOn: string; notes?: string }) {
  const now = nowTs();
  const transferId = uid("trf");
  const outId = uid("txn");
  const inId = uid("txn");
  db.insert(transfers).values({
    id: transferId,
    fromAccountId: values.fromAccountId,
    toAccountId: values.toAccountId,
    amountCents: values.amountCents,
    occurredOn: values.occurredOn,
    notes: values.notes ?? "",
    outTransactionId: outId,
    inTransactionId: inId,
    createdAt: now
  }).run();
  db.insert(transactions).values([
    {
      id: outId,
      accountId: values.fromAccountId,
      direction: "transfer_out",
      status: "posted",
      description: `Transferência para ${values.toAccountId}`,
      counterparty: values.toAccountId,
      amountCents: values.amountCents,
      occurredOn: values.occurredOn,
      dueOn: values.occurredOn,
      competenceMonth: isoMonth(values.occurredOn),
      notes: values.notes ?? "",
      isProjected: false,
      transferId,
      createdAt: now,
      updatedAt: now
    },
    {
      id: inId,
      accountId: values.toAccountId,
      direction: "transfer_in",
      status: "posted",
      description: `Transferência recebida de ${values.fromAccountId}`,
      counterparty: values.fromAccountId,
      amountCents: values.amountCents,
      occurredOn: values.occurredOn,
      dueOn: values.occurredOn,
      competenceMonth: isoMonth(values.occurredOn),
      notes: values.notes ?? "",
      isProjected: false,
      transferId,
      createdAt: now,
      updatedAt: now
    }
  ]).run();
}
```

## `lib\cn.ts`
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## `lib\constants.ts`
```typescript
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "Aurea Finance";
export const DB_PATH = process.env.DATABASE_URL ?? "./data/aurea-finance.sqlite";
export const DEFAULT_CURRENCY = "BRL";
export const INSTALLMENT_LABEL_PATTERN = /\((\d+)\/(\d+)\)/;
```

## `lib\currency.ts`
```typescript
const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

export function parseCurrencyToCents(input: string | number | null | undefined) {
  if (typeof input === "number") return Math.round(input * 100);
  if (!input) return 0;
  const normalized = input
    .toString()
    .trim()
    .replace(/\./g, "")
    .replace(/,/g, ".")
    .replace(/[^0-9.-]/g, "");
  const numeric = Number(normalized);
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
}

export function toSafeCents(input: string | number | null | undefined) {
  return parseCurrencyToCents(input);
}

export function formatCurrencyFromCents(cents: number, currency = "BRL", locale = "pt-BR") {
  if (currency === "BRL" && locale === "pt-BR") {
    return brl.format((cents ?? 0) / 100);
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format((cents ?? 0) / 100);
}
```

## `lib\dates.ts`
```typescript
import { addDays, addMonths, endOfMonth, format, parse, startOfMonth } from "date-fns";

export function nowTs() {
  return Date.now();
}

export function todayIso() {
  return format(new Date(), "yyyy-MM-dd");
}

export function isoDate(value: Date | string) {
  return format(typeof value === "string" ? new Date(value) : value, "yyyy-MM-dd");
}

export function isoMonth(value: Date | string) {
  return format(typeof value === "string" ? new Date(value) : value, "yyyy-MM");
}

export function startOfMonthIso(value: Date | string) {
  return format(startOfMonth(typeof value === "string" ? new Date(value) : value), "yyyy-MM-dd");
}

export function endOfMonthIso(value: Date | string) {
  return format(endOfMonth(typeof value === "string" ? new Date(value) : value), "yyyy-MM-dd");
}

export function addMonthsIso(date: string, amount: number) {
  return format(addMonths(new Date(date), amount), "yyyy-MM-dd");
}

export function addDaysIso(date: string, amount: number) {
  return format(addDays(new Date(date), amount), "yyyy-MM-dd");
}

export function parseBrazilianDate(value: string) {
  return parse(value, "dd/MM/yyyy", new Date());
}
```

## `lib\domain\balance.ts`
```typescript
export type LedgerEntry = {
  accountId: string;
  type: "income" | "expense" | "transfer_in" | "transfer_out" | "adjustment";
  amountCents: number;
  status: "realized" | "projected" | "pending";
};

export function computeAccountBalance(initialBalanceCents: number, entries: LedgerEntry[]) {
  return entries.reduce((acc, entry) => {
    if (entry.status !== "realized") return acc;
    if (entry.type === "expense" || entry.type === "transfer_out") return acc - entry.amountCents;
    return acc + entry.amountCents;
  }, initialBalanceCents);
}

export function computeProjectedBalance(initialBalanceCents: number, entries: LedgerEntry[]) {
  return entries.reduce((acc, entry) => {
    if (entry.type === "expense" || entry.type === "transfer_out") return acc - entry.amountCents;
    return acc + entry.amountCents;
  }, initialBalanceCents);
}

export function summarizeCashFlow(entries: LedgerEntry[]) {
  return entries.reduce(
    (acc, entry) => {
      if (entry.type === "income") acc.income += entry.amountCents;
      if (entry.type === "expense") acc.expense += entry.amountCents;
      return acc;
    },
    { income: 0, expense: 0 }
  );
}
```

## `lib\domain\import-mapping.ts`
```typescript
export type SheetInventory = {
  name: string;
  rowCount: number;
  columnCount: number;
  sampleHeaders: string[];
};

export type DetectedEntity =
  | "accounts_ledger" | "credit_cards" | "monthly_projection"
  | "dashboard_snapshot" | "investment_summary" | "net_worth_timeseries"
  | "daily_balance_series" | "custom_planner" | "unknown";

export function detectEntityFromSheet(sheet: SheetInventory): DetectedEntity {
  const name = sheet.name.toLowerCase();
  const headers = sheet.sampleHeaders.join(" ").toLowerCase();
  if (name.includes("cart")) return "credit_cards";
  if (name.includes("conta")) return "accounts_ledger";
  if (name.includes("acompanhamento")) return "monthly_projection";
  if (name.includes("visão geral") || name.includes("visao geral")) return "dashboard_snapshot";
  if (name.includes("resumo do investimento")) return "investment_summary";
  if (name.includes("registro diário de investimentos") || name.includes("registro diario de investimentos")) return "net_worth_timeseries";
  if (name.includes("registro diário") || name.includes("registro diario")) return "daily_balance_series";
  if (name.includes("richard")) return "custom_planner";
  if (headers.includes("valor") && headers.includes("data")) return "accounts_ledger";
  return "unknown";
}

export type ColumnGuess = { source: string; target: string; confidence: "high" | "medium" | "low" };

export function guessColumns(headers: string[]): ColumnGuess[] {
  return headers.map((header) => {
    const value = header.toLowerCase();
    if (value.includes("data")) return { source: header, target: "occurredOn", confidence: "high" };
    if (value.includes("descr") || value.includes("nome")) return { source: header, target: "description", confidence: "high" };
    if (value.includes("valor")) return { source: header, target: "amountCents", confidence: "high" };
    if (value.includes("categoria")) return { source: header, target: "categoryName", confidence: "medium" };
    if (value.includes("conta")) return { source: header, target: "accountName", confidence: "medium" };
    return { source: header, target: "manual_review", confidence: "low" };
  });
}
```

## `lib\domain\import-validation.ts`
```typescript
export type ValidationIssue = {
  code: string;
  severity: "error" | "warning";
  field?: string;
  message: string;
};

export function validateGenericFinanceRow(row: Record<string, unknown>) {
  const issues: ValidationIssue[] = [];
  if (!row.occurredOn && !row.date) {
    issues.push({ code: "missing_date", severity: "error", field: "occurredOn", message: "Linha sem data." });
  }
  if (row.amountCents == null && row.amount == null && row.valor == null) {
    issues.push({ code: "missing_amount", severity: "error", field: "amountCents", message: "Linha sem valor monetário." });
  }
  const maybeAmount = row.amountCents ?? row.amount ?? row.valor;
  if (maybeAmount === 0 || maybeAmount === "0") {
    issues.push({ code: "zero_amount", severity: "warning", field: "amountCents", message: "Valor igual a zero, revisar relevância." });
  }
  if (!row.description && !row.descricao && !row.nome) {
    issues.push({ code: "missing_description", severity: "warning", field: "description", message: "Linha sem descrição legível." });
  }
  return issues;
}
```

## `lib\domain\installments.ts`
```typescript
export type GeneratedInstallment = {
  installmentNumber: number;
  totalInstallments: number;
  amountCents: number;
  billMonth: string;
  dueOn: string;
};

function splitEvenly(totalCents: number, count: number) {
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

function addMonths(date: Date, amount: number) {
  const copy = new Date(date); copy.setMonth(copy.getMonth() + amount); return copy;
}
function setDay(date: Date, day: number) {
  const copy = new Date(date); copy.setDate(day); return copy;
}
function toIsoDate(date: Date) { return date.toISOString().slice(0, 10); }
function toIsoMonth(date: Date) { return date.toISOString().slice(0, 7); }

function resolveBillAnchor(purchaseDate: Date, closingDay: number) {
  const afterClosing = purchaseDate.getDate() > closingDay;
  return addMonths(new Date(purchaseDate.getFullYear(), purchaseDate.getMonth(), 1), afterClosing ? 1 : 0);
}
function resolveDueDate(monthAnchor: Date, dueDay: number) {
  return setDay(addMonths(monthAnchor, 1), dueDay);
}

export function generateCardInstallments(params: {
  purchaseDate: Date; totalCents: number; installmentCount: number; closingDay: number; dueDay: number;
}): GeneratedInstallment[] {
  const { purchaseDate, totalCents, installmentCount, closingDay, dueDay } = params;
  const amounts = splitEvenly(totalCents, installmentCount);
  const firstBill = resolveBillAnchor(purchaseDate, closingDay);
  return amounts.map((amountCents, index) => {
    const billAnchor = addMonths(firstBill, index);
    return {
      installmentNumber: index + 1,
      totalInstallments: installmentCount,
      amountCents,
      billMonth: toIsoMonth(billAnchor),
      dueOn: toIsoDate(resolveDueDate(billAnchor, dueDay))
    };
  });
}
```

## `lib\domain\recurrence.ts`
```typescript
export type RecurrenceFrequency = "weekly" | "monthly" | "quarterly";
export type GeneratedOccurrence = { dueOn: string; referenceKey: string };

function addDays(date: Date, amount: number) { const c = new Date(date); c.setDate(c.getDate() + amount); return c; }
function addWeeks(date: Date, amount: number) { return addDays(date, amount * 7); }
function addMonths(date: Date, amount: number) { const c = new Date(date); c.setMonth(c.getMonth() + amount); return c; }
function setDay(date: Date, day: number) { const c = new Date(date); c.setDate(day); return c; }
function toIsoDate(date: Date) { return date.toISOString().slice(0, 10); }

export function generateOccurrences(params: {
  startDate: Date; monthsAhead?: number; totalOccurrences?: number;
  frequency: RecurrenceFrequency; dayOfMonth?: number;
}): GeneratedOccurrence[] {
  const { startDate, monthsAhead = 6, totalOccurrences, frequency, dayOfMonth } = params;
  const results: GeneratedOccurrence[] = [];
  let cursor = new Date(startDate);
  let guard = 0;
  const maxDate = addMonths(startDate, monthsAhead);

  while (guard < 366) {
    if (frequency === "weekly") {
      cursor = results.length === 0 ? new Date(startDate) : addWeeks(cursor, 1);
    } else {
      const step = frequency === "monthly" ? results.length : results.length * 3;
      cursor = setDay(addMonths(startDate, step), dayOfMonth ?? startDate.getDate());
    }
    if (cursor > maxDate) break;
    results.push({ dueOn: toIsoDate(cursor), referenceKey: toIsoDate(cursor) });
    guard += 1;
    if (totalOccurrences && results.length >= totalOccurrences) break;
  }
  return results;
}
```

## `lib\finance.ts`
```typescript
import { INSTALLMENT_LABEL_PATTERN } from "@/lib/constants";
import { addMonthsIso, isoDate, isoMonth, startOfMonthIso } from "@/lib/dates";

export type TransactionDirection =
  | "income"
  | "expense"
  | "transfer_in"
  | "transfer_out"
  | "bill_payment"
  | "adjustment";

export type TransactionStatus = "posted" | "scheduled" | "void";

export type BalanceTransaction = {
  direction: TransactionDirection;
  amountCents: number;
  status: TransactionStatus;
};

export function signedAmount(direction: TransactionDirection, amountCents: number) {
  if (direction === "income" || direction === "transfer_in") return Math.abs(amountCents);
  return -Math.abs(amountCents);
}

export function calculateBalance(openingBalanceCents: number, transactions: BalanceTransaction[]) {
  return transactions
    .filter((transaction) => transaction.status === "posted")
    .reduce((sum, transaction) => sum + signedAmount(transaction.direction, transaction.amountCents), openingBalanceCents);
}

export function calculateProjectedBalance(openingBalanceCents: number, transactions: BalanceTransaction[]) {
  return transactions.reduce((sum, transaction) => {
    if (transaction.status === "void") return sum;
    return sum + signedAmount(transaction.direction, transaction.amountCents);
  }, openingBalanceCents);
}

export function splitInstallments(totalAmountCents: number, count: number) {
  const base = Math.floor(totalAmountCents / count);
  const remainder = totalAmountCents - base * count;
  return Array.from({ length: count }, (_, index) => base + (index < remainder ? 1 : 0));
}

export function resolveBillMonthForPurchase(purchaseDate: string, closeDay: number) {
  const date = new Date(purchaseDate);
  const purchaseDay = Number(isoDate(date).slice(8, 10));
  if (purchaseDay <= closeDay) return isoMonth(date);
  return isoMonth(new Date(addMonthsIso(startOfMonthIso(date), 1)));
}

export function resolveBillDueDate(billMonth: string, dueDay: number) {
  const due = new Date(addMonthsIso(`${billMonth}-01`, 1));
  due.setDate(dueDay);
  return isoDate(due);
}

export function resolveBillCloseDate(billMonth: string, closeDay: number) {
  const close = new Date(`${billMonth}-01`);
  close.setDate(closeDay);
  return isoDate(close);
}

export function generateInstallments(input: {
  purchaseDate: string;
  totalAmountCents: number;
  installmentCount: number;
  closeDay: number;
  dueDay: number;
}) {
  const firstBillMonth = resolveBillMonthForPurchase(input.purchaseDate, input.closeDay);
  return splitInstallments(input.totalAmountCents, input.installmentCount).map((amountCents, index) => {
    const billMonth = isoMonth(new Date(addMonthsIso(`${firstBillMonth}-01`, index)));
    return {
      installmentNumber: index + 1,
      amountCents,
      billMonth,
      billClosedOn: resolveBillCloseDate(billMonth, input.closeDay),
      billDueOn: resolveBillDueDate(billMonth, input.dueDay)
    };
  });
}

export function materializeOccurrences(rule: {
  nextRunOn: string;
  endsOn?: string | null;
  frequency: "weekly" | "monthly" | "yearly";
  amountCents: number;
  direction: TransactionDirection;
}, horizonMonths = 3) {
  const items: { dueOn: string; amountCents: number; direction: TransactionDirection }[] = [];
  let cursor = rule.nextRunOn;
  const limit = addMonthsIso(startOfMonthIso(rule.nextRunOn), horizonMonths);
  while (cursor <= limit) {
    if (!rule.endsOn || cursor <= rule.endsOn) {
      items.push({ dueOn: cursor, amountCents: rule.amountCents, direction: rule.direction });
    }
    cursor = rule.frequency === "weekly" ? addDaysIso(cursor, 7) : rule.frequency === "yearly" ? addMonthsIso(cursor, 12) : addMonthsIso(cursor, 1);
  }
  return items;
}

function addDaysIso(date: string, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return isoDate(next);
}

export function closeMonthSnapshot(input: {
  openingBalanceCents: number;
  incomesCents: number;
  expensesCents: number;
  transfersNetCents: number;
  projectedBillPaymentsCents: number;
}) {
  const realizedNetCents = input.incomesCents - input.expensesCents;
  const closingBalanceCents = input.openingBalanceCents + realizedNetCents + input.transfersNetCents;
  return {
    realizedNetCents,
    closingBalanceCents,
    projectedFreeCashCents: closingBalanceCents - input.projectedBillPaymentsCents
  };
}

export function parseInstallmentLabel(description: string) {
  const match = description.match(INSTALLMENT_LABEL_PATTERN);
  if (!match) return null;
  return { current: Number(match[1]), total: Number(match[2]) };
}
```

## `lib\formatters.ts`
```typescript
import { format } from "date-fns";
import { formatCurrency } from "@/lib/money";

export function formatShortDate(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "dd/MM/yyyy");
}

export function formatMonthRef(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  return format(date, "MM/yyyy");
}

export { formatCurrency };
```

## `lib\money-bootstrap.ts`
```typescript
export type MoneyAccountSeed = {
  name: string;
  institution: string;
  type: "checking" | "savings" | "cash" | "investment" | "reserve" | "credit_card_settlement";
  openingBalanceCents: number;
  includeInNetWorth: boolean;
  notes: string;
};

export type MoneyCardSeed = {
  name: string;
  brand: string;
  network: string;
  limitAmountCents: number;
  closeDay: number;
  dueDay: number;
  settlementAccountName: string;
};

export type MoneyRecurringSeed = {
  title: string;
  amountCents: number;
  direction: "income" | "expense";
  frequency: "weekly" | "monthly" | "yearly";
  startsOn: string;
  nextRunOn: string;
  accountName: string;
  notes: string;
};

export type MoneyBillSeed = {
  cardSlug: string;
  billMonth: string;
  dueOn: string;
  closesOn: string;
  totalAmountCents: number;
};

export type MoneyBillEntrySeed = {
  cardSlug: string;
  dueOn: string;
  description: string;
  amountCents: number;
  entryType: "installment" | "recurring";
};

export type MoneyReserveSeed = {
  name: string;
  investedCents: number;
  previousValueCents: number;
  currentValueCents: number;
  totalProfitCents: number;
  yieldTotalPercent: number;
  monthlyProfitCents: number;
  yieldMonthlyPercent: number;
};

export type MoneyStockSeed = {
  ticker: string;
  fullName: string;
  quantity: number;
  investedCents: number;
  previousCents: number;
  currentCents: number;
  resultTotalCents: number;
  rentabilityTotalPercent: number | null;
};

export type MoneyCryptoSeed = {
  name: string;
  quantity: number;
  investedCents: number;
  previousCents: number;
  currentCents: number;
  totalProfitCents: number;
};

export type MoneyAssetTradeSeed = {
  action: "compra" | "venda";
  assetName: string;
  quantity: number;
  tradeDate: string;
  totalInitialCents: number;
  pricePerUnitInitialCents: number;
  totalCurrentCents: number;
  pricePerUnitCurrentCents: number;
  yieldPercent: number | null;
  descriptionText: string;
  isCompleted: boolean;
};

export type MoneyBootstrapDataset = {
  "generatedAt": "2026-03-25",
  "currency": "BRL",
  "locale": "pt-BR",
  "sheetInventory": [
    {
      "name": "1. Acompanhamento Mensal",
      "rows": 1502,
      "columns": 17,
      "sampleHeaders": [
        "Data:",
        "Saldo de Hoje (25/03/2026)",
        "941.54",
        "-1281.65",
        "Realidade do Dia (25/03) nos PrÃ³ximos Meses",
        "2026-03-25 00:00:00",
        "1631.61",
        "0"
      ]
    },
    {
      "name": "2. VisÃ£o Geral",
      "rows": 1005,
      "columns": 21,
      "sampleHeaders": [
        "Total",
        "NuBank",
        "Banco do Brasil",
        "MercadoPago",
        "Inter",
        "Binance",
        "NuBank",
        "AÃ§Ãµes:"
      ]
    },
    {
      "name": "3. Contas",
      "rows": 363,
      "columns": 68,
      "sampleHeaders": [
        "Ãgua",
        "BK1",
        "2026-03-25 00:00:00",
        "HOJE",
        "-88.48000000000047",
        "R",
        "2026-01-01 00:00:00",
        "MPInvest"
      ]
    },
    {
      "name": "4. TransaÃ§Ãµes",
      "rows": 150,
      "columns": 12,
      "sampleHeaders": [
        "AÃ§Ã£o:",
        "CriptoMoeda:",
        "Quantidade:",
        "Data:",
        "HorÃ¡rio:",
        "Valor Inicial:",
        "Valor Inicial p/Unid",
        "Valor Final:"
      ]
    },
    {
      "name": "5. CartÃµes",
      "rows": 97,
      "columns": 16,
      "sampleHeaders": [
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago",
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago"
      ]
    },
    {
      "name": "6. Richard",
      "rows": 17,
      "columns": 12,
      "sampleHeaders": [
        "Incluir no MÃªs Atual?",
        "Incluir no MÃªs Seguinte?",
        "Incluir no MÃªs Posterior ao seguinte?",
        "Emoji",
        "Nome da Conta:",
        "Valor",
        "ðŸ“† *MarÃ§o*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (4/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (2/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 53,50*\n - Airfryer (4/4) R$ 53,50\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total MarÃ§o: R$ 1.313,01*",
        "ðŸ“† *Abril*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (5/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (3/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 0,00*\n\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\nðŸŒ Energia: *R$ 55,41*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total Abril: R$ 1.314,91*"
      ]
    },
    {
      "name": "7. Resumo do Investimento",
      "rows": 1,
      "columns": 1,
      "sampleHeaders": [
        "Resumo do Investimento:\n--- AÃ§Ãµes ---\nEquatorial Energia - EQTL3: Investido R$ 65,02 | Atual R$ 82,34\nOuro - GOLD11: Investido R$ 26,81 | Atual R$ 24,03\nMercadoLibre - MELI34: Investido R$ 206,07 | Atual R$ 141,68\nApple - AAPL34: Investido R$ 0,00 | Atual R$ 0,00\nTotal AÃ§Ãµes: R$ 423,39 â†’ R$ 370,42\n--- Criptomoedas ---\nCriptomoedas:: Investido R$ Valor Investido: | Atual R$ Valor Atual:\nPi: Investido R$ 750,00 | Atual R$ 817,22\nBitcoin: Investido R$ 133,28 | Atual R$ 239,71\nEthereum: Investido R$ 427,24 | Atual R$ 232,36\nSolana: Investido R$ 386,07 | Atual R$ 183,10\nChainLink: Investido R$ 120,00 | Atual R$ 48,87\nRender: Investido R$ 54,00 | Atual R$ 40,05\nFartCoin: Investido R$ 29,00 | Atual R$ 19,54\nSui: Investido R$ 54,00 | Atual R$ 18,20\nCurve DAO: Investido R$ 28,25 | Atual R$ 18,14\nSAPIEN: Investido R$ 29,16 | Atual R$ 14,42\nUSDT: Investido R$ 0,00 | Atual R$ 0,00\nTotal Cripto: R$ 2011,00 â†’ R$ 1631,61\n--- Reservas ---\nReservas:: Investido R$ Valor Anterior: | Atual R$ Valor Atual:\nMeliDÃ³lar: Investido R$ 3731,43 | Atual R$ 3806,69\nCarta de Motorista: Investido R$ 2136,87 | Atual R$ 2139,03\nFuturo: Investido R$ 811,82 | Atual R$ 812,64\nNotebook: Investido R$ 695,23 | Atual R$ 695,93\nAÃ§Ãµes: Investido R$ 32,41 | Atual R$ 32,26\nCrypto: Investido R$ 32,23 | Atual R$ 32,44\nTotal Reservas: R$ 7439,99 â†’ R$ 7518,99\n--- Investimento Geral ---\nTotal Investido: R$ 9874,38 | Total Atual: R$ 9521,02\n--- TransaÃ§Ãµes Recentes ---\nComprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.\nVendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.\nComprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.\nComprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.\nComprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.\nComprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.\nComprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.\nComprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.\nComprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.\nComprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.\nComprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.\nComprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%."
      ]
    },
    {
      "name": "8. Registro DiÃ¡rio",
      "rows": 1162,
      "columns": 8,
      "sampleHeaders": [
        "2025-04-20 00:00:00",
        "10:08:48",
        "2528.1"
      ]
    },
    {
      "name": "9. Registro DiÃ¡rio de Investime",
      "rows": 1199,
      "columns": 12,
      "sampleHeaders": [
        "2025-08-27 00:00:00",
        "08:36:27",
        "7346.89",
        "110.03",
        "272.78",
        "7729.7",
        "7518.99"
      ]
    }
  ],
  "accounts": [
    {
      "name": "NuBank CC",
      "institution": "NuBank",
      "type": "checking",
      "openingBalanceCents": 23,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "Banco do Brasil CC",
      "institution": "Banco do Brasil",
      "type": "checking",
      "openingBalanceCents": 1425,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "MercadoPago CC",
      "institution": "MercadoPago",
      "type": "checking",
      "openingBalanceCents": 98952,
      "includeInNetWorth": true,
      "notes": "Conta corrente principal com liquidez mais alta na planilha."
    },
    {
      "name": "Inter CDI",
      "institution": "Inter",
      "type": "savings",
      "openingBalanceCents": 2048,
      "includeInNetWorth": true,
      "notes": "Conta/caixa de liquidez no Inter."
    },
    {
      "name": "MPInvest",
      "institution": "MercadoPago",
      "type": "reserve",
      "openingBalanceCents": 751899,
      "includeInNetWorth": true,
      "notes": "Reserva identificada como MPInvest."
    },
    {
      "name": "NuInvest",
      "institution": "NuBank",
      "type": "investment",
      "openingBalanceCents": 37042,
      "includeInNetWorth": true,
      "notes": "Carteira de aÃ§Ãµes ligada ao ecossistema Nubank."
    },
    {
      "name": "Binance",
      "institution": "Binance",
      "type": "investment",
      "openingBalanceCents": 163161,
      "includeInNetWorth": true,
      "notes": "Carteira cripto consolidada."
    }
  ],
  "cards": [
    {
      "name": "CartÃ£o Nubank",
      "brand": "Nubank",
      "network": "Mastercard",
      "limitAmountCents": 300000,
      "closeDay": 18,
      "dueDay": 25,
      "settlementAccountName": "NuBank CC"
    },
    {
      "name": "CartÃ£o MercadoPago",
      "brand": "Mercado Pago",
      "network": "Visa",
      "limitAmountCents": 150000,
      "closeDay": 8,
      "dueDay": 15,
      "settlementAccountName": "MercadoPago CC"
    }
  ],
  "recurring": [
    {
      "title": "Mesada",
      "amountCents": 100000,
      "direction": "income",
      "frequency": "monthly",
      "startsOn": "2026-01-12",
      "nextRunOn": "2026-04-12",
      "accountName": "MercadoPago CC",
      "notes": "Reconhecido pela repetiÃ§Ã£o mensal na aba Contas."
    },
    {
      "title": "MPInvest",
      "amountCents": 8000,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-01",
      "nextRunOn": "2026-04-01",
      "accountName": "MercadoPago CC",
      "notes": "Aporte mensal identificado na planilha Money."
    },
    {
      "title": "Notebook Futuro",
      "amountCents": 21012,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-26",
      "nextRunOn": "2026-04-25",
      "accountName": "MercadoPago CC",
      "notes": "Objetivo/reserva recorrente identificado na planilha."
    },
    {
      "title": "Aluguel",
      "amountCents": 60183,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-05",
      "nextRunOn": "2026-04-05",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Internet",
      "amountCents": 4076,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-10",
      "nextRunOn": "2026-04-10",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Energia",
      "amountCents": 5541,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-04-19",
      "nextRunOn": "2026-04-19",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo inferido com revisÃ£o assistida."
    },
    {
      "title": "Micro-Ondas",
      "amountCents": 5067,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-20",
      "nextRunOn": "2026-04-20",
      "accountName": "MercadoPago CC",
      "notes": "Parcela fixa destacada na aba Richard."
    }
  ],
  "cardBills": [
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-03",
      "dueOn": "2026-03-15",
      "closesOn": "2026-03-08",
      "totalAmountCents": 24642
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-04",
      "dueOn": "2026-04-15",
      "closesOn": "2026-04-08",
      "totalAmountCents": 19311
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-05",
      "dueOn": "2026-05-15",
      "closesOn": "2026-05-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-06",
      "dueOn": "2026-06-15",
      "closesOn": "2026-06-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-07",
      "dueOn": "2026-07-15",
      "closesOn": "2026-07-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-08",
      "dueOn": "2026-08-15",
      "closesOn": "2026-08-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-09",
      "dueOn": "2026-09-15",
      "closesOn": "2026-09-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-10",
      "dueOn": "2026-10-15",
      "closesOn": "2026-10-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-11",
      "dueOn": "2026-11-15",
      "closesOn": "2026-11-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-12",
      "dueOn": "2026-12-15",
      "closesOn": "2026-12-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-01",
      "dueOn": "2027-01-15",
      "closesOn": "2027-01-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-02",
      "dueOn": "2027-02-15",
      "closesOn": "2027-02-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-03",
      "dueOn": "2027-03-15",
      "closesOn": "2027-03-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-04",
      "dueOn": "2027-04-15",
      "closesOn": "2027-04-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-05",
      "dueOn": "2027-05-15",
      "closesOn": "2027-05-08",
      "totalAmountCents": 3348
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-03",
      "dueOn": "2026-03-25",
      "closesOn": "2026-03-18",
      "totalAmountCents": 99034
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-04",
      "dueOn": "2026-04-25",
      "closesOn": "2026-04-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-05",
      "dueOn": "2026-05-25",
      "closesOn": "2026-05-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-06",
      "dueOn": "2026-06-25",
      "closesOn": "2026-06-18",
      "totalAmountCents": 68071
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-07",
      "dueOn": "2026-07-25",
      "closesOn": "2026-07-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-08",
      "dueOn": "2026-08-25",
      "closesOn": "2026-08-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-09",
      "dueOn": "2026-09-25",
      "closesOn": "2026-09-18",
      "totalAmountCents": 41635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-10",
      "dueOn": "2026-10-25",
      "closesOn": "2026-10-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-11",
      "dueOn": "2026-11-25",
      "closesOn": "2026-11-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-12",
      "dueOn": "2026-12-25",
      "closesOn": "2026-12-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2027-01",
      "dueOn": "2027-01-25",
      "closesOn": "2027-01-18",
      "totalAmountCents": 25635
    }
  ],
  "cardEntries": [
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tablet (12/12)",
      "amountCents": 15000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Airfryer (4/4)",
      "amountCents": 5350,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Violino (4/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (5/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tenis - Darter Pro (3/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Sapato (3/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mochila Mizuno (3/3)",
      "amountCents": 1828,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Monitor (4/18)",
      "amountCents": 3332,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Bicicleta (2/15)",
      "amountCents": 2797,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "UltraBoost 5 - Netshoes (2/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Cadeira (2/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Iphone 16e (2/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Terno (2/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Uber (1/1)",
      "amountCents": 8733,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (2/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mouse (1/1)",
      "amountCents": 6249,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Bicicleta (3/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Violino (5/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (6/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Tenis - Darter Pro (4/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Sapato (4/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Monitor (5/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "UltraBoost 5 - Netshoes (3/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Cadeira (3/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Iphone 16e (3/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Terno (3/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (3/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Violino (6/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Tenis - Darter Pro (5/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Bicicleta (4/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Monitor (6/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "UltraBoost 5 - Netshoes (4/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Cadeira (4/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Iphone 16e (4/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Terno (4/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Violino (7/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Bicicleta (5/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Cadeira Gamer (6/6)",
      "amountCents": 4446,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Monitor (7/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Cadeira (5/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "UltraBoost 5 - Netshoes (5/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Terno (5/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Iphone 16e (5/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Bicicleta (6/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Monitor (8/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Violino (8/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Cadeira (6/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Iphone 16e (6/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Terno (6/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Violino (9/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Bicicleta (7/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Monitor (9/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Iphone 16e (7/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Cadeira (7/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Terno (7/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Violino (10/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Iphone 16e (8/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Bicicleta (8./15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Monitor (10/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-10-25",
      "description": "Iphone 16e (9/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Cadeira (8/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Terno (8/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-11-25",
      "description": "Iphone 16e (10/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Bicicleta (9/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-12-25",
      "description": "Iphone 16e (11/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Monitor (11/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2027-01-25",
      "description": "Iphone 16e (12/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Terno (9/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Bicicleta (10/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Monitor (12/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Terno (10/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Bicicleta (11/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Monitor (13/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Monitor (14/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Bicicleta (12/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Monitor (15/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Bicicleta (13/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Monitor (16/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Bicicleta (14/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Bicicleta (15/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Monitor (17/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-05-15",
      "description": "Monitor (18/18)",
      "amountCents": 3348,
      "entryType": "installment"
    }
  ],
  "netWorthSummary": {
    "month": "2026-03",
    "reservesCents": 751899,
    "investmentsCents": 200203,
    "debtsCents": 118344
  },
  "reserves": [
    {
      "name": "MeliDÃ³lar",
      "investedCents": 305084,
      "previousValueCents": 373143,
      "currentValueCents": 380669,
      "totalProfitCents": 75585,
      "yieldTotalPercent": 0.2477514389,
      "monthlyProfitCents": 7526,
      "yieldMonthlyPercent": 0.02016921127
    },
    {
      "name": "Carta de Motorista",
      "investedCents": 150000,
      "previousValueCents": 213687,
      "currentValueCents": 213903,
      "totalProfitCents": 63903,
      "yieldTotalPercent": 0.42602,
      "monthlyProfitCents": 216,
      "yieldMonthlyPercent": 0.001010824243
    },
    {
      "name": "Futuro",
      "investedCents": 62000,
      "previousValueCents": 81182,
      "currentValueCents": 81264,
      "totalProfitCents": 19264,
      "yieldTotalPercent": 0.3107096774,
      "monthlyProfitCents": 82,
      "yieldMonthlyPercent": 0.001010076125
    },
    {
      "name": "Notebook",
      "investedCents": 215000,
      "previousValueCents": 69523,
      "currentValueCents": 69593,
      "totalProfitCents": -145407,
      "yieldTotalPercent": -0.6763116279,
      "monthlyProfitCents": 70,
      "yieldMonthlyPercent": 0.001006861039
    },
    {
      "name": "AÃ§Ãµes",
      "investedCents": 1600,
      "previousValueCents": 3241,
      "currentValueCents": 3226,
      "totalProfitCents": 1626,
      "yieldTotalPercent": 1.01625,
      "monthlyProfitCents": -15,
      "yieldMonthlyPercent": -0.004628201172
    },
    {
      "name": "Crypto",
      "investedCents": 1600,
      "previousValueCents": 3223,
      "currentValueCents": 3244,
      "totalProfitCents": 1644,
      "yieldTotalPercent": 1.0275,
      "monthlyProfitCents": 21,
      "yieldMonthlyPercent": 0.006515668632
    }
  ],
  "stockPositions": [
    {
      "ticker": "AMBP3",
      "fullName": "Ambipar - AMBP3",
      "quantity": 19,
      "investedCents": 969,
      "previousCents": 399,
      "currentCents": 437,
      "resultTotalCents": -532,
      "rentabilityTotalPercent": -0.5490196078
    },
    {
      "ticker": "BABA34",
      "fullName": "Alibaba - BABA34",
      "quantity": 5,
      "investedCents": 11580,
      "previousCents": 11870,
      "currentCents": 11800,
      "resultTotalCents": 220,
      "rentabilityTotalPercent": 0.01899827288
    },
    {
      "ticker": "EQTL3",
      "fullName": "Equatorial Energia - EQTL3",
      "quantity": 2,
      "investedCents": 6502,
      "previousCents": 8272,
      "currentCents": 8234,
      "resultTotalCents": 1732,
      "rentabilityTotalPercent": 0.2663795755
    },
    {
      "ticker": "GOLD11",
      "fullName": "Ouro - GOLD11",
      "quantity": 1,
      "investedCents": 2681,
      "previousCents": 2396,
      "currentCents": 2403,
      "resultTotalCents": -278,
      "rentabilityTotalPercent": -0.103692652
    },
    {
      "ticker": "MELI34",
      "fullName": "MercadoLibre - MELI34",
      "quantity": 2,
      "investedCents": 20607,
      "previousCents": 14600,
      "currentCents": 14168,
      "resultTotalCents": -6439,
      "rentabilityTotalPercent": -0.3124666376
    },
    {
      "ticker": "AAPL34",
      "fullName": "Apple - AAPL34",
      "quantity": 5,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    },
    {
      "ticker": "EGIE3",
      "fullName": "Engie Brasil - EGIE3",
      "quantity": 0,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    }
  ],
  "cryptoPositions": [
    {
      "name": "Pi",
      "quantity": 829.0,
      "investedCents": 75000,
      "previousCents": 81621,
      "currentCents": 81722,
      "totalProfitCents": 6722
    },
    {
      "name": "Bitcoin",
      "quantity": 0.00032967,
      "investedCents": 13328,
      "previousCents": 23887,
      "currentCents": 23971,
      "totalProfitCents": 10643
    },
    {
      "name": "Ethereum",
      "quantity": 0.02030612,
      "investedCents": 42724,
      "previousCents": 23115,
      "currentCents": 23236,
      "totalProfitCents": -19488
    },
    {
      "name": "Solana",
      "quantity": 0.37639607,
      "investedCents": 38607,
      "previousCents": 18153,
      "currentCents": 18310,
      "totalProfitCents": -20297
    },
    {
      "name": "ChainLink",
      "quantity": 0.99073401,
      "investedCents": 12000,
      "previousCents": 4810,
      "currentCents": 4887,
      "totalProfitCents": -7113
    },
    {
      "name": "Render",
      "quantity": 4.08591,
      "investedCents": 5400,
      "previousCents": 3727,
      "currentCents": 4005,
      "totalProfitCents": -1395
    },
    {
      "name": "FartCoin",
      "quantity": 19.13824,
      "investedCents": 2900,
      "previousCents": 1812,
      "currentCents": 1954,
      "totalProfitCents": -946
    },
    {
      "name": "Sui",
      "quantity": 3.5964,
      "investedCents": 5400,
      "previousCents": 1800,
      "currentCents": 1820,
      "totalProfitCents": -3580
    },
    {
      "name": "Curve DAO",
      "quantity": 14.8,
      "investedCents": 2824,
      "previousCents": 1751,
      "currentCents": 1814,
      "totalProfitCents": -1010
    },
    {
      "name": "SAPIEN",
      "quantity": 35.4645,
      "investedCents": 2916,
      "previousCents": 1466,
      "currentCents": 1442,
      "totalProfitCents": -1474
    },
    {
      "name": "USDT",
      "quantity": 15.98141462,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "totalProfitCents": 0
    }
  ],
  "assetTrades": [
    {
      "action": "compra",
      "assetName": "Alibaba - BABA34",
      "quantity": 13.0,
      "tradeDate": "2025-08-28",
      "totalInitialCents": 30118,
      "pricePerUnitInitialCents": 2317,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.01865993758,
      "descriptionText": "Comprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 4.0,
      "tradeDate": "2025-09-02",
      "totalInitialCents": 10632,
      "pricePerUnitInitialCents": 2658,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1472873365,
      "descriptionText": "Vendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-03",
      "totalInitialCents": 5314,
      "pricePerUnitInitialCents": 2657,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1468557009,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-04",
      "totalInitialCents": 5082,
      "pricePerUnitInitialCents": 2541,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.09678597516,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "ChainLink",
      "quantity": 0.83,
      "tradeDate": "2025-09-05",
      "totalInitialCents": 9933,
      "pricePerUnitInitialCents": 11967,
      "totalCurrentCents": 4887,
      "pricePerUnitCurrentCents": 4933,
      "yieldPercent": -0.587804848,
      "descriptionText": "Comprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "MercadoLibre - MELI34",
      "quantity": 2.0,
      "tradeDate": "2025-09-12",
      "totalInitialCents": 20600,
      "pricePerUnitInitialCents": 10300,
      "totalCurrentCents": 14168,
      "pricePerUnitCurrentCents": 7084,
      "yieldPercent": -0.3122330097,
      "descriptionText": "Comprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.01690952,
      "tradeDate": "2025-09-25",
      "totalInitialCents": 33284,
      "pricePerUnitInitialCents": 1968359,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4186600274,
      "descriptionText": "Comprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Sui",
      "quantity": 3.6,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5418,
      "pricePerUnitInitialCents": 1505,
      "totalCurrentCents": 1820,
      "pricePerUnitCurrentCents": 506,
      "yieldPercent": -0.6637464338,
      "descriptionText": "Comprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Render",
      "quantity": 4.09,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5493,
      "pricePerUnitInitialCents": 1343,
      "totalCurrentCents": 4005,
      "pricePerUnitCurrentCents": 980,
      "yieldPercent": -0.2701431112,
      "descriptionText": "Comprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Solana",
      "quantity": 0.33,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 33594,
      "pricePerUnitInitialCents": 101800,
      "totalCurrentCents": 18310,
      "pricePerUnitCurrentCents": 48646,
      "yieldPercent": -0.5221457136,
      "descriptionText": "Comprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.0034,
      "tradeDate": "2026-03-25",
      "totalInitialCents": 6936,
      "pricePerUnitInitialCents": 2040000,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4390757034,
      "descriptionText": "Comprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "SAPIEN",
      "quantity": 35.4645,
      "tradeDate": "2025-12-09",
      "totalInitialCents": 2950,
      "pricePerUnitInitialCents": 83,
      "totalCurrentCents": 1442,
      "pricePerUnitCurrentCents": 41,
      "yieldPercent": -0.5111864407,
      "descriptionText": "Comprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Curve DAO",
      "quantity": 14.8,
      "tradeDate": "2025-12-15",
      "totalInitialCents": 2825,
      "pricePerUnitInitialCents": 191,
      "totalCurrentCents": 1814,
      "pricePerUnitCurrentCents": 123,
      "yieldPercent": -0.3578761062,
      "descriptionText": "Comprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "FartCoin",
      "quantity": 19.13824,
      "tradeDate": "2025-12-18",
      "totalInitialCents": 2900,
      "pricePerUnitInitialCents": 152,
      "totalCurrentCents": 1954,
      "pricePerUnitCurrentCents": 102,
      "yieldPercent": -0.3262068966,
      "descriptionText": "Comprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%.",
      "isCompleted": true
    }
  ],
  "dashboardHints": {
    "consolidatedAccountsCents": 1054550,
    "openBillsCents": 118344,
    "nextRecurringWindowCents": 103879
  }
} & {
  accounts: MoneyAccountSeed[];
  cards: MoneyCardSeed[];
  recurring: MoneyRecurringSeed[];
  cardBills: MoneyBillSeed[];
  cardEntries: MoneyBillEntrySeed[];
  reserves: MoneyReserveSeed[];
  stockPositions: MoneyStockSeed[];
  cryptoPositions: MoneyCryptoSeed[];
  assetTrades: MoneyAssetTradeSeed[];
};

export const moneyBootstrapDataset = {
  "generatedAt": "2026-03-25",
  "currency": "BRL",
  "locale": "pt-BR",
  "sheetInventory": [
    {
      "name": "1. Acompanhamento Mensal",
      "rows": 1502,
      "columns": 17,
      "sampleHeaders": [
        "Data:",
        "Saldo de Hoje (25/03/2026)",
        "941.54",
        "-1281.65",
        "Realidade do Dia (25/03) nos PrÃ³ximos Meses",
        "2026-03-25 00:00:00",
        "1631.61",
        "0"
      ]
    },
    {
      "name": "2. VisÃ£o Geral",
      "rows": 1005,
      "columns": 21,
      "sampleHeaders": [
        "Total",
        "NuBank",
        "Banco do Brasil",
        "MercadoPago",
        "Inter",
        "Binance",
        "NuBank",
        "AÃ§Ãµes:"
      ]
    },
    {
      "name": "3. Contas",
      "rows": 363,
      "columns": 68,
      "sampleHeaders": [
        "Ãgua",
        "BK1",
        "2026-03-25 00:00:00",
        "HOJE",
        "-88.48000000000047",
        "R",
        "2026-01-01 00:00:00",
        "MPInvest"
      ]
    },
    {
      "name": "4. TransaÃ§Ãµes",
      "rows": 150,
      "columns": 12,
      "sampleHeaders": [
        "AÃ§Ã£o:",
        "CriptoMoeda:",
        "Quantidade:",
        "Data:",
        "HorÃ¡rio:",
        "Valor Inicial:",
        "Valor Inicial p/Unid",
        "Valor Final:"
      ]
    },
    {
      "name": "5. CartÃµes",
      "rows": 97,
      "columns": 16,
      "sampleHeaders": [
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago",
        "CartÃ£o Nubank",
        "CartÃ£o MercadoPago"
      ]
    },
    {
      "name": "6. Richard",
      "rows": 17,
      "columns": 12,
      "sampleHeaders": [
        "Incluir no MÃªs Atual?",
        "Incluir no MÃªs Seguinte?",
        "Incluir no MÃªs Posterior ao seguinte?",
        "Emoji",
        "Nome da Conta:",
        "Valor",
        "ðŸ“† *MarÃ§o*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (4/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (2/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 53,50*\n - Airfryer (4/4) R$ 53,50\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total MarÃ§o: R$ 1.313,01*",
        "ðŸ“† *Abril*\n\nðŸ’³ Nubank: *R$ 566,25*\n - Violino (5/10) R$ 160,00\n - SmartFit R$ 149,90\n - Iphone 16e (3/12) R$ 256,35\n\nðŸ’³ Mercado Pago: *R$ 0,00*\n\n\nðŸ  Aluguel: *R$ 601,83*\nâš¡ Internet: *R$ 40,76*\nðŸŒ Energia: *R$ 55,41*\n Micro-Ondas: *R$ 50,67*\n\nâœ… *Total Abril: R$ 1.314,91*"
      ]
    },
    {
      "name": "7. Resumo do Investimento",
      "rows": 1,
      "columns": 1,
      "sampleHeaders": [
        "Resumo do Investimento:\n--- AÃ§Ãµes ---\nEquatorial Energia - EQTL3: Investido R$ 65,02 | Atual R$ 82,34\nOuro - GOLD11: Investido R$ 26,81 | Atual R$ 24,03\nMercadoLibre - MELI34: Investido R$ 206,07 | Atual R$ 141,68\nApple - AAPL34: Investido R$ 0,00 | Atual R$ 0,00\nTotal AÃ§Ãµes: R$ 423,39 â†’ R$ 370,42\n--- Criptomoedas ---\nCriptomoedas:: Investido R$ Valor Investido: | Atual R$ Valor Atual:\nPi: Investido R$ 750,00 | Atual R$ 817,22\nBitcoin: Investido R$ 133,28 | Atual R$ 239,71\nEthereum: Investido R$ 427,24 | Atual R$ 232,36\nSolana: Investido R$ 386,07 | Atual R$ 183,10\nChainLink: Investido R$ 120,00 | Atual R$ 48,87\nRender: Investido R$ 54,00 | Atual R$ 40,05\nFartCoin: Investido R$ 29,00 | Atual R$ 19,54\nSui: Investido R$ 54,00 | Atual R$ 18,20\nCurve DAO: Investido R$ 28,25 | Atual R$ 18,14\nSAPIEN: Investido R$ 29,16 | Atual R$ 14,42\nUSDT: Investido R$ 0,00 | Atual R$ 0,00\nTotal Cripto: R$ 2011,00 â†’ R$ 1631,61\n--- Reservas ---\nReservas:: Investido R$ Valor Anterior: | Atual R$ Valor Atual:\nMeliDÃ³lar: Investido R$ 3731,43 | Atual R$ 3806,69\nCarta de Motorista: Investido R$ 2136,87 | Atual R$ 2139,03\nFuturo: Investido R$ 811,82 | Atual R$ 812,64\nNotebook: Investido R$ 695,23 | Atual R$ 695,93\nAÃ§Ãµes: Investido R$ 32,41 | Atual R$ 32,26\nCrypto: Investido R$ 32,23 | Atual R$ 32,44\nTotal Reservas: R$ 7439,99 â†’ R$ 7518,99\n--- Investimento Geral ---\nTotal Investido: R$ 9874,38 | Total Atual: R$ 9521,02\n--- TransaÃ§Ãµes Recentes ---\nComprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.\nVendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.\nVendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.\nComprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.\nComprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.\nComprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.\nComprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.\nComprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.\nComprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.\nComprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.\nComprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.\nComprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.\nComprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%."
      ]
    },
    {
      "name": "8. Registro DiÃ¡rio",
      "rows": 1162,
      "columns": 8,
      "sampleHeaders": [
        "2025-04-20 00:00:00",
        "10:08:48",
        "2528.1"
      ]
    },
    {
      "name": "9. Registro DiÃ¡rio de Investime",
      "rows": 1199,
      "columns": 12,
      "sampleHeaders": [
        "2025-08-27 00:00:00",
        "08:36:27",
        "7346.89",
        "110.03",
        "272.78",
        "7729.7",
        "7518.99"
      ]
    }
  ],
  "accounts": [
    {
      "name": "NuBank CC",
      "institution": "NuBank",
      "type": "checking",
      "openingBalanceCents": 23,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "Banco do Brasil CC",
      "institution": "Banco do Brasil",
      "type": "checking",
      "openingBalanceCents": 1425,
      "includeInNetWorth": true,
      "notes": "Conta corrente identificada na aba VisÃ£o Geral."
    },
    {
      "name": "MercadoPago CC",
      "institution": "MercadoPago",
      "type": "checking",
      "openingBalanceCents": 98952,
      "includeInNetWorth": true,
      "notes": "Conta corrente principal com liquidez mais alta na planilha."
    },
    {
      "name": "Inter CDI",
      "institution": "Inter",
      "type": "savings",
      "openingBalanceCents": 2048,
      "includeInNetWorth": true,
      "notes": "Conta/caixa de liquidez no Inter."
    },
    {
      "name": "MPInvest",
      "institution": "MercadoPago",
      "type": "reserve",
      "openingBalanceCents": 751899,
      "includeInNetWorth": true,
      "notes": "Reserva identificada como MPInvest."
    },
    {
      "name": "NuInvest",
      "institution": "NuBank",
      "type": "investment",
      "openingBalanceCents": 37042,
      "includeInNetWorth": true,
      "notes": "Carteira de aÃ§Ãµes ligada ao ecossistema Nubank."
    },
    {
      "name": "Binance",
      "institution": "Binance",
      "type": "investment",
      "openingBalanceCents": 163161,
      "includeInNetWorth": true,
      "notes": "Carteira cripto consolidada."
    }
  ],
  "cards": [
    {
      "name": "CartÃ£o Nubank",
      "brand": "Nubank",
      "network": "Mastercard",
      "limitAmountCents": 300000,
      "closeDay": 18,
      "dueDay": 25,
      "settlementAccountName": "NuBank CC"
    },
    {
      "name": "CartÃ£o MercadoPago",
      "brand": "Mercado Pago",
      "network": "Visa",
      "limitAmountCents": 150000,
      "closeDay": 8,
      "dueDay": 15,
      "settlementAccountName": "MercadoPago CC"
    }
  ],
  "recurring": [
    {
      "title": "Mesada",
      "amountCents": 100000,
      "direction": "income",
      "frequency": "monthly",
      "startsOn": "2026-01-12",
      "nextRunOn": "2026-04-12",
      "accountName": "MercadoPago CC",
      "notes": "Reconhecido pela repetiÃ§Ã£o mensal na aba Contas."
    },
    {
      "title": "MPInvest",
      "amountCents": 8000,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-01",
      "nextRunOn": "2026-04-01",
      "accountName": "MercadoPago CC",
      "notes": "Aporte mensal identificado na planilha Money."
    },
    {
      "title": "Notebook Futuro",
      "amountCents": 21012,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-01-26",
      "nextRunOn": "2026-04-25",
      "accountName": "MercadoPago CC",
      "notes": "Objetivo/reserva recorrente identificado na planilha."
    },
    {
      "title": "Aluguel",
      "amountCents": 60183,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-05",
      "nextRunOn": "2026-04-05",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Internet",
      "amountCents": 4076,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-10",
      "nextRunOn": "2026-04-10",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo da aba Richard."
    },
    {
      "title": "Energia",
      "amountCents": 5541,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-04-19",
      "nextRunOn": "2026-04-19",
      "accountName": "MercadoPago CC",
      "notes": "Compromisso fixo inferido com revisÃ£o assistida."
    },
    {
      "title": "Micro-Ondas",
      "amountCents": 5067,
      "direction": "expense",
      "frequency": "monthly",
      "startsOn": "2026-03-20",
      "nextRunOn": "2026-04-20",
      "accountName": "MercadoPago CC",
      "notes": "Parcela fixa destacada na aba Richard."
    }
  ],
  "cardBills": [
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-03",
      "dueOn": "2026-03-15",
      "closesOn": "2026-03-08",
      "totalAmountCents": 24642
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-04",
      "dueOn": "2026-04-15",
      "closesOn": "2026-04-08",
      "totalAmountCents": 19311
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-05",
      "dueOn": "2026-05-15",
      "closesOn": "2026-05-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-06",
      "dueOn": "2026-06-15",
      "closesOn": "2026-06-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-07",
      "dueOn": "2026-07-15",
      "closesOn": "2026-07-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-08",
      "dueOn": "2026-08-15",
      "closesOn": "2026-08-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-09",
      "dueOn": "2026-09-15",
      "closesOn": "2026-09-08",
      "totalAmountCents": 13876
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-10",
      "dueOn": "2026-10-15",
      "closesOn": "2026-10-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-11",
      "dueOn": "2026-11-15",
      "closesOn": "2026-11-08",
      "totalAmountCents": 10012
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2026-12",
      "dueOn": "2026-12-15",
      "closesOn": "2026-12-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-01",
      "dueOn": "2027-01-15",
      "closesOn": "2027-01-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-02",
      "dueOn": "2027-02-15",
      "closesOn": "2027-02-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-03",
      "dueOn": "2027-03-15",
      "closesOn": "2027-03-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-04",
      "dueOn": "2027-04-15",
      "closesOn": "2027-04-08",
      "totalAmountCents": 6148
    },
    {
      "cardSlug": "cartao-mercadopago",
      "billMonth": "2027-05",
      "dueOn": "2027-05-15",
      "closesOn": "2027-05-08",
      "totalAmountCents": 3348
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-03",
      "dueOn": "2026-03-25",
      "closesOn": "2026-03-18",
      "totalAmountCents": 99034
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-04",
      "dueOn": "2026-04-25",
      "closesOn": "2026-04-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-05",
      "dueOn": "2026-05-25",
      "closesOn": "2026-05-18",
      "totalAmountCents": 67224
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-06",
      "dueOn": "2026-06-25",
      "closesOn": "2026-06-18",
      "totalAmountCents": 68071
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-07",
      "dueOn": "2026-07-25",
      "closesOn": "2026-07-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-08",
      "dueOn": "2026-08-25",
      "closesOn": "2026-08-18",
      "totalAmountCents": 56625
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-09",
      "dueOn": "2026-09-25",
      "closesOn": "2026-09-18",
      "totalAmountCents": 41635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-10",
      "dueOn": "2026-10-25",
      "closesOn": "2026-10-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-11",
      "dueOn": "2026-11-25",
      "closesOn": "2026-11-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2026-12",
      "dueOn": "2026-12-25",
      "closesOn": "2026-12-18",
      "totalAmountCents": 25635
    },
    {
      "cardSlug": "cartao-nubank",
      "billMonth": "2027-01",
      "dueOn": "2027-01-25",
      "closesOn": "2027-01-18",
      "totalAmountCents": 25635
    }
  ],
  "cardEntries": [
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tablet (12/12)",
      "amountCents": 15000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Airfryer (4/4)",
      "amountCents": 5350,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Violino (4/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (5/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Tenis - Darter Pro (3/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Sapato (3/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mochila Mizuno (3/3)",
      "amountCents": 1828,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Monitor (4/18)",
      "amountCents": 3332,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Bicicleta (2/15)",
      "amountCents": 2797,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "UltraBoost 5 - Netshoes (2/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Cadeira (2/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Iphone 16e (2/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Terno (2/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Uber (1/1)",
      "amountCents": 8733,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-03-15",
      "description": "Shorts (2/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-03-25",
      "description": "Mouse (1/1)",
      "amountCents": 6249,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Bicicleta (3/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Violino (5/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (6/6)",
      "amountCents": 1365,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Tenis - Darter Pro (4/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Sapato (4/4)",
      "amountCents": 1898,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Monitor (5/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "UltraBoost 5 - Netshoes (3/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Cadeira (3/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-04-25",
      "description": "Iphone 16e (3/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Terno (3/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-04-15",
      "description": "Shorts (3/3)",
      "amountCents": 2172,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Violino (6/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Tenis - Darter Pro (5/5)",
      "amountCents": 3599,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Bicicleta (4/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Monitor (6/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "UltraBoost 5 - Netshoes (4/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Cadeira (4/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-05-25",
      "description": "Iphone 16e (4/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-05-15",
      "description": "Terno (4/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Violino (7/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Bicicleta (5/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Cadeira Gamer (6/6)",
      "amountCents": 4446,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Monitor (7/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Cadeira (5/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "UltraBoost 5 - Netshoes (5/5)",
      "amountCents": 7000,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-06-15",
      "description": "Terno (5/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-06-25",
      "description": "Iphone 16e (5/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Bicicleta (6/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Monitor (8/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Violino (8/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Cadeira (6/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-07-25",
      "description": "Iphone 16e (6/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-07-15",
      "description": "Terno (6/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Violino (9/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Bicicleta (7/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "SmartFit",
      "amountCents": 14990,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Monitor (9/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-08-25",
      "description": "Iphone 16e (7/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Cadeira (7/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-08-15",
      "description": "Terno (7/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Violino (10/10)",
      "amountCents": 16000,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-09-25",
      "description": "Iphone 16e (8/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Bicicleta (8./15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Monitor (10/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-10-25",
      "description": "Iphone 16e (9/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Cadeira (8/8)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-09-15",
      "description": "Terno (8/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-11-25",
      "description": "Iphone 16e (10/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Bicicleta (9/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2026-12-25",
      "description": "Iphone 16e (11/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Monitor (11/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-nubank",
      "dueOn": "2027-01-25",
      "description": "Iphone 16e (12/12)",
      "amountCents": 25635,
      "entryType": "recurring"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-10-15",
      "description": "Terno (9/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Bicicleta (10/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Monitor (12/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-11-15",
      "description": "Terno (10/10)",
      "amountCents": 3864,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Bicicleta (11/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2026-12-15",
      "description": "Monitor (13/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Monitor (14/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-01-15",
      "description": "Bicicleta (12/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Monitor (15/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-02-15",
      "description": "Bicicleta (13/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Monitor (16/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-03-15",
      "description": "Bicicleta (14/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Bicicleta (15/15)",
      "amountCents": 2800,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-04-15",
      "description": "Monitor (17/18)",
      "amountCents": 3348,
      "entryType": "installment"
    },
    {
      "cardSlug": "cartao-mercadopago",
      "dueOn": "2027-05-15",
      "description": "Monitor (18/18)",
      "amountCents": 3348,
      "entryType": "installment"
    }
  ],
  "netWorthSummary": {
    "month": "2026-03",
    "reservesCents": 751899,
    "investmentsCents": 200203,
    "debtsCents": 118344
  },
  "reserves": [
    {
      "name": "MeliDÃ³lar",
      "investedCents": 305084,
      "previousValueCents": 373143,
      "currentValueCents": 380669,
      "totalProfitCents": 75585,
      "yieldTotalPercent": 0.2477514389,
      "monthlyProfitCents": 7526,
      "yieldMonthlyPercent": 0.02016921127
    },
    {
      "name": "Carta de Motorista",
      "investedCents": 150000,
      "previousValueCents": 213687,
      "currentValueCents": 213903,
      "totalProfitCents": 63903,
      "yieldTotalPercent": 0.42602,
      "monthlyProfitCents": 216,
      "yieldMonthlyPercent": 0.001010824243
    },
    {
      "name": "Futuro",
      "investedCents": 62000,
      "previousValueCents": 81182,
      "currentValueCents": 81264,
      "totalProfitCents": 19264,
      "yieldTotalPercent": 0.3107096774,
      "monthlyProfitCents": 82,
      "yieldMonthlyPercent": 0.001010076125
    },
    {
      "name": "Notebook",
      "investedCents": 215000,
      "previousValueCents": 69523,
      "currentValueCents": 69593,
      "totalProfitCents": -145407,
      "yieldTotalPercent": -0.6763116279,
      "monthlyProfitCents": 70,
      "yieldMonthlyPercent": 0.001006861039
    },
    {
      "name": "AÃ§Ãµes",
      "investedCents": 1600,
      "previousValueCents": 3241,
      "currentValueCents": 3226,
      "totalProfitCents": 1626,
      "yieldTotalPercent": 1.01625,
      "monthlyProfitCents": -15,
      "yieldMonthlyPercent": -0.004628201172
    },
    {
      "name": "Crypto",
      "investedCents": 1600,
      "previousValueCents": 3223,
      "currentValueCents": 3244,
      "totalProfitCents": 1644,
      "yieldTotalPercent": 1.0275,
      "monthlyProfitCents": 21,
      "yieldMonthlyPercent": 0.006515668632
    }
  ],
  "stockPositions": [
    {
      "ticker": "AMBP3",
      "fullName": "Ambipar - AMBP3",
      "quantity": 19,
      "investedCents": 969,
      "previousCents": 399,
      "currentCents": 437,
      "resultTotalCents": -532,
      "rentabilityTotalPercent": -0.5490196078
    },
    {
      "ticker": "BABA34",
      "fullName": "Alibaba - BABA34",
      "quantity": 5,
      "investedCents": 11580,
      "previousCents": 11870,
      "currentCents": 11800,
      "resultTotalCents": 220,
      "rentabilityTotalPercent": 0.01899827288
    },
    {
      "ticker": "EQTL3",
      "fullName": "Equatorial Energia - EQTL3",
      "quantity": 2,
      "investedCents": 6502,
      "previousCents": 8272,
      "currentCents": 8234,
      "resultTotalCents": 1732,
      "rentabilityTotalPercent": 0.2663795755
    },
    {
      "ticker": "GOLD11",
      "fullName": "Ouro - GOLD11",
      "quantity": 1,
      "investedCents": 2681,
      "previousCents": 2396,
      "currentCents": 2403,
      "resultTotalCents": -278,
      "rentabilityTotalPercent": -0.103692652
    },
    {
      "ticker": "MELI34",
      "fullName": "MercadoLibre - MELI34",
      "quantity": 2,
      "investedCents": 20607,
      "previousCents": 14600,
      "currentCents": 14168,
      "resultTotalCents": -6439,
      "rentabilityTotalPercent": -0.3124666376
    },
    {
      "ticker": "AAPL34",
      "fullName": "Apple - AAPL34",
      "quantity": 5,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    },
    {
      "ticker": "EGIE3",
      "fullName": "Engie Brasil - EGIE3",
      "quantity": 0,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "resultTotalCents": 0,
      "rentabilityTotalPercent": null
    }
  ],
  "cryptoPositions": [
    {
      "name": "Pi",
      "quantity": 829.0,
      "investedCents": 75000,
      "previousCents": 81621,
      "currentCents": 81722,
      "totalProfitCents": 6722
    },
    {
      "name": "Bitcoin",
      "quantity": 0.00032967,
      "investedCents": 13328,
      "previousCents": 23887,
      "currentCents": 23971,
      "totalProfitCents": 10643
    },
    {
      "name": "Ethereum",
      "quantity": 0.02030612,
      "investedCents": 42724,
      "previousCents": 23115,
      "currentCents": 23236,
      "totalProfitCents": -19488
    },
    {
      "name": "Solana",
      "quantity": 0.37639607,
      "investedCents": 38607,
      "previousCents": 18153,
      "currentCents": 18310,
      "totalProfitCents": -20297
    },
    {
      "name": "ChainLink",
      "quantity": 0.99073401,
      "investedCents": 12000,
      "previousCents": 4810,
      "currentCents": 4887,
      "totalProfitCents": -7113
    },
    {
      "name": "Render",
      "quantity": 4.08591,
      "investedCents": 5400,
      "previousCents": 3727,
      "currentCents": 4005,
      "totalProfitCents": -1395
    },
    {
      "name": "FartCoin",
      "quantity": 19.13824,
      "investedCents": 2900,
      "previousCents": 1812,
      "currentCents": 1954,
      "totalProfitCents": -946
    },
    {
      "name": "Sui",
      "quantity": 3.5964,
      "investedCents": 5400,
      "previousCents": 1800,
      "currentCents": 1820,
      "totalProfitCents": -3580
    },
    {
      "name": "Curve DAO",
      "quantity": 14.8,
      "investedCents": 2824,
      "previousCents": 1751,
      "currentCents": 1814,
      "totalProfitCents": -1010
    },
    {
      "name": "SAPIEN",
      "quantity": 35.4645,
      "investedCents": 2916,
      "previousCents": 1466,
      "currentCents": 1442,
      "totalProfitCents": -1474
    },
    {
      "name": "USDT",
      "quantity": 15.98141462,
      "investedCents": 0,
      "previousCents": 0,
      "currentCents": 0,
      "totalProfitCents": 0
    }
  ],
  "assetTrades": [
    {
      "action": "compra",
      "assetName": "Alibaba - BABA34",
      "quantity": 13.0,
      "tradeDate": "2025-08-28",
      "totalInitialCents": 30118,
      "pricePerUnitInitialCents": 2317,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.01865993758,
      "descriptionText": "Comprei 13 Alibaba - BABA34 no dia 28/08/2025 Ã s 10:38:00. O valor de compra (p/unid): R$ 23,17. Atualmente (p/unid): R$ 23,60, gerando acrÃ©scimo de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 4.0,
      "tradeDate": "2025-09-02",
      "totalInitialCents": 10632,
      "pricePerUnitInitialCents": 2658,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1472873365,
      "descriptionText": "Vendi 4 Alibaba - BABA34 no dia 02/09/2025 Ã s 10:48:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,58, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-03",
      "totalInitialCents": 5314,
      "pricePerUnitInitialCents": 2657,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.1468557009,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 03/09/2025 Ã s 10:23:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 26,57, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "venda",
      "assetName": "Alibaba - BABA34",
      "quantity": 2.0,
      "tradeDate": "2025-09-04",
      "totalInitialCents": 5082,
      "pricePerUnitInitialCents": 2541,
      "totalCurrentCents": 11800,
      "pricePerUnitCurrentCents": 2360,
      "yieldPercent": 0.09678597516,
      "descriptionText": "Vendi 2 Alibaba - BABA34 no dia 04/09/2025 Ã s 11:12:00. O valor de compra (p/unid): R$ 23,17. O valor de venda (p/unid): R$ 25,41, gerando lucro de 1,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "ChainLink",
      "quantity": 0.83,
      "tradeDate": "2025-09-05",
      "totalInitialCents": 9933,
      "pricePerUnitInitialCents": 11967,
      "totalCurrentCents": 4887,
      "pricePerUnitCurrentCents": 4933,
      "yieldPercent": -0.587804848,
      "descriptionText": "Comprei 0,83 ChainLink no dia 05/09/2025 Ã s 14:58:00. O valor de compra (p/unid): R$ 119,67. Atualmente (p/unid): R$ 49,33, gerando decrÃ©scimo de 58,78%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "MercadoLibre - MELI34",
      "quantity": 2.0,
      "tradeDate": "2025-09-12",
      "totalInitialCents": 20600,
      "pricePerUnitInitialCents": 10300,
      "totalCurrentCents": 14168,
      "pricePerUnitCurrentCents": 7084,
      "yieldPercent": -0.3122330097,
      "descriptionText": "Comprei 2 MercadoLibre - MELI34 no dia 12/09/2025 Ã s 11:08:00. O valor de compra (p/unid): R$ 103,00. Atualmente (p/unid): R$ 70,84, gerando decrÃ©scimo de 31,22%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.01690952,
      "tradeDate": "2025-09-25",
      "totalInitialCents": 33284,
      "pricePerUnitInitialCents": 1968359,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4186600274,
      "descriptionText": "Comprei 0,01690952 Ethereum no dia 25/09/2025 Ã s 07:18:28. O valor de compra (p/unid): R$ 19.683,59. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 41,87%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Sui",
      "quantity": 3.6,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5418,
      "pricePerUnitInitialCents": 1505,
      "totalCurrentCents": 1820,
      "pricePerUnitCurrentCents": 506,
      "yieldPercent": -0.6637464338,
      "descriptionText": "Comprei 3,6 Sui no dia 10/10/2025 Ã s 20:29:23. O valor de compra (p/unid): R$ 15,05. Atualmente (p/unid): R$ 5,06, gerando decrÃ©scimo de 66,37%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Render",
      "quantity": 4.09,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 5493,
      "pricePerUnitInitialCents": 1343,
      "totalCurrentCents": 4005,
      "pricePerUnitCurrentCents": 980,
      "yieldPercent": -0.2701431112,
      "descriptionText": "Comprei 4,09 Render no dia 10/10/2025 Ã s 20:29:58. O valor de compra (p/unid): R$ 13,43. Atualmente (p/unid): R$ 9,80, gerando decrÃ©scimo de 27,01%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Solana",
      "quantity": 0.33,
      "tradeDate": "2025-10-10",
      "totalInitialCents": 33594,
      "pricePerUnitInitialCents": 101800,
      "totalCurrentCents": 18310,
      "pricePerUnitCurrentCents": 48646,
      "yieldPercent": -0.5221457136,
      "descriptionText": "Comprei 0,33 Solana no dia 10/10/2025 Ã s 02:54:21. O valor de compra (p/unid): R$ 1.018,00. Atualmente (p/unid): R$ 486,46, gerando decrÃ©scimo de 52,21%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Ethereum",
      "quantity": 0.0034,
      "tradeDate": "2026-03-25",
      "totalInitialCents": 6936,
      "pricePerUnitInitialCents": 2040000,
      "totalCurrentCents": 23236,
      "pricePerUnitCurrentCents": 1144286,
      "yieldPercent": -0.4390757034,
      "descriptionText": "Comprei 0,0034 Ethereum no dia 25/03/2026 Ã s 05:16:16. O valor de compra (p/unid): R$ 20.400,00. Atualmente (p/unid): R$ 11.442,86, gerando decrÃ©scimo de 43,91%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "SAPIEN",
      "quantity": 35.4645,
      "tradeDate": "2025-12-09",
      "totalInitialCents": 2950,
      "pricePerUnitInitialCents": 83,
      "totalCurrentCents": 1442,
      "pricePerUnitCurrentCents": 41,
      "yieldPercent": -0.5111864407,
      "descriptionText": "Comprei 35,4645 SAPIEN no dia 09/12/2025 Ã s 05:31:50. O valor de compra (p/unid): R$ 0,83. Atualmente (p/unid): R$ 0,41, gerando decrÃ©scimo de 51,12%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "Curve DAO",
      "quantity": 14.8,
      "tradeDate": "2025-12-15",
      "totalInitialCents": 2825,
      "pricePerUnitInitialCents": 191,
      "totalCurrentCents": 1814,
      "pricePerUnitCurrentCents": 123,
      "yieldPercent": -0.3578761062,
      "descriptionText": "Comprei 14,8 Curve DAO no dia 15/12/2025 Ã s 14:32:42. O valor de compra (p/unid): R$ 1,91. Atualmente (p/unid): R$ 1,23, gerando decrÃ©scimo de 35,79%.",
      "isCompleted": true
    },
    {
      "action": "compra",
      "assetName": "FartCoin",
      "quantity": 19.13824,
      "tradeDate": "2025-12-18",
      "totalInitialCents": 2900,
      "pricePerUnitInitialCents": 152,
      "totalCurrentCents": 1954,
      "pricePerUnitCurrentCents": 102,
      "yieldPercent": -0.3262068966,
      "descriptionText": "Comprei 19,13824 FartCoin no dia 18/12/2025 Ã s 08:04:51. O valor de compra (p/unid): R$ 1,52. Atualmente (p/unid): R$ 1,02, gerando decrÃ©scimo de 32,62%.",
      "isCompleted": true
    }
  ],
  "dashboardHints": {
    "consolidatedAccountsCents": 1054550,
    "openBillsCents": 118344,
    "nextRecurringWindowCents": 103879
  }
} as const satisfies MoneyBootstrapDataset;

export function getMoneySheetByName(name: string) {
  return moneyBootstrapDataset.sheetInventory.find((sheet) => sheet.name === name) ?? null;
}
```

## `lib\money.ts`
```typescript
export function toCents(value: number | string): number {
  if (typeof value === "number") return Math.round(value * 100);

  const normalized = value
    .replace(/R\$/g, "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) throw new Error(`Valor monetário inválido: ${value}`);
  return Math.round(parsed * 100);
}

export function fromCents(cents: number): number {
  return cents / 100;
}

export function formatCurrency(cents: number, locale = "pt-BR", currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency
  }).format(fromCents(cents));
}

export function splitEvenly(totalCents: number, parts: number) {
  if (parts <= 0) throw new Error("parts must be greater than zero");
  const base = Math.floor(totalCents / parts);
  const remainder = totalCents % parts;

  return Array.from({ length: parts }, (_, index) => base + (index < remainder ? 1 : 0));
}
```

## `lib\utils.ts`
```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function uid(prefix = "id") {
  return `${prefix}_${crypto.randomUUID()}`;
}

export function toJson<T>(value: T) {
  return JSON.stringify(value);
}

export function fromJson<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
```

## `lib\validation.ts`
```typescript
import { z } from "zod";

export const accountCreateSchema = z.object({
  name: z.string().min(2),
  type: z.enum(["checking", "savings", "cash", "investment", "reserve", "credit_card_settlement"]),
  institution: z.string().optional().default(""),
  openingBalance: z.string().optional().default("0"),
  color: z.string().optional().default("#5b7cfa"),
  includeInNetWorth: z.boolean().optional().default(true),
  notes: z.string().optional().default("")
});
export type AccountCreateInput = z.infer<typeof accountCreateSchema>;

export const transactionCreateSchema = z.object({
  accountId: z.string().min(1),
  description: z.string().min(2),
  amount: z.string().min(1),
  direction: z.enum(["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"]),
  status: z.enum(["posted", "scheduled", "void"]),
  occurredOn: z.string().min(10),
  dueOn: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  subcategoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type TransactionCreateInput = z.infer<typeof transactionCreateSchema>;

export const creditCardCreateSchema = z.object({
  name: z.string().min(2),
  brand: z.string().optional().default(""),
  network: z.string().optional().default(""),
  limitAmount: z.string().min(1),
  closeDay: z.coerce.number().min(1).max(31),
  dueDay: z.coerce.number().min(1).max(31),
  settlementAccountId: z.string().min(1)
});
export type CreditCardCreateInput = z.infer<typeof creditCardCreateSchema>;

export const cardPurchaseCreateSchema = z.object({
  creditCardId: z.string().min(1),
  description: z.string().min(2),
  purchaseDate: z.string().min(10),
  amount: z.string().min(1),
  installmentCount: z.coerce.number().min(1).max(48),
  categoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type CardPurchaseCreateInput = z.infer<typeof cardPurchaseCreateSchema>;

export const recurringRuleCreateSchema = z.object({
  title: z.string().min(2),
  accountId: z.string().min(1),
  direction: z.enum(["income", "expense", "transfer_in", "transfer_out", "bill_payment", "adjustment"]),
  amount: z.string().min(1),
  startsOn: z.string().min(10),
  nextRunOn: z.string().min(10),
  frequency: z.enum(["weekly", "monthly", "yearly"]),
  categoryId: z.string().optional().nullable(),
  notes: z.string().optional().default("")
});
export type RecurringRuleCreateInput = z.infer<typeof recurringRuleCreateSchema>;

export const settingsUpdateSchema = z.object({
  baseCurrency: z.string().min(3).default("BRL"),
  locale: z.string().min(2).default("pt-BR"),
  projectionMonths: z.coerce.number().int().min(1).max(36).default(6),
  themePreference: z.enum(["light", "dark", "system"]).default("system"),
  userDisplayName: z.string().optional().default("VocÃª")
});
export type SettingsUpdateInput = z.infer<typeof settingsUpdateSchema>;

export const onboardingPayloadSchema = z.object({
  source: z.enum(["manual", "money"]).default("manual"),
  userDisplayName: z.string().min(1).default("VocÃª"),
  baseCurrency: z.string().min(3).default("BRL"),
  locale: z.string().min(2).default("pt-BR"),
  projectionMonths: z.coerce.number().int().min(1).max(36).default(6),
  themePreference: z.enum(["light", "dark", "system"]).default("system")
});
export type OnboardingPayload = z.infer<typeof onboardingPayloadSchema>;
```

## `db\client.ts`
```typescript
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@/db/schema";
import { DB_PATH } from "@/lib/constants";

const resolvedPath = path.resolve(process.cwd(), DB_PATH);
fs.mkdirSync(path.dirname(resolvedPath), { recursive: true });
const sqlite = new Database(resolvedPath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export { sqlite };
```

## `db\migrations\0000_init.sql`
```sql
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL,
  institution TEXT DEFAULT '',
  opening_balance_cents INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#5b7cfa',
  notes TEXT DEFAULT '',
  include_in_net_worth INTEGER NOT NULL DEFAULT 1,
  is_archived INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_slug_unique ON accounts(slug);

CREATE TABLE IF NOT EXISTS account_balance_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL,
  snapshot_date TEXT NOT NULL,
  balance_cents INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS account_balance_snapshots_account_date_unique ON account_balance_snapshots(account_id, snapshot_date);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'expense',
  color TEXT DEFAULT '#7c83ff',
  icon TEXT DEFAULT 'circle',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique ON categories(slug);

CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT DEFAULT '#8f96ff',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS subcategories_slug_unique ON subcategories(category_id, slug);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT DEFAULT '#9498a4',
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_unique ON tags(slug);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT,
  category_id TEXT,
  subcategory_id TEXT,
  transfer_id TEXT,
  recurring_occurrence_id TEXT,
  source_import_row_id TEXT,
  direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'posted',
  description TEXT NOT NULL,
  counterparty TEXT DEFAULT '',
  amount_cents INTEGER NOT NULL,
  occurred_on TEXT NOT NULL,
  due_on TEXT,
  competence_month TEXT NOT NULL,
  notes TEXT DEFAULT '',
  is_projected INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS transactions_account_idx ON transactions(account_id);
CREATE INDEX IF NOT EXISTS transactions_occurred_on_idx ON transactions(occurred_on);
CREATE INDEX IF NOT EXISTS transactions_competence_month_idx ON transactions(competence_month);

CREATE TABLE IF NOT EXISTS transaction_tags (
  transaction_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS transaction_tags_unique ON transaction_tags(transaction_id, tag_id);

CREATE TABLE IF NOT EXISTS transfers (
  id TEXT PRIMARY KEY NOT NULL,
  from_account_id TEXT NOT NULL,
  to_account_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  occurred_on TEXT NOT NULL,
  notes TEXT DEFAULT '',
  out_transaction_id TEXT,
  in_transaction_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recurring_rules (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL,
  category_id TEXT,
  title TEXT NOT NULL,
  direction TEXT NOT NULL,
  frequency TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  starts_on TEXT NOT NULL,
  ends_on TEXT,
  next_run_on TEXT NOT NULL,
  auto_post INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recurring_occurrences (
  id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT NOT NULL,
  due_on TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  transaction_id TEXT,
  notes TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (rule_id) REFERENCES recurring_rules(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS recurring_occurrences_rule_due_unique ON recurring_occurrences(rule_id, due_on);

CREATE TABLE IF NOT EXISTS credit_cards (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  brand TEXT DEFAULT '',
  network TEXT DEFAULT '',
  settlement_account_id TEXT NOT NULL,
  limit_total_cents INTEGER NOT NULL,
  close_day INTEGER NOT NULL,
  due_day INTEGER NOT NULL,
  color TEXT DEFAULT '#111827',
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (settlement_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
);
CREATE UNIQUE INDEX IF NOT EXISTS credit_cards_slug_unique ON credit_cards(slug);

CREATE TABLE IF NOT EXISTS credit_card_bills (
  id TEXT PRIMARY KEY NOT NULL,
  credit_card_id TEXT NOT NULL,
  bill_month TEXT NOT NULL,
  closes_on TEXT NOT NULL,
  due_on TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL DEFAULT 0,
  paid_amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  settlement_transaction_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (settlement_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS credit_card_bills_card_month_unique ON credit_card_bills(credit_card_id, bill_month);

CREATE TABLE IF NOT EXISTS card_purchases (
  id TEXT PRIMARY KEY NOT NULL,
  credit_card_id TEXT NOT NULL,
  category_id TEXT,
  subcategory_id TEXT,
  first_bill_id TEXT,
  description TEXT NOT NULL,
  merchant TEXT DEFAULT '',
  purchase_date TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  installment_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  FOREIGN KEY (first_bill_id) REFERENCES credit_card_bills(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS card_installments (
  id TEXT PRIMARY KEY NOT NULL,
  purchase_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  installment_number INTEGER NOT NULL,
  total_installments INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'billed',
  due_on TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES card_purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_id) REFERENCES credit_card_bills(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS card_installments_purchase_number_unique ON card_installments(purchase_id, installment_number);

CREATE TABLE IF NOT EXISTS bill_entries (
  id TEXT PRIMARY KEY NOT NULL,
  bill_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  purchase_id TEXT,
  installment_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (bill_id) REFERENCES credit_card_bills(id) ON DELETE CASCADE,
  FOREIGN KEY (purchase_id) REFERENCES card_purchases(id) ON DELETE SET NULL,
  FOREIGN KEY (installment_id) REFERENCES card_installments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  remind_on TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY NOT NULL,
  filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  workbook_summary_json TEXT NOT NULL DEFAULT '{}',
  dry_run_report_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS import_raw_rows (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  row_number INTEGER NOT NULL,
  row_hash TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  validation_status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS import_mappings (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  column_map_json TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS import_mappings_batch_sheet_unique ON import_mappings(batch_id, sheet_name);

CREATE TABLE IF NOT EXISTS import_issues (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  raw_row_id TEXT,
  sheet_name TEXT NOT NULL,
  severity TEXT NOT NULL,
  issue_code TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (raw_row_id) REFERENCES import_raw_rows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS monthly_closings (
  id TEXT PRIMARY KEY NOT NULL,
  month TEXT NOT NULL,
  opening_balance_cents INTEGER NOT NULL,
  incomes_cents INTEGER NOT NULL,
  expenses_cents INTEGER NOT NULL,
  transfers_net_cents INTEGER NOT NULL,
  projected_bill_payments_cents INTEGER NOT NULL,
  closing_balance_cents INTEGER NOT NULL,
  projected_free_cash_cents INTEGER NOT NULL,
  notes TEXT DEFAULT '',
  snapshot_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS monthly_closings_month_unique ON monthly_closings(month);

CREATE TABLE IF NOT EXISTS net_worth_summaries (
  id TEXT PRIMARY KEY NOT NULL,
  month TEXT NOT NULL,
  reserves_cents INTEGER NOT NULL DEFAULT 0,
  investments_cents INTEGER NOT NULL DEFAULT 0,
  debts_cents INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS net_worth_summaries_month_unique ON net_worth_summaries(month);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'BRL',
  theme_preference TEXT NOT NULL DEFAULT 'system',
  user_display_name TEXT NOT NULL DEFAULT 'Você',
  is_onboarded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
```

## `db\migrations\0001_csv_import_and_future.sql`
```sql
ALTER TABLE card_purchases ADD COLUMN purchase_type TEXT NOT NULL DEFAULT 'parcelado';
ALTER TABLE card_purchases ADD COLUMN responsible TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS reserves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_value_cents INTEGER NOT NULL DEFAULT 0,
  current_value_cents INTEGER NOT NULL DEFAULT 0,
  total_profit_cents INTEGER NOT NULL DEFAULT 0,
  yield_total_percent REAL,
  monthly_profit_cents INTEGER NOT NULL DEFAULT 0,
  yield_monthly_percent REAL,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS reserves_name_unique ON reserves(name);

CREATE TABLE IF NOT EXISTS stock_positions (
  id TEXT PRIMARY KEY,
  ticker TEXT NOT NULL,
  full_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_cents INTEGER NOT NULL DEFAULT 0,
  current_cents INTEGER NOT NULL DEFAULT 0,
  result_total_cents INTEGER NOT NULL DEFAULT 0,
  rentability_total_percent REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS stock_positions_ticker_unique ON stock_positions(ticker);

CREATE TABLE IF NOT EXISTS crypto_positions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_cents INTEGER NOT NULL DEFAULT 0,
  current_cents INTEGER NOT NULL DEFAULT 0,
  total_profit_cents INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS crypto_positions_name_unique ON crypto_positions(name);

CREATE TABLE IF NOT EXISTS asset_trades (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  quantity REAL NOT NULL,
  trade_date TEXT NOT NULL,
  total_initial_cents INTEGER NOT NULL DEFAULT 0,
  price_per_unit_initial_cents INTEGER NOT NULL DEFAULT 0,
  total_current_cents INTEGER NOT NULL DEFAULT 0,
  price_per_unit_current_cents INTEGER NOT NULL DEFAULT 0,
  yield_percent REAL,
  description_text TEXT DEFAULT '',
  is_completed INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS asset_trades_trade_date_idx ON asset_trades(trade_date);

CREATE TABLE IF NOT EXISTS net_worth_snapshots (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  account_balance_cents INTEGER NOT NULL DEFAULT 0,
  investment_1_cents INTEGER NOT NULL DEFAULT 0,
  investment_2_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  variation_type TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS net_worth_snapshots_date_unique ON net_worth_snapshots(date);
```

## `db\migrations\0001_settings_onboarding_columns.sql`
```sql
ALTER TABLE settings ADD COLUMN locale TEXT NOT NULL DEFAULT 'pt-BR';
ALTER TABLE settings ADD COLUMN projection_months INTEGER NOT NULL DEFAULT 6;
```

## `db\schema.ts`
```typescript
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  type: text("type").notNull(),
  institution: text("institution").default(""),
  openingBalanceCents: integer("opening_balance_cents").notNull().default(0),
  color: text("color").default("#5b7cfa"),
  notes: text("notes").default(""),
  includeInNetWorth: integer("include_in_net_worth", { mode: "boolean" }).notNull().default(true),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  slugUnique: uniqueIndex("accounts_slug_unique").on(table.slug),
  typeIdx: index("accounts_type_idx").on(table.type)
}));

export const accountBalanceSnapshots = sqliteTable("account_balance_snapshots", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  snapshotDate: text("snapshot_date").notNull(),
  balanceCents: integer("balance_cents").notNull(),
  source: text("source").notNull().default("manual"),
  createdAt: integer("created_at").notNull()
}, (table) => ({
  accountDateUnique: uniqueIndex("account_balance_snapshots_account_date_unique").on(table.accountId, table.snapshotDate)
}));

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  kind: text("kind").notNull().default("expense"),
  color: text("color").default("#7c83ff"),
  icon: text("icon").default("circle"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  slugUnique: uniqueIndex("categories_slug_unique").on(table.slug)
}));

export const subcategories = sqliteTable("subcategories", {
  id: text("id").primaryKey(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color").default("#8f96ff"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  categoryIdx: index("subcategories_category_idx").on(table.categoryId),
  slugUnique: uniqueIndex("subcategories_slug_unique").on(table.categoryId, table.slug)
}));

export const tags = sqliteTable("tags", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  color: text("color").default("#9498a4"),
  createdAt: integer("created_at").notNull()
}, (table) => ({
  slugUnique: uniqueIndex("tags_slug_unique").on(table.slug)
}));

export const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey(),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  subcategoryId: text("subcategory_id").references(() => subcategories.id, { onDelete: "set null" }),
  transferId: text("transfer_id"),
  recurringOccurrenceId: text("recurring_occurrence_id"),
  sourceImportRowId: text("source_import_row_id"),
  direction: text("direction").notNull(),
  status: text("status").notNull().default("posted"),
  description: text("description").notNull(),
  counterparty: text("counterparty").default(""),
  amountCents: integer("amount_cents").notNull(),
  occurredOn: text("occurred_on").notNull(),
  dueOn: text("due_on"),
  competenceMonth: text("competence_month").notNull(),
  notes: text("notes").default(""),
  isProjected: integer("is_projected", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  accountIdx: index("transactions_account_idx").on(table.accountId),
  dateIdx: index("transactions_occurred_on_idx").on(table.occurredOn),
  monthIdx: index("transactions_competence_month_idx").on(table.competenceMonth)
}));

export const transactionTags = sqliteTable("transaction_tags", {
  transactionId: text("transaction_id").notNull().references(() => transactions.id, { onDelete: "cascade" }),
  tagId: text("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" })
}, (table) => ({
  unique: uniqueIndex("transaction_tags_unique").on(table.transactionId, table.tagId)
}));

export const transfers = sqliteTable("transfers", {
  id: text("id").primaryKey(),
  fromAccountId: text("from_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  toAccountId: text("to_account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  amountCents: integer("amount_cents").notNull(),
  occurredOn: text("occurred_on").notNull(),
  notes: text("notes").default(""),
  outTransactionId: text("out_transaction_id"),
  inTransactionId: text("in_transaction_id"),
  createdAt: integer("created_at").notNull()
});

export const recurringRules = sqliteTable("recurring_rules", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  direction: text("direction").notNull(),
  frequency: text("frequency").notNull(),
  amountCents: integer("amount_cents").notNull(),
  startsOn: text("starts_on").notNull(),
  endsOn: text("ends_on"),
  nextRunOn: text("next_run_on").notNull(),
  autoPost: integer("auto_post", { mode: "boolean" }).notNull().default(false),
  notes: text("notes").default(""),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const recurringOccurrences = sqliteTable("recurring_occurrences", {
  id: text("id").primaryKey(),
  ruleId: text("rule_id").notNull().references(() => recurringRules.id, { onDelete: "cascade" }),
  dueOn: text("due_on").notNull(),
  amountCents: integer("amount_cents").notNull(),
  direction: text("direction").notNull(),
  status: text("status").notNull().default("scheduled"),
  transactionId: text("transaction_id").references(() => transactions.id, { onDelete: "set null" }),
  notes: text("notes").default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  ruleDueUnique: uniqueIndex("recurring_occurrences_rule_due_unique").on(table.ruleId, table.dueOn)
}));

export const creditCards = sqliteTable("credit_cards", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  brand: text("brand").default(""),
  network: text("network").default(""),
  settlementAccountId: text("settlement_account_id").notNull().references(() => accounts.id, { onDelete: "restrict" }),
  limitTotalCents: integer("limit_total_cents").notNull(),
  closeDay: integer("close_day").notNull(),
  dueDay: integer("due_day").notNull(),
  color: text("color").default("#111827"),
  isArchived: integer("is_archived", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  slugUnique: uniqueIndex("credit_cards_slug_unique").on(table.slug)
}));

export const creditCardBills = sqliteTable("credit_card_bills", {
  id: text("id").primaryKey(),
  creditCardId: text("credit_card_id").notNull().references(() => creditCards.id, { onDelete: "cascade" }),
  billMonth: text("bill_month").notNull(),
  closesOn: text("closes_on").notNull(),
  dueOn: text("due_on").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull().default(0),
  paidAmountCents: integer("paid_amount_cents").notNull().default(0),
  status: text("status").notNull().default("open"),
  settlementTransactionId: text("settlement_transaction_id").references(() => transactions.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  uniqueMonth: uniqueIndex("credit_card_bills_card_month_unique").on(table.creditCardId, table.billMonth),
  dueIdx: index("credit_card_bills_due_on_idx").on(table.dueOn)
}));

export const cardPurchases = sqliteTable("card_purchases", {
  id: text("id").primaryKey(),
  creditCardId: text("credit_card_id").notNull().references(() => creditCards.id, { onDelete: "cascade" }),
  categoryId: text("category_id").references(() => categories.id, { onDelete: "set null" }),
  subcategoryId: text("subcategory_id").references(() => subcategories.id, { onDelete: "set null" }),
  firstBillId: text("first_bill_id").references(() => creditCardBills.id, { onDelete: "set null" }),
  description: text("description").notNull(),
  merchant: text("merchant").default(""),
  purchaseDate: text("purchase_date").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull(),
  installmentCount: integer("installment_count").notNull().default(1),
  notes: text("notes").default(""),
  purchaseType: text("purchase_type").notNull().default("parcelado"),
  responsible: text("responsible").default(""),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const cardInstallments = sqliteTable("card_installments", {
  id: text("id").primaryKey(),
  purchaseId: text("purchase_id").notNull().references(() => cardPurchases.id, { onDelete: "cascade" }),
  billId: text("bill_id").notNull().references(() => creditCardBills.id, { onDelete: "cascade" }),
  installmentNumber: integer("installment_number").notNull(),
  totalInstallments: integer("total_installments").notNull(),
  amountCents: integer("amount_cents").notNull(),
  status: text("status").notNull().default("billed"),
  dueOn: text("due_on").notNull(),
  createdAt: integer("created_at").notNull()
}, (table) => ({
  billIdx: index("card_installments_bill_idx").on(table.billId),
  uniqueInstallment: uniqueIndex("card_installments_purchase_number_unique").on(table.purchaseId, table.installmentNumber)
}));

export const billEntries = sqliteTable("bill_entries", {
  id: text("id").primaryKey(),
  billId: text("bill_id").notNull().references(() => creditCardBills.id, { onDelete: "cascade" }),
  entryType: text("entry_type").notNull(),
  description: text("description").notNull(),
  amountCents: integer("amount_cents").notNull(),
  purchaseId: text("purchase_id").references(() => cardPurchases.id, { onDelete: "set null" }),
  installmentId: text("installment_id").references(() => cardInstallments.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull()
});

export const reminders = sqliteTable("reminders", {
  id: text("id").primaryKey(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  title: text("title").notNull(),
  remindOn: text("remind_on").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: integer("created_at").notNull()
});

export const importBatches = sqliteTable("import_batches", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  status: text("status").notNull().default("uploaded"),
  workbookSummaryJson: text("workbook_summary_json").notNull().default("{}"),
  dryRunReportJson: text("dry_run_report_json"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});

export const importRawRows = sqliteTable("import_raw_rows", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  rowNumber: integer("row_number").notNull(),
  rowHash: text("row_hash").notNull(),
  payloadJson: text("payload_json").notNull(),
  validationStatus: text("validation_status").notNull().default("pending"),
  createdAt: integer("created_at").notNull()
});

export const importMappings = sqliteTable("import_mappings", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  targetEntity: text("target_entity").notNull(),
  columnMapJson: text("column_map_json").notNull(),
  optionsJson: text("options_json").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  uniqueSheet: uniqueIndex("import_mappings_batch_sheet_unique").on(table.batchId, table.sheetName)
}));

export const importIssues = sqliteTable("import_issues", {
  id: text("id").primaryKey(),
  batchId: text("batch_id").notNull().references(() => importBatches.id, { onDelete: "cascade" }),
  rawRowId: text("raw_row_id").references(() => importRawRows.id, { onDelete: "cascade" }),
  sheetName: text("sheet_name").notNull(),
  severity: text("severity").notNull(),
  issueCode: text("issue_code").notNull(),
  message: text("message").notNull(),
  createdAt: integer("created_at").notNull()
});

export const monthlyClosings = sqliteTable("monthly_closings", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  openingBalanceCents: integer("opening_balance_cents").notNull(),
  incomesCents: integer("incomes_cents").notNull(),
  expensesCents: integer("expenses_cents").notNull(),
  transfersNetCents: integer("transfers_net_cents").notNull(),
  projectedBillPaymentsCents: integer("projected_bill_payments_cents").notNull(),
  closingBalanceCents: integer("closing_balance_cents").notNull(),
  projectedFreeCashCents: integer("projected_free_cash_cents").notNull(),
  notes: text("notes").default(""),
  snapshotJson: text("snapshot_json").notNull().default("{}"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  monthUnique: uniqueIndex("monthly_closings_month_unique").on(table.month)
}));

export const netWorthSummaries = sqliteTable("net_worth_summaries", {
  id: text("id").primaryKey(),
  month: text("month").notNull(),
  reservesCents: integer("reserves_cents").notNull().default(0),
  investmentsCents: integer("investments_cents").notNull().default(0),
  debtsCents: integer("debts_cents").notNull().default(0),
  notes: text("notes").default(""),
  source: text("source").notNull().default("manual"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  monthUnique: uniqueIndex("net_worth_summaries_month_unique").on(table.month)
}));



/** Reservas e investimentos manuais importados da planilha. */
export const reserves = sqliteTable("reserves", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  investedCents: integer("invested_cents").notNull().default(0),
  previousValueCents: integer("previous_value_cents").notNull().default(0),
  currentValueCents: integer("current_value_cents").notNull().default(0),
  totalProfitCents: integer("total_profit_cents").notNull().default(0),
  yieldTotalPercent: real("yield_total_percent"),
  monthlyProfitCents: integer("monthly_profit_cents").notNull().default(0),
  yieldMonthlyPercent: real("yield_monthly_percent"),
  accountId: text("account_id").references(() => accounts.id, { onDelete: "set null" }),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  nameUnique: uniqueIndex("reserves_name_unique").on(table.name)
}));

/** PosiÃ§Ãµes em aÃ§Ãµes importadas da planilha. */
export const stockPositions = sqliteTable("stock_positions", {
  id: text("id").primaryKey(),
  ticker: text("ticker").notNull(),
  fullName: text("full_name").notNull(),
  quantity: integer("quantity").notNull().default(0),
  investedCents: integer("invested_cents").notNull().default(0),
  previousCents: integer("previous_cents").notNull().default(0),
  currentCents: integer("current_cents").notNull().default(0),
  resultTotalCents: integer("result_total_cents").notNull().default(0),
  rentabilityTotalPercent: real("rentability_total_percent"),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  tickerUnique: uniqueIndex("stock_positions_ticker_unique").on(table.ticker)
}));

/** PosiÃ§Ãµes em criptomoedas importadas da planilha. */
export const cryptoPositions = sqliteTable("crypto_positions", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  quantity: real("quantity").notNull().default(0),
  investedCents: integer("invested_cents").notNull().default(0),
  previousCents: integer("previous_cents").notNull().default(0),
  currentCents: integer("current_cents").notNull().default(0),
  totalProfitCents: integer("total_profit_cents").notNull().default(0),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
}, (table) => ({
  nameUnique: uniqueIndex("crypto_positions_name_unique").on(table.name)
}));

/** HistÃ³rico de compras e vendas de ativos financeiros. */
export const assetTrades = sqliteTable("asset_trades", {
  id: text("id").primaryKey(),
  action: text("action").notNull(),
  assetName: text("asset_name").notNull(),
  quantity: real("quantity").notNull(),
  tradeDate: text("trade_date").notNull(),
  totalInitialCents: integer("total_initial_cents").notNull().default(0),
  pricePerUnitInitialCents: integer("price_per_unit_initial_cents").notNull().default(0),
  totalCurrentCents: integer("total_current_cents").notNull().default(0),
  pricePerUnitCurrentCents: integer("price_per_unit_current_cents").notNull().default(0),
  yieldPercent: real("yield_percent"),
  descriptionText: text("description_text").default(""),
  isCompleted: integer("is_completed", { mode: "boolean" }).notNull().default(true),
  createdAt: integer("created_at").notNull()
}, (table) => ({
  tradeDateIdx: index("asset_trades_trade_date_idx").on(table.tradeDate)
}));

/** SÃ©rie histÃ³rica diÃ¡ria do patrimÃ´nio total importada da planilha. */
export const netWorthSnapshots = sqliteTable("net_worth_snapshots", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  accountBalanceCents: integer("account_balance_cents").notNull().default(0),
  investment1Cents: integer("investment_1_cents").notNull().default(0),
  investment2Cents: integer("investment_2_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull().default(0),
  variationType: text("variation_type").default(""),
  createdAt: integer("created_at").notNull()
}, (table) => ({
  dateUnique: uniqueIndex("net_worth_snapshots_date_unique").on(table.date)
}));
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  baseCurrency: text("base_currency").notNull().default("BRL"),
  locale: text("locale").notNull().default("pt-BR"),
  projectionMonths: integer("projection_months").notNull().default(6),
  themePreference: text("theme_preference").notNull().default("system"),
  userDisplayName: text("user_display_name").notNull().default("VocÃª"),
  isOnboarded: integer("is_onboarded", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull()
});
```

## `db\seed.ts`
```typescript
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
```

## `components\app-shell.tsx`
```tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import {
  ArrowLeftRight,
  Boxes,
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  FolderTree,
  Import,
  Landmark,
  LayoutDashboard,
  PieChart,
  Repeat2,
  Settings,
  TrendingUp
} from "lucide-react";

const nav = [
  ["/dashboard", "Dashboard", LayoutDashboard],
  ["/accounts", "Contas", Landmark],
  ["/transactions", "TransaÃ§Ãµes", ArrowLeftRight],
  ["/cards", "CartÃµes", CreditCard],
  ["/bills", "Faturas", CircleDollarSign],
  ["/recurring", "RecorrÃªncias", Repeat2],
  ["/calendar", "CalendÃ¡rio", CalendarDays],
  ["/closings", "Fechamentos", Boxes],
  ["/future", "VisÃ£o futura", TrendingUp],
  ["/net-worth", "PatrimÃ´nio", PieChart],
  ["/categories", "Categorias", FolderTree],
  ["/import", "ImportaÃ§Ã£o", Import],
  ["/settings", "ConfiguraÃ§Ãµes", Settings]
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const plain = pathname === "/onboarding";
  if (plain) return <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">{children}</div>;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto grid min-h-screen max-w-[1600px] grid-cols-1 md:grid-cols-[272px_1fr]">
        <aside className="border-r border-[var(--border)] bg-[color-mix(in_oklab,var(--card)_96%,white)] px-5 py-6 dark:bg-[color-mix(in_oklab,var(--card)_96%,black)]">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted-foreground)]">Personal finance OS</p>
              <h2 className="text-xl font-semibold tracking-tight">{APP_NAME}</h2>
            </div>
            <ThemeToggle />
          </div>
          <nav className="space-y-1.5">
            {nav.map(([href, label, Icon]) => {
              const active = pathname === href || pathname.startsWith(`${href}/`);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-colors",
                    active
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-sm text-[var(--muted-foreground)]">
            Banco local-first em SQLite. Backup = copiar o arquivo <code className="font-mono text-xs">data/aurea-finance.sqlite</code>.
          </div>
        </aside>
        <main className="px-5 py-6 md:px-8 md:py-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
```

## `components\charts\account-balance-chart.tsx`
```tsx
"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function AccountBalanceChart({ data }: { data: { name: string; current: number; projected: number }[] }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <Area type="monotone" dataKey="current" fillOpacity={0.15} strokeWidth={2} />
          <Area type="monotone" dataKey="projected" fillOpacity={0.08} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## `components\dashboard\cashflow-chart.tsx`
```tsx
"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CashflowChart({ data }: { data: Array<{ date: string; income: number; expense: number }> }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo do mês</CardTitle>
        <CardDescription>Entradas e saídas observadas no período corrente.</CardDescription>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="income" fillOpacity={0.2} strokeWidth={2} />
            <Area type="monotone" dataKey="expense" fillOpacity={0.2} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

## `components\dashboard\overview-cards.tsx`
```tsx
import { ArrowDownRight, ArrowUpRight, Landmark, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";

const icons = {
  balance: Landmark,
  projected: ShieldCheck,
  income: ArrowUpRight,
  expense: ArrowDownRight
};

export function OverviewCards(props: {
  currentBalanceCents: number;
  projectedBalanceCents: number;
  monthIncomeCents: number;
  monthExpenseCents: number;
}) {
  const items = [
    { key: "balance", label: "Saldo atual", value: props.currentBalanceCents },
    { key: "projected", label: "Saldo projetado", value: props.projectedBalanceCents },
    { key: "income", label: "Receitas do mês", value: props.monthIncomeCents },
    { key: "expense", label: "Despesas do mês", value: props.monthExpenseCents }
  ] as const;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = icons[item.key];
        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="financial-number text-2xl font-semibold tracking-tight">{formatCurrency(item.value)}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
```

## `components\empty-state.tsx`
```tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
      <CardContent><p className="text-sm text-[var(--muted-foreground)]">{description}</p></CardContent>
    </Card>
  );
}
```

## `components\forms\transaction-form.tsx`
```tsx
"use client";

import { useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createTransactionAction } from "@/features/transactions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const schema = z.object({
  accountId: z.string().min(1, "Selecione uma conta"),
  categoryId: z.string().min(1, "Selecione uma categoria"),
  direction: z.enum(["income", "expense", "adjustment"]),
  description: z.string().min(2, "Informe uma descrição"),
  amount: z.string().min(1, "Informe o valor"),
  occurredOn: z.string().min(1, "Informe a data"),
  status: z.enum(["posted", "scheduled", "void"])
});

type FormValues = z.infer<typeof schema>;

export function TransactionForm(props: {
  accounts: Array<{ id: string; name: string }>;
  categories: Array<{ id: string; name: string }>;
}) {
  const [isPending, startTransition] = useTransition();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { direction: "expense", status: "posted", occurredOn: new Date().toISOString().slice(0, 10), amount: "" }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      await createTransactionAction({
        accountId: values.accountId,
        categoryId: values.categoryId,
        subcategoryId: null,
        description: values.description,
        amount: values.amount,
        direction: values.direction,
        status: values.status,
        occurredOn: values.occurredOn,
        dueOn: values.occurredOn,
        notes: ""
      });
      form.reset({
        accountId: values.accountId,
        categoryId: values.categoryId,
        direction: values.direction,
        status: values.status,
        description: "",
        occurredOn: new Date().toISOString().slice(0, 10),
        amount: ""
      });
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Novo lançamento</CardTitle>
        <CardDescription>Entrada rápida para uso diário, com validação leve e segura.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Descrição</label>
            <Input {...form.register("description")} placeholder="Ex.: Mercado da semana" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Valor</label>
            <Input {...form.register("amount")} placeholder="Ex.: 129,90" />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Conta</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("accountId")}>
              <option value="">Selecione</option>
              {props.accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Categoria</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("categoryId")}>
              <option value="">Selecione</option>
              {props.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Direção</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("direction")}>
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Status</label>
            <select className="h-10 rounded-xl border bg-background px-3 text-sm" {...form.register("status")}>
              <option value="posted">Lançado</option>
              <option value="scheduled">Agendado</option>
              <option value="void">Cancelado</option>
            </select>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <label className="text-sm font-medium">Data</label>
            <Input type="date" {...form.register("occurredOn")} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar lançamento"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

## `components\future\cashflow-chart.tsx`
```tsx
"use client";

import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function FutureCashflowChart({ data }: { data: Array<{ date: string; balance: number }> }) {
  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ left: 0, right: 0, top: 12, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tickFormatter={(value: string) => value.slice(5)} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
          <ReferenceLine y={0} strokeDasharray="4 4" />
          <Area type="monotone" dataKey="balance" fillOpacity={0.15} strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
```

## `components\future\events-timeline.tsx`
```tsx
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrencyFromCents } from "@/lib/currency";
import type { CashflowDay } from "@/services/cashflow.service";

export function FutureEventsTimeline({ days }: { days: CashflowDay[] }) {
  const visibleDays = days.filter((day) => day.events.length > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline do perÃ­odo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleDays.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Nenhum evento projetado no horizonte selecionado.</p> : null}
        {visibleDays.map((day) => (
          <div key={day.date} className="rounded-2xl border border-[var(--border)] p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="font-medium">{day.date}</div>
                <div className="text-xs text-[var(--muted-foreground)]">Saldo ao final do dia: {formatCurrencyFromCents(day.balance_cents)}</div>
              </div>
              <Badge variant={day.is_negative ? "destructive" : "secondary"}>{day.is_negative ? "Saldo negativo" : "Saldo saudÃ¡vel"}</Badge>
            </div>
            <div className="space-y-2">
              {day.events.map((event, index) => (
                <div key={`${day.date}-${index}`} className="rounded-xl bg-[var(--secondary)] p-3 text-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <strong>{event.description}</strong>
                    <span>{formatCurrencyFromCents(event.amount_cents)}</span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-[var(--muted-foreground)]">
                    <span>{event.type}</span>
                    <span>Conta: {event.account_name}</span>
                    {event.card_name ? <span>CartÃ£o: {event.card_name}</span> : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

## `components\future\summary-cards.tsx`
```tsx
import { StatCard } from "@/components/stat-card";
import { formatCurrencyFromCents } from "@/lib/currency";

export function FutureSummaryCards(props: {
  initialBalanceCents: number;
  endingBalanceCents: number;
  minBalanceCents: number;
  totalIncomeCents: number;
  totalExpensesCents: number;
  firstNegativeDate: string | null;
  minBalanceDate: string;
}) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard title="Saldo inicial" value={formatCurrencyFromCents(props.initialBalanceCents)} description="Base consolidada das contas no inÃ­cio da projeÃ§Ã£o." />
      <StatCard title="Saldo final projetado" value={formatCurrencyFromCents(props.endingBalanceCents)} description="Saldo esperado ao fim do horizonte selecionado." />
      <StatCard title="Menor saldo" value={formatCurrencyFromCents(props.minBalanceCents)} description={`Pior ponto estimado em ${props.minBalanceDate}.`} />
      <StatCard title="Alerta crÃ­tico" value={props.firstNegativeDate ? props.firstNegativeDate : "Sem saldo negativo"} description={`Entradas ${formatCurrencyFromCents(props.totalIncomeCents)} Â· saÃ­das ${formatCurrencyFromCents(props.totalExpensesCents)}.`} />
    </section>
  );
}
```

## `components\import\import-wizard-overview.tsx`
```tsx
import { CheckCircle2, DatabaseZap, FileSpreadsheet, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    icon: FileSpreadsheet,
    title: "1. Inventário do arquivo",
    description: "Lê o .xlsx, lista abas, conta linhas, detecta cabeçalhos e sugere o papel provável de cada aba."
  },
  {
    icon: DatabaseZap,
    title: "2. Staging seguro",
    description: "Cada linha vai primeiro para tabelas temporárias rastreáveis antes de tocar o domínio principal."
  },
  {
    icon: ShieldAlert,
    title: "3. Validação + dry-run",
    description: "Aponta erros, avisa riscos e mostra o que seria criado antes da confirmação final."
  },
  {
    icon: CheckCircle2,
    title: "4. Confirmação e trilha de auditoria",
    description: "Após revisão, o lote é confirmado e fica historicamente rastreável."
  }
];

export function ImportWizardOverview() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {steps.map((step) => {
        const Icon = step.icon;
        return (
          <Card key={step.title}>
            <CardHeader>
              <Icon className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="mt-2 text-base">{step.title}</CardTitle>
              <CardDescription>{step.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0" />
          </Card>
        );
      })}
    </div>
  );
}
```

## `components\import\import-workbench.tsx`
```tsx
"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { useActionState } from "react";
import { CheckCircle2, FileSpreadsheet, Loader2, TriangleAlert, UploadCloud } from "lucide-react";
import { importCsvFiles, type ImportActionState } from "@/app/import/actions";
import { uploadWorkbookAction } from "@/features/import/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PreviewFile = {
  name: string;
  sizeKb: number;
  lineCount: number;
  sample: string[][];
  valid: boolean;
};

function parsePreview(text: string) {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  const sample = lines.slice(0, 6).map((line) => {
    const cells: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      const next = line[i + 1];
      if (char === '"') {
        if (inQuotes && next === '"') {
          current += '"';
          i += 1;
        } else inQuotes = !inQuotes;
        continue;
      }
      if ((char === ',' || char === ';') && !inQuotes) {
        cells.push(current);
        current = "";
        continue;
      }
      current += char;
    }
    cells.push(current);
    return cells;
  });
  return { lineCount: Math.max(lines.length - 1, 0), sample };
}

export function ImportWorkbench({ expectedFiles }: { expectedFiles: string[] }) {
  const initialState: ImportActionState = useMemo(() => ({ success: true, files: [], summary: {}, expectedFiles }), [expectedFiles]);
  const [state, formAction, pending] = useActionState(importCsvFiles, initialState);
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  useEffect(() => {
    setPreviews((current) => current.map((file) => ({ ...file, valid: expectedFiles.includes(file.name) })));
  }, [expectedFiles]);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    const next: PreviewFile[] = [];
    for (const file of Array.from(files)) {
      const text = await file.text();
      const preview = parsePreview(text);
      next.push({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        lineCount: preview.lineCount,
        sample: preview.sample,
        valid: expectedFiles.includes(file.name)
      });
    }
    setPreviews(next);
  }

  const hasValidFiles = previews.some((file) => file.valid);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Modo assistido: workbook CSV/XLSX</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          <form action={uploadWorkbookAction} className="rounded-2xl border border-dashed border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <UploadCloud className="size-4 text-[var(--muted-foreground)]" />
              <strong>Workbook genÃ©rico</strong>
            </div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">Envie um XLSX/XLS para inventÃ¡rio de abas, staging e dry-run com mapeamento sugerido.</p>
            <input type="file" name="file" accept=".xlsx,.xls" className="mb-4 block w-full text-sm" />
            <Button type="submit">Enviar workbook</Button>
          </form>

          <form action={formAction} className="rounded-2xl border border-dashed border-[var(--border)] p-4">
            <div className="mb-3 flex items-center gap-2">
              <FileSpreadsheet className="size-4 text-[var(--muted-foreground)]" />
              <strong>Modo legado CSV</strong>
            </div>
            <p className="mb-4 text-sm text-[var(--muted-foreground)]">Aceita mÃºltiplos CSVs, detecta preview e executa a importaÃ§Ã£o existente.</p>
            <input type="file" name="files" accept=".csv" multiple className="mb-4 block w-full text-sm" onChange={(event) => void handleFiles(event.target.files)} />
            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={!hasValidFiles || pending}>Importar CSVs</Button>
              {pending ? <span className="inline-flex items-center gap-2 text-sm text-[var(--muted-foreground)]"><Loader2 className="size-4 animate-spin" />Processando...</span> : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preview dos CSVs selecionados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {previews.length === 0 ? <p className="text-sm text-[var(--muted-foreground)]">Selecione arquivos CSV para ver prÃ©via real do conteÃºdo.</p> : null}
          {previews.map((file) => (
            <div key={file.name} className="rounded-2xl border border-[var(--border)] p-4">
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="size-5 text-[var(--muted-foreground)]" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{file.sizeKb} KB Â· {file.lineCount} linhas</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-sm">
                  {file.valid ? <><CheckCircle2 className="size-4 text-emerald-500" />Reconhecido</> : <><TriangleAlert className="size-4 text-amber-500" />Fora da lista esperada</>}
                </div>
              </div>
              <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
                <table className="min-w-full text-sm">
                  <tbody>
                    {file.sample.map((row, rowIndex) => (
                      <tr key={`${file.name}-${rowIndex}`} className="border-b border-[var(--border)] last:border-b-0">
                        {row.map((cell, cellIndex) => <td key={cellIndex} className="px-3 py-2">{cell}</td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resultado do modo CSV</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {state.error ? <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">{state.error}</div> : null}
          {state.summaryText ? <pre className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--secondary)] p-4 text-xs">{state.summaryText}</pre> : null}
          {state.files.length ? (
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-2 py-2">Arquivo</th>
                  <th className="px-2 py-2">Processadas</th>
                  <th className="px-2 py-2">Com erro</th>
                  <th className="px-2 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {state.files.map((file) => (
                  <Fragment key={file.fileName}>
                    <tr>
                      <td className="px-2 py-2">{file.fileName}</td>
                      <td className="px-2 py-2">{file.linesProcessed}</td>
                      <td className="px-2 py-2">{file.linesWithError}</td>
                      <td className="px-2 py-2">{file.status === "success" ? "âœ… Sucesso" : file.status === "partial" ? "âš ï¸ Parcial" : file.status === "skipped" ? "â†· Ignorado" : "âŒ Falhou"}</td>
                    </tr>
                    {file.errors.length ? (
                      <tr>
                        <td colSpan={4} className="px-2 py-2">
                          <details>
                            <summary className="cursor-pointer text-sm text-[var(--muted-foreground)]">Ver erros</summary>
                            <ul className="mt-2 space-y-1 text-sm text-red-300">
                              {file.errors.map((error, index) => <li key={index}>{error}</li>)}
                            </ul>
                          </details>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-[var(--muted-foreground)]">Depois da primeira importaÃ§Ã£o CSV, o relatÃ³rio por arquivo aparece aqui.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

## `components\mode-toggle.tsx`
```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <Button variant="outline" size="sm" onClick={() => setTheme(next)}>
      {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
      {theme === "dark" ? "Claro" : "Escuro"}
    </Button>
  );
}
```

## `components\onboarding\onboarding-wizard.tsx`
```tsx
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  "PreferÃªncias",
  "Contas",
  "CartÃµes",
  "PatrimÃ´nio",
  "RecorrÃªncias",
  "RevisÃ£o"
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
  const [userDisplayName, setUserDisplayName] = useState(initialSettings.userDisplayName || "VocÃª");
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
                    {source === "money" ? "A Money jÃ¡ foi reconhecida." : "VocÃª pode comeÃ§ar manualmente ou migrando sua planilha."}
                  </h3>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    O Aurea Finance foi pensado para substituir a planilha como fonte de verdade. Ele pode nascer vazio,
                    mas fica muito melhor quando recebe suas contas, faturas, patrimÃ´nio e compromissos desde o primeiro dia.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href="/onboarding?mode=money" className="inline-flex h-10 items-center rounded-xl border border-[var(--border)] px-4 text-sm">
                      Quero comeÃ§ar com meus dados da planilha
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
                        <CardTitle className="text-base">O que a Money jÃ¡ entregou</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>{dataset.accounts.length} contas reconhecidas</p>
                        <p>{dataset.cards.length} cartÃµes com vencimento detectado</p>
                        <p>{dataset.cardBills.length} faturas futuras estruturadas</p>
                        <p>{dataset.recurring.length} recorrÃªncias sugeridas</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">PatrimÃ´nio identificado</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <p>Reservas: {formatCurrencyFromCents(dataset.netWorthSummary.reservesCents)}</p>
                        <p>Investimentos: {formatCurrencyFromCents(dataset.netWorthSummary.investmentsCents)}</p>
                        <p>DÃ­vidas abertas: {formatCurrencyFromCents(dataset.netWorthSummary.debtsCents)}</p>
                      </CardContent>
                    </Card>
                  </div>
                ) : null}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">PrÃ³ximo passo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-[var(--muted-foreground)]">
                  <p>Nas prÃ³ximas etapas vocÃª ajusta preferÃªncias, confirma contas, valida cartÃµes, patrimÃ´nio e compromissos fixos.</p>
                  <p>Partes opcionais podem ser puladas. O objetivo Ã© sair do onboarding com o app inteligÃ­vel e usÃ¡vel.</p>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {step === 1 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Nome de exibiÃ§Ã£o</Label>
                <Input value={userDisplayName} onChange={(event) => setUserDisplayName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Moeda base</Label>
                <Select value={baseCurrency} onChange={(event) => setBaseCurrency(event.target.value)}>
                  <option value="BRL">BRL â€” Real brasileiro</option>
                  <option value="USD">USD â€” DÃ³lar americano</option>
                  <option value="EUR">EUR â€” Euro</option>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Locale</Label>
                <Select value={locale} onChange={(event) => setLocale(event.target.value)}>
                  <option value="pt-BR">PortuguÃªs (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="es-ES">EspaÃ±ol</option>
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
                <Label>Horizonte futuro padrÃ£o</Label>
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
                    <Label>InstituiÃ§Ã£o</Label>
                    <Input value={account.institution} onChange={(event) => updateAccount(account.clientId, { institution: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={account.type} onChange={(event) => updateAccount(account.clientId, { type: event.target.value as AccountDraft["type"] })}>
                      <option value="checking">Conta corrente</option>
                      <option value="savings">PoupanÃ§a / CDI</option>
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
                    <Label>ObservaÃ§Ãµes</Label>
                    <Input value={account.notes} onChange={(event) => updateAccount(account.clientId, { notes: event.target.value })} />
                  </div>
                  <div className="flex items-center justify-between md:col-span-2">
                    <label className="inline-flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={account.includeInNetWorth}
                        onChange={(event) => updateAccount(account.clientId, { includeInNetWorth: event.target.checked })}
                      />
                      Entra no patrimÃ´nio
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
                  Adicionar cartÃ£o
                </Button>
                <Button type="button" variant="ghost" onClick={() => setCards([])}>
                  Pular cartÃµes
                </Button>
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>MÃªs do snapshot</Label>
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
                <Label>DÃ­vidas</Label>
                <Input value={netWorth.debts} onChange={(event) => setNetWorth((current) => ({ ...current, debts: event.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>ObservaÃ§Ãµes</Label>
                <Input value={netWorth.notes} onChange={(event) => setNetWorth((current) => ({ ...current, notes: event.target.value }))} />
              </div>
            </section>
          ) : null}

          {step === 5 ? (
            <section className="space-y-4">
              {recurring.map((item) => (
                <div key={item.clientId} className="grid gap-4 rounded-2xl border border-[var(--border)] p-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>TÃ­tulo</Label>
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
                    <Label>DireÃ§Ã£o</Label>
                    <Select value={item.direction} onChange={(event) => updateRecurring(item.clientId, { direction: event.target.value as RecurringDraft["direction"] })}>
                      <option value="expense">Despesa</option>
                      <option value="income">Receita</option>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>FrequÃªncia</Label>
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
                    <Label>ComeÃ§a em</Label>
                    <Input type="date" value={item.startsOn} onChange={(event) => updateRecurring(item.clientId, { startsOn: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>PrÃ³xima ocorrÃªncia</Label>
                    <Input type="date" value={item.nextRunOn} onChange={(event) => updateRecurring(item.clientId, { nextRunOn: event.target.value })} />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>ObservaÃ§Ãµes</Label>
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
                  Pular recorrÃªncias
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
                    <p className="font-medium">PreferÃªncias</p>
                    <p className="text-[var(--muted-foreground)]">
                      {userDisplayName} Â· {baseCurrency} Â· {locale} Â· {themePreference} Â· horizonte {projectionMonths} meses
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Contas</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedAccounts.map((account) => (
                        <li key={account.clientId}>
                          {account.name} â€” {account.institution || "sem instituiÃ§Ã£o"} â€” {account.openingBalance}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">CartÃµes</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedCards.length ? preparedCards.map((card) => (
                        <li key={card.clientId}>
                          {card.name} â€” limite {card.limitAmount} â€” fecha dia {card.closeDay}, vence dia {card.dueDay}
                        </li>
                      )) : <li>Sem cartÃµes iniciais.</li>}
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">PatrimÃ´nio</p>
                    <p className="text-[var(--muted-foreground)]">
                      Reservas {netWorth.reserves} Â· Investimentos {netWorth.investments} Â· DÃ­vidas {netWorth.debts}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">RecorrÃªncias</p>
                    <ul className="mt-2 space-y-1 text-[var(--muted-foreground)]">
                      {preparedRecurring.length ? preparedRecurring.map((item) => (
                        <li key={item.clientId}>
                          {item.title} â€” {item.amount} â€” {item.direction === "income" ? "receita" : "despesa"}
                        </li>
                      )) : <li>Sem recorrÃªncias iniciais.</li>}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">ApÃ³s concluir</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <Label>Destino final</Label>
                    <Select value={destination} onChange={(event) => setDestination(event.target.value as "dashboard" | "import")}>
                      <option value="dashboard">Ir para o dashboard</option>
                      <option value="import">Ir para a central de importaÃ§Ã£o</option>
                    </Select>
                  </div>
                  <p className="text-[var(--muted-foreground)]">
                    {source === "money"
                      ? "Como vocÃª escolheu a Money, faz sentido seguir para a central de importaÃ§Ã£o e rodar o bootstrap completo."
                      : "Se preferir, finalize e comece usando o app manualmente; a importaÃ§Ã£o continua disponÃ­vel depois."}
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
```

## `components\page-header.tsx`
```tsx
import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="max-w-3xl text-sm text-[var(--muted-foreground)] md:text-base">{description}</p>
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
```

## `components\section-header.tsx`
```tsx
export function SectionHeader({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      {eyebrow ? <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{eyebrow}</div> : null}
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {description ? <p className="max-w-3xl text-sm text-muted-foreground">{description}</p> : null}
    </div>
  );
}
```

## `components\sidebar.tsx`
```tsx
import Link from "next/link";
import { BarChart3, CalendarRange, CreditCard, DollarSign, FolderTree, Home, Import, Landmark, Repeat, Settings, TrendingUp, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/accounts", label: "Contas", icon: Landmark },
  { href: "/transactions", label: "TransaÃ§Ãµes", icon: Wallet },
  { href: "/cards", label: "CartÃµes", icon: CreditCard },
  { href: "/bills", label: "Faturas", icon: CreditCard },
  { href: "/calendar", label: "CalendÃ¡rio", icon: CalendarRange },
  { href: "/recurring", label: "RecorrÃªncias", icon: Repeat },
  { href: "/closings", label: "Fechamentos", icon: DollarSign },
  { href: "/future", label: "VisÃ£o futura", icon: TrendingUp },
  { href: "/net-worth", label: "PatrimÃ´nio", icon: BarChart3 },
  { href: "/categories", label: "Categorias", icon: FolderTree },
  { href: "/import", label: "ImportaÃ§Ã£o", icon: Import },
  { href: "/settings", label: "ConfiguraÃ§Ãµes", icon: Settings }
];

export function AppSidebar() {
  return (
    <Card className="sticky top-4 hidden h-[calc(100vh-2rem)] w-[260px] overflow-hidden lg:block">
      <div className="flex h-full flex-col p-4">
        <div className="px-3 py-4">
          <div className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">Aurea</div>
          <div className="mt-2 text-xl font-semibold">Finance</div>
          <p className="mt-2 text-sm text-muted-foreground">Clareza financeira diÃ¡ria, sem ruÃ­do.</p>
        </div>
        <nav className="mt-4 flex flex-1 flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </Card>
  );
}
```

## `components\stat-card.tsx`
```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StatCard({ title, value, description }: { title: string; value: string; description?: string }) {
  return (
    <Card className="bg-[linear-gradient(180deg,color-mix(in_oklab,var(--card)_97%,white),var(--card))]">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl md:text-3xl">{value}</CardTitle>
      </CardHeader>
      {description ? <CardContent className="text-sm text-[var(--muted-foreground)]">{description}</CardContent> : null}
    </Card>
  );
}
```

## `components\theme-provider.tsx`
```tsx
"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemeProvider } from "next-themes";

export function ThemeProvider({ children }: { children: ReactNode }) {
  return <NextThemeProvider attribute="class" defaultTheme="system" enableSystem>{children}</NextThemeProvider>;
}
```

## `components\theme-toggle.tsx`
```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm">Tema</button>;
  const dark = resolvedTheme === "dark";
  return (
    <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
```

## `components\topbar.tsx`
```tsx
import { Search } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { Input } from "@/components/ui/input";

export function Topbar({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border bg-card p-4 shadow-soft lg:flex-row lg:items-center lg:justify-between">
      <div>
        <div className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Aurea Finance</div>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden w-[260px] md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar em breve" className="pl-9" disabled />
        </div>
        <ModeToggle />
      </div>
    </div>
  );
}
```
