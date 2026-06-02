<div align="center">
  <img src="./icon.png" alt="Aurea Finance Logo" width="120" height="120" />

  <h1>Aurea Finance</h1>

  <p><strong>Finanças pessoais local-first, com foco em operação diária, corrigibilidade e rastreabilidade</strong></p>
  <p><strong>Local-first personal finance focused on daily operation, correction and traceability</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a> •
    <a href="#en">English</a> •
    <a href="#stack--tecnologias">Stack</a> •
    <a href="#quick-start--início-rápido">Quick Start</a> •
    <a href="#banco-e-backup--database-and-backup">Banco</a> •
    <a href="#autor--author">Autor</a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="MIT License" />
    <img src="https://img.shields.io/badge/Next.js-15-black.svg?logo=next.js&logoColor=white" alt="Next.js 15" />
    <img src="https://img.shields.io/badge/React-19-149ECA.svg?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6.svg?logo=typescript&logoColor=white" alt="TypeScript 5.x" />
    <img src="https://img.shields.io/badge/SQLite-local--first-003B57.svg?logo=sqlite&logoColor=white" alt="SQLite Local First" />
    <img src="https://img.shields.io/badge/Drizzle-ORM-C5F74F.svg" alt="Drizzle ORM" />
  </p>

  <p>
    <a href="https://barujafe.vercel.app/"><strong>🌐 Portfólio</strong></a> •
    <a href="https://github.com/BarujaFe1"><strong>🐙 GitHub</strong></a> •
    <a href="https://www.linkedin.com/in/barujafe/"><strong>💼 LinkedIn</strong></a>
  </p>
</div>

---

<a id="pt-br"></a>

## 🇧🇷 PT-BR

## 💰 Visão geral

**Aurea Finance** é um sistema web de finanças pessoais criado para substituir uma planilha operacional por um fluxo mais consistente, auditável e editável.

O projeto adota uma abordagem **local-first**, com **SQLite local**, regras de domínio explícitas e forte ênfase em correção operacional pela interface. A proposta não é automatizar tudo a qualquer custo, mas criar um sistema confiável para uso diário, onde os dados possam ser conferidos, corrigidos, reconciliados e evoluídos sem depender de ajustes manuais no código.

> **Objetivo:** oferecer controle financeiro pessoal com clareza operacional, rastreabilidade e capacidade real de correção.

---

## 🎯 Problema que resolve

Muitos controles financeiros pessoais começam em planilhas. Com o tempo, a planilha cresce, ganha abas, fórmulas, exceções, gambiarras e dependência de memória operacional.

Isso gera problemas como:

- saldos que não batem com a realidade;
- cartões e faturas difíceis de reconciliar;
- parcelamentos espalhados;
- recorrências pouco controláveis;
- patrimônio atualizado manualmente sem histórico;
- categorias duplicadas;
- importações difíceis de revisar;
- falta de separação entre saldo calculado, projetado e conferido.

O **Aurea Finance** nasce para transformar esse controle em um sistema estruturado, mantendo a flexibilidade necessária para corrigir dados quando a vida real muda.

---

## 🧭 Por que local-first?

A abordagem local-first é central porque:

- reduz dependência de serviços externos para a operação principal;
- mantém o banco sob controle direto do usuário;
- facilita backup, restauração e portabilidade;
- melhora previsibilidade de comportamento;
- favorece privacidade;
- simplifica a operação de um produto pessoal e técnico ao mesmo tempo.

O banco principal é um arquivo SQLite local, pensado para ser copiável, restaurável e auditável.

---

## ✨ Principais capacidades

### 📊 Dashboard financeiro

- Visão consolidada do estado financeiro atual.
- Indicadores principais.
- Alertas operacionais.
- Vencimentos.
- Divergências.
- Atalhos para correção.

### 🏦 Contas

- Controle de contas correntes, reservas e contas operacionais.
- Saldo calculado.
- Saldo real conferido.
- Saldo projetado.
- Diferenças entre cálculo, projeção e realidade.

### ✅ Conferência diária

Fluxo central de uso diário.

Permite:

- registrar saldos reais;
- atualizar ativos;
- revisar divergências;
- ajustar inconsistências;
- fechar o dia com mais segurança operacional.

### 💸 Transações

- Receitas e despesas.
- Criação, edição e exclusão.
- Observações, categorias e tags.
- Base principal do cálculo financeiro.

### 💳 Cartões e faturas

- Cadastro de cartões.
- Compras e parcelamentos.
- Vínculo com conta pagadora.
- Controle de limite.
- Composição de faturas.
- Status de pagamento.
- Relação entre compra no cartão e saída real de caixa.

### 🔁 Recorrências

