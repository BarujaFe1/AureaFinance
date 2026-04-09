# AUDIT_REPORT

## Status por bug crítico

### 1. JSX base quebrando em massa (`Card`, `Button`, `Input`, `Select`, `Label`, `Badge`)
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivos: `components/ui/*`
- Antes: componentes apareciam para o compilador como retorno `unknown` / `Element` incompatível.
- Depois: todos retornam `JSX.Element` com props explícitas.
- Efeito esperado: queda massiva dos `TS2786` espalhados por `app/`, `components/` e `features/`.
- Como validar: `pnpm typecheck`.

### 2. `zod` incompatível
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivos: `lib/validation.ts`, `components/forms/transaction-form.tsx`, `services/csv-import.service.ts`
- Antes: `import * as z from "zod"` gerava erros como `Property 'object' does not exist`.
- Depois: `import { z } from "zod"`.
- Efeito esperado: retorno de tipagem correta para schemas e forms.
- Como validar: `pnpm typecheck`.

### 3. `next/link` / `ComponentType` quebrando JSX
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivos: `components/app-shell.tsx`, `components/sidebar.tsx`, `components/theme-provider.tsx`, `app/onboarding/page.tsx`, `components/onboarding/onboarding-wizard.tsx`
- Antes: `Link` e `ComponentType` causavam erros de compilação.
- Depois: navegação degradada para âncoras simples e wrapper de tema sem `ComponentType`.
- Efeito esperado: remover bloqueio de tipo sem afetar o funcionamento básico.
- Como validar: `pnpm typecheck` e abrir `/onboarding`.

### 4. Rota `/api/import/analyze`
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivo: `app/api/import/analyze/route.ts`
- Antes: `Buffer.from(arrayBuffer)` e uso incompatível de buffer.
- Depois: `Buffer.from(new Uint8Array(arrayBuffer))`.
- Efeito esperado: evitar erro de tipo e manter análise de workbook funcionando.
- Como validar: upload pela tela `/import`.

### 5. `Fragment` inválido no workbench
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivo: `components/import/import-workbench.tsx`
- Antes: `Fragment` em tabela aparecia como JSX inválido.
- Depois: `flatMap` com linhas chaveadas.
- Efeito esperado: remover erro de JSX e manter renderização da tabela.
- Como validar: abrir `/import` após typecheck.

### 6. `unknown` em `services/cashflow.service.ts`
- Status: **corrigido em código, não validado em runtime local deste ambiente**
- Arquivo: `services/cashflow.service.ts`
- Antes: `settlementAccountId`, `name` e similares eram lidos de `unknown`.
- Depois: aliases `AccountRow`, `CreditCardRow`, `RuleRow`, etc. + casts explícitos.
- Efeito esperado: queda dos erros TS2339 nessa service.
- Como validar: `pnpm typecheck`.
