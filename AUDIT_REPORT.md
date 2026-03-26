# AUDIT_REPORT.md

## Convenção de status usada aqui
- **corrigido**: modificação efetivamente aplicada e validada no código real.
- **parcialmente corrigido**: alteração aplicada, mas dependente de validação adicional.
- **não corrigido**: confirmado/provável no scan/handoff/planilha, porém não alterado no código real.
- **proposto, não validado**: direção de correção já definida, mas não aplicada nesta entrega.

> Nesta entrega, por ausência do repositório real, **nenhum bug crítico foi marcado como "corrigido"**.

---

## 1) Linha arquitetural ativa / coexistência de rotas de fechamento
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `app/(workspace)/closings/page.tsx`
- `app/monthly-closing/page.tsx`
- `components/app-shell.tsx`
- `components/sidebar.tsx`

**Trecho antes (evidência do scan):**
```tsx
## app\monthly-closing\page.tsx
redirect("/closings")
```

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- `/closings` permanece rota canônica.
- `/monthly-closing` fica apenas como compatibilidade controlada ou é removido com segurança.
- nenhum link principal da navegação aponta para a rota legada.

**Como validar:**
1. `rg -n "monthly-closing" app components services features db lib scripts`
2. confirmar que a sidebar e quaisquer CTAs usam `/closings`
3. navegar manualmente em `/closings` e `/monthly-closing`

---

## 2) Divergência semântica de saldo entre Dashboard / Contas / Future
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `services/dashboard.service.ts`
- `services/accounts.service.ts`
- `services/cashflow.service.ts`
- `app/(workspace)/dashboard/page.tsx`
- `app/(workspace)/accounts/page.tsx`
- `app/(workspace)/future/page.tsx`

**Trecho antes (evidência funcional do scan):**
```tsx
title="Saldo consolidado"
description="Somatório das contas não-cartão."
```

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- separar explicitamente:
  - saldo operacional do dia
  - saldo agregado por contas
  - saldo projetado
  - liquidez patrimonial
  - patrimônio total
- eliminar divergência entre headline do dashboard, lista de contas e visão futura.

**Como validar:**
1. montar tabela de reconciliação contra a planilha:
   - `1. Acompanhamento Mensal`
   - `2. Visão Geral`
   - `8. Registro Diário`
2. comparar os mesmos números nas telas:
   - dashboard
   - contas
   - future

---

## 3) Future usa horizonte em dias enquanto settings expõe projectionMonths
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `app/(workspace)/future/page.tsx`
- `services/cashflow.service.ts`
- `services/settings.service.ts`

**Trecho antes (evidência do scan):**
```tsx
const horizon = Math.min(Math.max(Number(searchParams?.horizon ?? 90) || 90, 15), 365);
const projection = await getProjectedCashflow(horizon);
```

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- alinhar a tela Future com `projectionMonths` ou tornar explícita a coexistência `dias` vs `meses`.
- impedir que a UI prometa uma coisa e o cálculo faça outra.

**Como validar:**
1. alterar `projectionMonths` em Settings
2. abrir Future sem querystring e com querystring explícita
3. verificar se o horizonte usado corresponde à regra definida para o produto

---

## 4) Mojibake / encoding quebrado
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `components/sidebar.tsx`
- `components/app-shell.tsx`
- `app/(workspace)/**/*`
- `app/error.tsx`
- `app/loading.tsx`
- eventuais fontes salvas com encoding incorreto

**Trecho antes (evidência do scan):**
```tsx
"CartÃµes"
"VisÃ£o futura"
"ConsolidaÃ§Ã£o do mÃªs"
"PatrimÃ´nio"
```

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- todas as strings em UTF-8 correto
- sidebar, page headers, empty states e mensagens de erro sem caracteres quebrados

**Como validar:**
1. `rg -n "Ã|â€¦|Â·|â†’|CartÃ|VisÃ|ConfiguraÃ|TransaÃ|PatrimÃ|ConsolidaÃ" app components services features db lib scripts`
2. inspecionar UI manualmente após rebuild