- Entradas e saídas recorrentes.
- Edição por ocorrência.
- Edição por série.
- Pausa, reativação e duplicação.
- Materialização de eventos futuros.

### 📅 Calendário financeiro

- Visualização temporal de eventos.
- Organização de compromissos financeiros.
- Apoio ao planejamento mensal.

### 📦 Patrimônio

- Ativos.
- Reservas.
- Snapshots.
- Evolução patrimonial.
- Atualização manual de posições.
- Correção de ticker, quantidade, classificação e valor.

### 🧾 Fechamentos mensais

- Consolidação por período.
- Histórico financeiro.
- Leitura de composição mensal.
- Base para análise de evolução.

### 🏷️ Categorias e tags

- Classificação editável.
- Revisão contínua.
- Organização sem catálogos rígidos.
- Possibilidade de correção e reclassificação.

### 📥 Importação

- Importação de workbooks e planilhas.
- Mapeamento e staging.
- Revisão antes do commit.
- Aceleração de onboarding.
- Dados importados continuam editáveis depois.

---

## 🧱 Princípios do produto

### 1. Local-first

O sistema deve continuar útil e previsível sem infraestrutura remota.

### 2. Corrigibilidade pela interface

Qualquer dado que possa estar errado no uso real deve poder ser corrigido pela UI.

### 3. Evitar hardcodes e estados irreversíveis

Bancos, ativos, categorias e cadastros operacionais não devem ser tratados como listas rígidas.

### 4. Separar cálculo, projeção e conferência

O Aurea diferencia:

- **valor calculado** a partir das movimentações;
- **valor projetado** com base em eventos futuros;
- **valor conferido** manualmente como realidade operacional.

### 5. Importação como aceleração, não prisão

Importar dados serve para acelerar adoção, não para congelar dados legados.

---

## 🛠️ Editabilidade operacional

O Aurea Finance foi pensado para tolerar erro humano, importação imperfeita e evolução de cadastro sem exigir intervenção no código.

Exemplos:

- renomear banco ou instituição;
- corrigir conta e vínculos;
- ajustar saldo real;
- editar ativo patrimonial;
- corrigir ticker, nome ou classificação de ativo;
- ajustar quantidade ou valor manual;
- corrigir compra no cartão;
- pausar, reativar ou duplicar recorrência;
- mesclar categorias duplicadas;
- revisar dados importados;
- arquivar ou restaurar entidades;
- preferir soft delete quando fizer sentido.

Esse princípio evita um problema comum em sistemas financeiros pessoais: ficar preso a um dado errado por limitação da interface.

---

<a id="en"></a>

## 🇺🇸 English

## 💰 Overview

**Aurea Finance** is a personal finance web system created to replace an operational spreadsheet with a more consistent, auditable and editable workflow.

The project adopts a **local-first** approach with **local SQLite**, explicit domain rules and strong emphasis on operational correction through the interface. The goal is not to automate everything at any cost, but to create a reliable daily-use system where data can be checked, corrected, reconciled and evolved without manual code changes.

> **Goal:** provide personal financial control with operational clarity, traceability and real correction capability.

---

## 🎯 Problem solved

Many personal finance systems begin as spreadsheets. Over time, the spreadsheet grows, accumulates tabs, formulas, exceptions, workarounds and operational memory.

This creates problems such as:

- balances that do not match reality;
- cards and invoices that are hard to reconcile;
- scattered installments;
- poorly controlled recurring events;
- manually updated assets without history;
- duplicated categories;
- imports that are difficult to review;
- no clear separation between calculated, projected and checked balance.

**Aurea Finance** turns that control into a structured system while preserving the flexibility required to correct data when real life changes.

---

## 🧭 Why local-first?

The local-first approach is central because it:

- reduces dependency on external services for the core operation;
- keeps the database under the user's direct control;
- simplifies backup, restore and portability;
- improves behavior predictability;
- favors privacy;
- keeps a personal and technical product easier to operate.

The main database is a local SQLite file designed to be copied, restored and audited.

---

## ✨ Core capabilities

### 📊 Financial dashboard

- Consolidated view of current financial status.
- Main indicators.
- Operational alerts.
- Due dates.
- Divergences.
- Correction shortcuts.

### 🏦 Accounts

- Current accounts, reserves and operational accounts.
- Calculated balance.
- Checked real balance.
- Projected balance.
- Differences between calculation, projection and reality.

### ✅ Daily reconciliation

The central daily workflow.

It allows the user to:

- register real balances;
- update assets;
- review divergences;
- fix inconsistencies;
- close the day with more operational confidence.

### 💸 Transactions

