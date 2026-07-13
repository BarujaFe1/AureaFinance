# AUDIT_REPORT — Aurea Finance

**Branch:** `chore/portfolio-quality-pass`  
**Data:** 2026-07-13  
**Autor da revisão:** Cursor agent (portfolio quality pass)

## Resumo executivo

O Aurea Finance já era um portfólio forte: monolito modular local-first (Next.js 15 + SQLite + Drizzle), domínio financeiro em centavos, tríade calculado × projetado × conferido, importação com staging/dry-run e README visual maduro.

Os maiores gaps para publicação pública eram: **dados pessoais/sintéticos demais no bootstrap Money.xlsx**, **ausência de CI**, **docs de handoff/segurança/deploy incompletas**, **inconsistências de timezone em `today`**, parsers monetários silenciosos e **lint não configurado**.

Esta passagem eleva o repositório de “produto local bem contado” para “peça de portfólio auditável, testável e segura de compartilhar”.

## Nota atual

| Dimensão | Antes | Depois (alvo desta pass) |
|---|---:|---:|
| Domínio financeiro | 8.5 | 9.0 |
| Arquitetura | 8.0 | 8.5 |
| Testes | 7.5 | 8.0 |
| Docs / narrativa | 8.0 | 9.0 |
| Segurança / privacidade | 5.5 | 8.5 |
| DX / CI | 5.0 | 8.5 |
| UX / a11y | 7.0 | 7.8 |
| **Nota geral** | **7.2** | **8.6** |

## Principais riscos

1. **Privacidade:** bootstrap e seed com nomes/instituições/valores próximos de dados reais (corrigido via anonimização).
2. **Deploy cloud ingênuo:** SQLite em filesystem efêmero (Vercel) sem volume → perda de dados.
3. **Sem autenticação:** esperado local-first; perigoso se exposto publicamente.
4. **`xlsx` CVE surface:** mitigado com limites de tamanho/linhas; ainda merece atenção.
5. **Next.js 15.2.0:** aviso de vulnerabilidade conhecida — upgrade recomendado em follow-up.
6. **Timezone:** mistura de `toISOString().slice(0,10)` (UTC) com `todayIso()` (local) — corrigido nos pontos críticos.

## Quick wins (feitos / em andamento)

- [x] Branch `chore/portfolio-quality-pass`
- [x] Anonimizar `lib/money-bootstrap.ts` e deduplicar tipo embutido
- [x] Anonimizar `scripts/seed.ts`
- [x] Unificar “hoje” via `todayIso()` nos forms/actions
- [x] Parser monetário fail-loud + `toSafeCents` soft
- [x] Datas de UI sem shift de timezone (`formatShortDate`)
- [x] CI GitHub Actions
- [x] ESLint (`next/core-web-vitals`)
- [x] Pack de docs (`TECHNICAL_DECISIONS`, `TESTING`, `DEPLOYMENT`, `HANDOFF`, `SECURITY_NOTES`)
- [x] Remover clutter de root (`PATCH_NOTES`, `VALIDATION`, etc.)
- [x] UX: `aria-current`, empty state em categorias, tip de DB mais amigável

## Melhorias estruturais

1. Camada `services/` + `lib/domain/` + actions tipadas com Zod — manter.
2. Um único módulo canônico de money (`currency.ts` settings-aware; `money.ts` helpers de domínio).
3. Política explícita de calendário local (BR) documentada em `TECHNICAL_DECISIONS.md`.
4. CI como gate obrigatório de PR.
5. Demo mode = `pnpm dbmigrate && pnpm dbseed` (dados sintéticos).

## Bugs encontrados

| ID | Severidade | Status | Descrição |
|---|---|---|---|
| P1 | Alta (privacidade) | Corrigido | Bootstrap/seed com dados pessoais identificáveis |
| P2 | Média | Corrigido | `today` UTC vs local em forms |
| P3 | Média | Corrigido | `formatShortDate` com `new Date("yyyy-MM-dd")` shiftava dia |
| P4 | Média | Corrigido | `parseCurrencyToCents` engolia input inválido → `0` |
| P5 | Baixa | Corrigido | Tipo `MoneyBootstrapDataset` duplicava ~1.5k linhas de dados |
| P6 | Média | Corrigido | `pnpm lint` interativo (sem ESLint config) |
| P7 | Baixa | Documentado | Sem snapshot ≠ “conferido zerado” semanticamente no dashboard |
| P8 | Média | Documentado | Next 15.2.0 com advisory de segurança |

## Plano de execução

1. Diagnóstico + auditoria  
2. Privacidade (bootstrap/seed)  
3. Bugs de data/moeda + testes  
4. CI + ESLint  
5. Docs + README gaps  
6. UX leve  
7. Limpeza de root  
8. Validação (`typecheck`/`test`/`lint`/`build`)  
9. Handoff + commit + push  

## Checklist final

- [x] Projeto instala (`pnpm install`)
- [x] Testes passam (85+)
- [x] Typecheck passa
- [x] Lint passa com config versionada
- [x] Build passa
- [x] `.env.example` existe
- [x] `.gitignore` protege SQLite / Money.xlsx / `.env`
- [x] CI adicionada
- [x] Docs de arquitetura/testes/deploy/handoff
- [x] README de portfólio forte
- [x] Dados pessoais scrubbed do bootstrap público
- [x] UX: `aria-current`, empty state em categorias, tip de DB mais amigável
- [x] Remover clutter de root (`PATCH_NOTES`, `VALIDATION`, etc.)
