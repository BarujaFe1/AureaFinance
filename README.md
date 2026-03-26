# Aurea Finance

Aurea Finance é um app financeiro pessoal local-first, desktop-first e solo-friendly, pensado para substituir uma planilha financeira por uma aplicação real, bonita e confiável.

## Resumo do produto

O foco da V1 é ser uma fonte única da verdade para:

- contas e saldos por conta;
- receitas, despesas e transferências;
- cartões de crédito com fechamento, vencimento, limite e faturas;
- compras parceladas com geração explícita de parcelas futuras;
- recorrências e contas fixas;
- fechamento mensal;
- patrimônio resumido;
- importação assistida de planilha `.xlsx/.csv` com staging, validação e dry-run.

## Stack escolhida

- Next.js 15 com App Router
- TypeScript
- Tailwind CSS
- componentes no estilo shadcn/ui
- Drizzle ORM
- SQLite local com `better-sqlite3`
- `next-themes` para light/dark
- Recharts para gráficos
- Zod para validações
- React Hook Form para formulários principais
- `date-fns` para datas
- `xlsx` / SheetJS Community Edition para importação

## Decisões arquiteturais principais

### 1) Monolito modular

O projeto fica em um único repositório. Isso reduz carga mental, evita microsserviços e combina com o cenário solo.

### 2) Banco local com SQLite

Toda a V1 funciona plenamente sem Supabase, PostgreSQL ou serviços externos. O banco mora em:

`data/aurea-finance.sqlite`

### 3) Dinheiro sempre em centavos

Todos os valores monetários persistidos usam inteiros (`amount_cents`, `balance_cents`, etc.).

### 4) Cartão de crédito como módulo próprio

Cartão não é tratado como conta comum. Existem tabelas próprias para cartão, fatura, compra, parcela e entrada de fatura.

### 5) Importação auditável

A planilha entra primeiro em staging:

- `import_batches`
- `import_raw_rows`
- `import_mappings`
- `import_issues`

Só depois disso os dados são validados, simulados em dry-run e então confirmados.

## Estrutura de pastas

```text
app/
components/
  charts/
  ui/
features/
  accounts/
  cards/
  categories/
  import/
  monthly-closing/
  net-worth/
  recurring/
  settings/
  transactions/
db/
  migrations/
lib/
services/
scripts/
docs/
tests/
data/
```

## Modelo de dados

### Tabelas centrais

- `accounts`: contas reais do usuário
- `account_balance_snapshots`: snapshots de saldo por data
- `transactions`: receitas, despesas, ajustes, pagamentos de fatura e lados de transferências
- `transfers`: entidade de transferência entre contas, com os dois lançamentos vinculados
- `categories`, `subcategories`, `tags`, `transaction_tags`: classificação financeira
- `recurring_rules`, `recurring_occurrences`: motor de recorrências
- `credit_cards`: metadados de cartão
- `credit_card_bills`: faturas abertas/fechadas/pagas
- `card_purchases`: compra original no cartão
- `card_installments`: parcelas futuras explícitas
- `bill_entries`: itens que compõem a fatura
- `reminders`: lembretes agendáveis
- `import_batches`, `import_raw_rows`, `import_mappings`, `import_issues`: staging da importação
- `monthly_closings`: fechamento consolidado do mês
- `net_worth_summaries`: patrimônio resumido manual/importado
- `settings`: configuração única da aplicação

## Fluxo funcional principal

### Dashboard

Consolida:

- saldo atual;
- saldo projetado;
- receitas e despesas do mês;
- próximas faturas;
- próximas recorrências;
- patrimônio resumido.

### Cartões e parcelas

Quando uma compra parcelada é criada:

1. a compra vira `card_purchases`;
2. as parcelas são pré-geradas em `card_installments`;
3. cada parcela é vinculada à fatura correta em `credit_card_bills`;
4. a fatura recebe entradas em `bill_entries`.

### Recorrências

A regra fica em `recurring_rules`. As ocorrências futuras ficam em `recurring_occurrences`. Quando uma ocorrência é realizada, ela gera um lançamento em `transactions` sem apagar o histórico anterior.

### Importação

1. upload do arquivo;
2. inventário das abas;
3. mapeamento manual de aba e colunas;
4. validação;
5. dry-run;
6. confirmação final.

## Instalação rápida

```bash
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Abra `http://localhost:3000`.

## Backup

### Backup manual

Copie o arquivo:

```text
data/aurea-finance.sqlite
```

### Backup por script

```bash
pnpm db:backup
```

## Testes

```bash
pnpm test
```

Os testes cobrem:

- saldo atual;
- saldo projetado;
- parcelas;
- recorrências;
- fechamento mensal;
- parsing de rótulo de parcela.

## Arquivos mais importantes

- `db/schema.ts`
- `services/import.service.ts`
- `services/cards.service.ts`
- `services/recurring.service.ts`
- `services/monthly-closing.service.ts`
- `app/import/[batchId]/page.tsx`
- `app/dashboard/page.tsx`
- `docs/beginner-setup.md`
- `docs/data-model.md`

## Situação da V1

Esta entrega é propositalmente pragmática:

- cobre o domínio central;
- mantém o projeto gratuito;
- deixa espaço claro para V2 sem acoplar serviços pagos;
- evita complexidade desnecessária.

Leia também:

- `docs/beginner-setup.md`
- `docs/data-model.md`
- `docs/troubleshooting.md`
- `docs/roadmap.md`