- Income and expenses.
- Creation, editing and deletion.
- Notes, categories and tags.
- Main basis for financial calculation.

### 💳 Cards and invoices

- Card management.
- Purchases and installments.
- Link to paying account.
- Limit control.
- Invoice composition.
- Payment status.
- Relationship between card purchase and real cash outflow.

### 🔁 Recurrences

- Recurring income and expenses.
- Edit by occurrence.
- Edit by series.
- Pause, reactivate and duplicate.
- Future event materialization.

### 📅 Financial calendar

- Timeline view of events.
- Organization of financial commitments.
- Monthly planning support.

### 📦 Net worth

- Assets.
- Reserves.
- Snapshots.
- Net worth evolution.
- Manual position updates.
- Correction of ticker, quantity, classification and value.

### 🧾 Monthly closings

- Consolidation by period.
- Financial history.
- Monthly composition reading.
- Basis for evolution analysis.

### 🏷️ Categories and tags

- Editable classification.
- Continuous review.
- Organization without rigid catalogs.
- Correction and reclassification support.

### 📥 Import

- Workbook and spreadsheet import.
- Mapping and staging.
- Review before commit.
- Onboarding acceleration.
- Imported data remains editable.

---

## 🧱 Product principles

### 1. Local-first

The system should remain useful and predictable without remote infrastructure.

### 2. Correction through the interface

Any data that can be wrong in real use should be correctable through the UI.

### 3. Avoid hardcodes and irreversible states

Banks, assets, categories and operational records should not be treated as rigid lists.

### 4. Separate calculation, projection and reconciliation

Aurea distinguishes:

- **calculated value** from movements;
- **projected value** from future events;
- **checked value** manually entered as operational reality.

### 5. Import as acceleration, not lock-in

Importing data accelerates adoption. It should not freeze legacy data.

---

## 🛠️ Operational editability

Aurea Finance was designed to tolerate human error, imperfect imports and registration evolution without requiring code intervention.

Examples:

- rename bank or institution;
- correct account and links;
- adjust real balance;
- edit net worth asset;
- correct asset ticker, name or classification;
- adjust quantity or manual value;
- correct card purchase;
- pause, reactivate or duplicate recurrence;
- merge duplicated categories;
- review imported data;
- archive or restore entities;
- prefer soft delete when appropriate.

This principle avoids a common problem in personal finance systems: getting stuck with wrong data because the UI cannot correct it.

---

<a id="stack--tecnologias"></a>

## 🛠️ Stack / Tecnologias

### Frontend

- **Next.js 15**
- **React 19**
- **TypeScript 5.x**
- **Tailwind CSS 4**

### Database and persistence

- **SQLite**
- **Drizzle ORM**

### Forms and validation

- **Zod**
- **React Hook Form**

### Data visualization

- **Recharts**

### Import

- **xlsx**

### Testing and quality

- **Vitest**
- **TypeScript typecheck**

### Tooling

- **pnpm**
- **tsx**
- **Drizzle Kit**

---

## 🏗️ Arquitetura / Architecture

The project uses Next.js App Router and organizes the main product area inside a workspace route group.

The architecture separates:

- interface;
- domain rules;
- persistence;
- utilities;
- business services;
- import and maintenance scripts.

```txt
app/
components/
features/
services/
db/
lib/
scripts/
tests/
```

### Camadas / Layers

| Layer | Responsibility |
|---|---|
| `app/` | Routes, layouts, pages and App Router flows |
| `components/` | UI components, charts, forms and reusable blocks |
| `features/` | Screen-specific flows and mutation actions |
| `services/` | Financial domain logic, aggregations and data maintenance |
| `db/` | Schema, migrations and SQLite/Drizzle integration |
| `lib/` | Date helpers, formatters and shared utilities |
| `scripts/` | Operational scripts for migration, seed and maintenance |
| `tests/` | Domain and reliability tests |

The general idea is to keep financial rules outside the visual layer whenever possible.

---

<a id="banco-e-backup--database-and-backup"></a>

## 🗄️ Banco e backup / Database and backup

The main local SQLite database is stored by default at:

```txt
data/aurea-finance.sqlite
```

### Migrate database / Migrar banco

```bash
pnpm dbmigrate
```

### Seed database / Popular base

```bash
pnpm dbseed
```

### Manual backup

#### PowerShell

```powershell
New-Item -ItemType Directory -Force .\backups | Out-Null
Copy-Item .\data\aurea-finance.sqlite .\backups\aurea-finance-$(Get-Date -Format yyyyMMdd-HHmmss).sqlite
```

#### Bash

```bash
mkdir -p ./backups
cp ./data/aurea-finance.sqlite ./backups/aurea-finance-$(date +%Y%m%d-%H%M%S).sqlite
```

