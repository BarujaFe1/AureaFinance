# DATABASE_NOTES

## Depende só de código
- JSX base dos componentes UI.
- Import de `zod`.
- Conversão `ArrayBuffer` -> `Buffer` na rota de análise.
- Navegação com `Link`/âncoras.
- Tipagem do `cashflow.service.ts`.

## Depende do SQLite real
- consistência dos dados importados;
- cards duplicados de negócio;
- datas de recorrência;
- horizon real de bills;
- conteúdo legado do `workbook_summary_json`.

## Se migrations já foram aplicadas
- não reaplique migrations só por causa deste patch;
- rode apenas `pnpm db:doctor` e valide o banco existente.

## Antes de rodar bootstrap/import/materialização
1. backup de `data/aurea-finance.sqlite`;
2. limpar `.next` e `tsconfig.tsbuildinfo`;
3. aplicar o patch;
4. rodar `pnpm typecheck`;
5. só então testar `/import` e fluxos de importação.
