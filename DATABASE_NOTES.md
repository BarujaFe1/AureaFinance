# DATABASE_NOTES.md

## 1) O que depende apenas de código
Os itens abaixo podem ser corrigidos apenas no repositório, sem precisar alterar o SQLite primeiro:
- textos e mojibake
- rotas, redirects, sidebar e navegação
- alinhamento de naming em UI/serviços
- contratos de cálculo e composição de DTOs
- doctor/checks/scripts auxiliares
- guardrails contra seed/demo em ambiente real

## 2) O que depende do SQLite real
Os itens abaixo **não podem ser dados como resolvidos** sem inspecionar o banco local:
- drift entre `db/schema.ts` e colunas reais
- migrations já aplicadas
- conflito entre migrations antigas/duplicadas
- duplicidade gerada por seed + bootstrap + import
- integridade entre contas, transações, bills, billEntries, installments e snapshots
- estado real de settings (`locale`, `projectionMonths`) no banco já existente

## 3) O que fazer se as migrations já foram aplicadas
1. Fazer backup do arquivo SQLite antes de qualquer ação.
2. Rodar `pnpm db:doctor`.
3. Comparar:
   - schema tipado atual
   - pasta `db/migrations`
   - estrutura real do banco
4. Se houver drift:
   - **não** apagar dados reais por impulso
   - documentar quais colunas/tabelas existem só no banco
   - decidir entre migration corretiva ou compat layer temporária
5. Só depois rodar novas migrations.

## 4) O que fazer se há seed falso
1. Localizar a origem:
   - `db/seed.ts`
   - bootstrap automático
   - scripts auxiliares
   - onboarding
2. Separar claramente:
   - dado de demo
   - dado real importado
3. Em banco real já contaminado:
   - identificar registros fake por nome/slugs/notes padronizadas
   - remover ou arquivar **somente após backup**
   - revalidar dashboards e totais após limpeza
4. Nunca rodar seed genérica junto com bootstrap Money na mesma base sem idempotência confirmada.

## 5) O que fazer antes de rodar bootstrap / import / materialização
1. Backup do SQLite.
2. Confirmar que o banco de teste está limpo ou conscientemente preparado.
3. Rodar `pnpm db:doctor`.
4. Desabilitar qualquer seed automática de demo.
5. Definir a regra de verdade para:
   - saldo operacional
   - saldo agregado por contas
   - saldo projetado
   - patrimônio total
6. Confirmar que a importação da Money está mapeando corretamente:
   - contas
   - cartões
   - bills
   - parcelas
   - recorrências
   - reservas
   - ações
   - cripto
   - snapshots
7. Rodar bootstrap/import uma vez.
8. Medir contagens.
9. Rodar bootstrap/import uma segunda vez.
10. Confirmar idempotência ou, no mínimo, ausência de duplicação indevida.

## 6) Ordem segura de aplicação no repo real
1. backup do banco
2. typecheck/build/doctor
3. auditoria de migrations
4. limpeza de seed/demo
5. correção dos serviços
6. correção das telas
7. bootstrap/import em base de teste
8. reconciliação contra a planilha
9. só então aplicar em base principal

## 7) Riscos que exigem atenção máxima
- apagar 2027 achando que é bug e perder parcelamentos reais
- somar patrimônio com caixa disponível
- aceitar empty state como legítimo sem auditar query/import
- rodar seed de demo por cima da base real
- mudar naming de data/mês sem varrer schema + services + UI + migrations
- remover `/monthly-closing` sem validar compatibilidade restante