### Restore

Stop the development server before restoring to avoid write conflicts.

#### PowerShell

```powershell
Copy-Item .\backups\aurea-finance-YYYYMMDD-HHMMSS.sqlite .\data\aurea-finance.sqlite -Force
```

#### Bash

```bash
cp ./backups/aurea-finance-YYYYMMDD-HHMMSS.sqlite ./data/aurea-finance.sqlite
```

---

<a id="quick-start--início-rápido"></a>

## 🚀 Quick Start / Início rápido

### Requirements / Requisitos

- Node.js 20+
- pnpm
- Read/write access to the `data/` directory
- Environment compatible with TypeScript scripts through Node

### Installation / Instalação

```bash
corepack enable
corepack prepare pnpm@10.6.1 --activate
pnpm install
pnpm approve-builds
```

### Run locally / Rodar localmente

```bash
pnpm dbmigrate
pnpm dbseed
pnpm dev
```

### Production build / Build de produção

```bash
pnpm build
```

---

## ⚙️ Useful commands / Comandos úteis

| Command | Purpose |
|---|---|
| `pnpm install` | Install dependencies |
| `pnpm approve-builds` | Approve dependency build scripts when needed |
| `pnpm dbmigrate` | Apply database migrations |
| `pnpm dbseed` | Populate database with seed |
| `pnpm typecheck` | Run TypeScript checks |
| `pnpm test` | Run test suite |
| `pnpm build` | Generate production build |
| `pnpm dev` | Start local development |
| `cp` / `Copy-Item` | Manual SQLite backup and restore |

---

## ✅ Recommended daily workflow / Fluxo recomendado

1. Open **Daily Reconciliation**.
2. Save real balances from relevant accounts.
3. Update assets and net worth positions.
4. Register expenses and income.
5. Review divergences.
6. Then check dashboard, future view and net worth.

This flow prevents a common mistake: treating projection as reality.

---

## 📥 Import workflow / Fluxo de importação

Import exists to accelerate adoption and migration from legacy spreadsheets.

It should:

- read workbook or spreadsheet data;
- suggest column mapping;
- allow review and adjustment before commit;
- transform legacy data into operational system data.

Important points:

- import is not irreversible;
- account, category, asset, card and institution may require later review;
- imported data remains correctable through the UI;
- post-import review is part of the normal product flow.

---

## 🧪 Tests and quality / Testes e qualidade

Recommended local checks:

```bash
pnpm typecheck
pnpm test
pnpm build
```

Domain tests are especially important in areas such as:

- recurrences;
- invoice competence;
- installments;
- due dates;
- event materialization;
- import mapping;
- coherence between calculation and projection.

In Aurea Finance, domain tests are not decoration. They protect financial rules that directly affect product trust.

---

## ⚡ Performance notes / Observações de performance

Performance is an ongoing concern, especially on pages that:

- aggregate large amounts of data;
- recalculate projections;
- render heavier charts;
- consolidate accounts, net worth and recurrences.

Typical improvement areas:

- reducing redundant aggregations;
- optimizing queries and repeated reads;
- lazy loading heavier blocks;
- improving perceived navigation speed;
- refining chart and dashboard rendering.

---

## 🗺️ Roadmap

Short and medium-term evolution:

- improve navigation and critical aggregation performance;
- deepen monthly closing flow;
- strengthen financial domain tests;
- improve post-import reconciliation and review;
- refine UX for reconciliation, recurrences and net worth;
- expand audit trail for sensitive operations.

---

## 🤝 Contributing / Contribuição

Contributions are welcome, especially around:

- financial domain correctness;
- operational usability;
- performance;
- test quality;
- technical documentation.

Recommended flow:

1. Open an issue with clear context.
2. Describe problem, impact and expected behavior.
3. Include reproduction steps when possible.
4. Propose small, verifiable PRs.
5. Preserve the project principles:
   - local-first operation;
   - data correctable through the UI;
   - reliability of financial rules.

---

<a id="autor--author"></a>

## 👤 Autor / Author

Developed by **Felipe Baruja**.

- **Portfolio:** [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- **GitHub:** [github.com/BarujaFe1](https://github.com/BarujaFe1)
- **LinkedIn:** [linkedin.com/in/barujafe](https://www.linkedin.com/in/barujafe/)

---

## 📄 License / Licença

MIT License.

See [LICENSE](./LICENSE) for details.

---

<div align="center">
  <p><strong>Aurea Finance</strong></p>
  <p>Finanças pessoais com controle local, conferência diária e dados corrigíveis.</p>
  <p><em>Personal finance with local control, daily reconciliation and correctable data.</em></p>
</div>