---

## 5) Cartões / faturas / parcelamentos futuros legítimos (incluindo 2027)
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `services/cards.service.ts`
- `app/(workspace)/cards/page.tsx`
- `app/(workspace)/bills/page.tsx`
- `services/money-bootstrap.service.ts`
- tabelas de bills / billEntries / purchases / installments

**Trecho antes (referência funcional):**
- a planilha contém parcelamentos legítimos que alcançam 2027
- o app precisa suportar isso sem tratar o ano como bug

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- faturas em 2027 só aparecem quando derivadas de parcelamentos reais
- cada fatura possui entradas auditáveis
- `billEntries` conciliam com `creditCardBills.totalAmountCents`

**Como validar:**
1. confrontar mês a mês:
   - `Cartão Nubank`
   - `Cartão MercadoPago`
2. conferir itens, parcelas e total por fatura contra a aba `5. Cartões`

---

## 6) Recorrências / materialização / duplicidade com seedProjectionRulesIfMissing
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `services/recurring.service.ts`
- `services/cashflow.service.ts`
- `services/money-bootstrap.service.ts`
- eventual função `seedProjectionRulesIfMissing()`
- telas `future`, `calendar`, `dashboard`

**Trecho antes (evidência do scan):**
- presença de `seedProjectionRulesIfMissing()`
- presença de bootstrap Money para recorrências
- Future depende de eventos materializados

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- uma única fonte de verdade para regras recorrentes
- materialização consistente de ocorrências
- ausência de duplicidade entre bootstrap, seed e projeção

**Como validar:**
1. inspecionar quantidade de regras recorrentes
2. rodar materialização
3. comparar eventos no Dashboard / Calendar / Future

---

## 7) Patrimônio / buckets manuais vs posições importadas
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `services/net-worth.service.ts`
- `services/dashboard.service.ts`
- `app/(workspace)/net-worth/page.tsx`
- tabelas `netWorthSummaries`, `reserves`, `stockPositions`, `cryptoPositions`

**Trecho antes (evidência do scan):**
- dashboard usa `manualReservesCents`, `manualInvestmentsCents`, `manualDebtsCents`
- tela de patrimônio também renderiza reservas, ações e cripto

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- nenhuma dupla contagem entre snapshot manual e posições importadas
- distinção explícita entre:
  - liquidez atual
  - reservas
  - investimentos
  - dívidas
  - patrimônio total

**Como validar:**
1. confrontar tela de patrimônio com:
   - `2. Visão Geral`
   - `7. Resumo do Investimento`
   - `8. Registro Diário`
   - `9. Registro Diário de Investime`
2. confirmar soma final por bucket

---

## 8) Importação / bootstrap Money / idempotência / seed falso
**Status:** não corrigido  
**Arquivos envolvidos (esperados no repo real):**
- `services/money-bootstrap.service.ts`
- `db/seed.ts`
- `scripts/doctor.ts`
- staging/import actions
- tabelas do domínio financeiro

**Trecho antes (evidência do scan):**
- existe `getMoneyBootstrapDataset()`
- existe fluxo de bootstrap da Money
- o handoff alerta para risco de contaminação por seed/mock

**Trecho depois:** não aplicável nesta entrega.

**Efeito esperado após correção real:**
- bootstrap/import idempotentes
- seed de demo não contamina base real
- importação da planilha não duplica contas, cartões, bills, parcelas e snapshots

**Como validar:**
1. banco limpo + bootstrap único
2. rodar bootstrap/import pela segunda vez
3. comparar contagens antes/depois
4. rodar doctor para detectar duplicidades

---

## Resumo final desta entrega
- **corrigido:** 0
- **parcialmente corrigido:** 0
- **não corrigido:** 8
- **proposto, não validado:** o plano completo de saneamento existe, mas depende do repositório real para aplicação segura.
