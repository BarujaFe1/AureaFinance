# Testing

## Stack

- **Runner:** Vitest
- **Escopo principal:** domínio puro (`lib/money`, `lib/dates`, `lib/finance`, import mapping/validation, invariants)
- **Comando:** `pnpm test` (CI) · `pnpm test:watch` (dev)

## O que cobrimos hoje

| Arquivo | Foco |
|---|---|
| `tests/money.test.ts` | parse/format/split em centavos |
| `tests/currency-settings.test.ts` | wiring de locale/currency |
| `tests/dates.test.ts` | ISO civil, add months/days |
| `tests/finance.spec.ts` | balance, installments, recurrence, closing |
| `tests/balance.test.ts` | invariantes de saldo |
| `tests/installments.test.ts` | geração de parcelas |
| `tests/recurrence.test.ts` | materialização |
| `tests/import-mapping.test.ts` | heurísticas de abas/colunas |
| `tests/import-validation.test.ts` | validação de linhas |
| `tests/invariants.test.ts` | conciliação / net worth conceitual |
| `tests/formatters.test.ts` | datas sem timezone shift |
| `tests/currency-parse.test.ts` | fail-loud vs soft parse |

## Como rodar

```bash
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Política

1. Bugs de domínio (money/dates/import) **devem** ganhar teste de regressão.
2. Preferir testes determinísticos sem SQLite quando o comportamento for puro.
3. Services com DB: preferir fixture temp SQLite em follow-ups (ainda gap consciente).
4. Não commitar dumps reais nem Money.xlsx pessoal para “fixar” import.

## Gaps conscientes

- Poucos testes de `services/*` contra SQLite real
- Sem e2e Playwright (custo/benefício no MVP local-first)
- Sem testes de componentes React

Esses gaps estão listados no roadmap e no HANDOFF.
