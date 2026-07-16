<div align="center">
  <img src="./icon.png" alt="Aurea Finance Logo" width="120" height="120" />

  <h1>Aurea Finance</h1>

  <p><strong>OS financeiro pessoal local-first: conferência diária, orçamento, cartões, patrimônio e importação Money.xlsx.</strong></p>
  <p><strong>Local-first personal finance OS: daily reconciliation, budgeting, cards, net worth and Money.xlsx import.</strong></p>

  <p>
    <a href="#pt-br">PT-BR</a>
     · 
    <a href="#english">English</a>
     · 
    <a href="#stack">Stack</a>
     · 
    <a href="#architecture">Architecture</a>
     · 
    <a href="#quick-start">Quick Start</a>
     · 
    <a href="#author">Author</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" />
    <img alt="SQLite" src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
    <img alt="Drizzle" src="https://img.shields.io/badge/Drizzle-C5F74F?style=for-the-badge" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="Status-Local-first" src="https://img.shields.io/badge/Status-Local-first-2563EB?style=for-the-badge" />
    <img alt="License-MIT" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" />
  </p>

  <p>
    <a href="https://github.com/BarujaFe1/AureaFinance"><strong>Repo</strong></a>
     · 
    <a href="https://barujafe.vercel.app/"><strong>Portfolio</strong></a>
     · 
    <a href="https://www.linkedin.com/in/barujafe/"><strong>LinkedIn</strong></a>
  </p>
</div>


> **Local-first notice:** no public Vercel homepage is configured for this repo. Run locally with SQLite. Screenshots below show the product UI from `assets/`.

---

## PT-BR

### Visão geral
O **Aurea Finance** é um sistema financeiro pessoal local-first (Next.js + SQLite/Drizzle): dashboard, conferência diária, transações, contas, cartões/faturas, recorrências, orçamento, patrimônio e importação a partir de **Money.xlsx**.

### Problema
Planilhas crescem, cartões e contas se espalham e a conferência diária vira caos — sem um OS pessoal coerente.

### Para quem
Pessoas que querem operar finanças pessoais com disciplina de **conferência** e patrimônio, preferindo dados locais.

### Funcionalidades
- Dashboard financeiro
- Conferência diária
- Transações, contas e liquidez
- Cartões/faturas, recorrências e orçamento mensal
- Patrimônio (net worth)
- Importação Money.xlsx (`xlsx`)
- Testes (Vitest) no domínio

### Escopo e limites (honestos)
- **Local-first** — não é open banking multi-banco cloud
- Sem demo pública estável no campo homepage do GitHub
- Importação cobre o workbook/fluxo documentado — valide no seu arquivo real

---

## English

### Overview
**Aurea Finance** is a local-first personal finance OS (Next.js + SQLite/Drizzle): dashboard, daily reconciliation, transactions, accounts, cards/statements, recurrals, budgeting, net worth and **Money.xlsx** import.

### Problem
Spreadsheets sprawl, cards/accounts fragment and daily reconciliation becomes chaos — without a coherent personal OS.

### Who it is for
Individuals who want disciplined **reconciliation** and net-worth tracking with local data preference.

### Features
- Finance dashboard
- Daily reconciliation
- Transactions, accounts and liquidity
- Cards/statements, recurrals and monthly budget
- Net worth
- Money.xlsx import (`xlsx`)
- Domain tests (Vitest)

### Scope and honest limits
- **Local-first** — not cloud open-banking
- No stable public demo in the GitHub homepage field
- Import covers the documented workbook flow — validate on your real file

---

## Screenshots

<table>
  <tr>
    <td width="50%"><img src="./assets/screenshots/01-dashboard.png" alt="Dashboard" /><br /><sub><strong>Dashboard</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/02-daily.png" alt="Daily reconciliation" /><br /><sub><strong>Daily reconciliation</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/03-transactions.png" alt="Transactions" /><br /><sub><strong>Transactions</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/04-accounts.png" alt="Accounts" /><br /><sub><strong>Accounts</strong></sub></td>
  </tr>
  <tr>
    <td width="50%"><img src="./assets/screenshots/05-net-worth.png" alt="Net worth" /><br /><sub><strong>Net worth</strong></sub></td>
    <td width="50%"><img src="./assets/screenshots/06-import.png" alt="Import" /><br /><sub><strong>Import</strong></sub></td>
  </tr>
</table>



## Stack

| Layer | Technology |
|---|---|
| Web | Next.js, React, TypeScript, Tailwind, Recharts |
| Data | SQLite (`better-sqlite3`), Drizzle ORM, Zod |
| Import | SheetJS (`xlsx`) |

---

## Architecture

```txt
app/ features/ components/   UI
db/ sql/ drizzle             schema + migrations mindset
services/ lib/               domain services
assets/screenshots           UI evidence
```

---

## Quick Start

```bash
npm install
# configure env from .env.example / env.example
npm run dev
```

Follow in-repo notes for DB seed/migrate scripts under `scripts/` and `DATABASE_NOTES.md`.

---

## Technical decisions

- **SQLite local-first** for privacy and offline operation
- **Drizzle** for typed schema close to SQL
- **Daily reconciliation** as a first-class workflow, not only charts

---

## Roadmap

- Polish import edge cases
- More budget/net-worth analytics
- Optional encrypted backup export

---

## Author

**Felipe Alirio Baruja** — data / product / full-stack portfolio.

- Portfolio: [https://barujafe.vercel.app/](https://barujafe.vercel.app/)
- GitHub: [https://github.com/BarujaFe1](https://github.com/BarujaFe1)
- LinkedIn: [https://www.linkedin.com/in/barujafe/](https://www.linkedin.com/in/barujafe/)


## License

MIT — see [`LICENSE`](./LICENSE).
