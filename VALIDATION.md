# VALIDATION

## Ordem recomendada
```bash
rm -rf .next
rm -f tsconfig.tsbuildinfo
pnpm install
pnpm typecheck
pnpm db:doctor
pnpm dev
```

## Resultado esperado
- `pnpm install`: lockfile já atualizado.
- `pnpm typecheck`: queda forte do bloco de `TS2786` em componentes UI, `zod`, `next/link`, `clsx` e `ArrayBuffer`.
- `pnpm db:doctor`: deve permanecer sem `importBatchesMissingSummary`, sem `recurringWithoutOccurrences`, sem duplicados de cartões.
- `pnpm dev`: app sobe e `/import` continua abrindo.

## Greps úteis
```bash
grep -RIn "Cannot read properties of undefined" app components services features lib
grep -RIn "monthly-closing" app components services features lib db
grep -RIn "transactionDate\|dueDate\|referenceMonth\|referenceDate\|statementMonth\|scheduledDate" app components services features lib db
grep -RIn "Ã\|â€¦\|Â\|�" app components services features lib db scripts
```
