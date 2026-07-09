# Interview Preparation — Aurea Finance

## 1. Project Overview

**Aurea Finance** is a local-first personal finance web application that replaces operational spreadsheets with a structured, auditable, and editable system. Built with Next.js 15, React 19, SQLite, and Drizzle ORM.

**Key differentiator:** prioritizes data correctability through the UI over full automation, keeping the user in control.

---

## 2. Architecture Decisions

### Local-first with SQLite

**Why not PostgreSQL/MongoDB/a cloud database?**
- Zero infrastructure cost for a personal tool
- Database is a single file — backup is `cp`, restore is `cp`
- No network latency, no service dependencies
- Full data privacy by default
- Predictable behavior — no "it works on my machine" with remote state

**Trade-off:** No built-in replication or multi-device sync. This is intentional — the product is designed for one user, one machine.

### Drizzle ORM over Prisma / Knex / raw SQL

**Why Drizzle?**
- SQL-like syntax with type safety — `db.select().from(transactions).where(eq(transactions.id, id)).get()` instead of magic strings
- Lightweight — no code generation step, no client binary
- Drizzle Kit for migrations (generate, push, introspect)
- Better-sqlite3 integration is first-class and synchronous — simpler mental model than async SQLite

### Integers for Money (Cents)

**Why not DECIMAL / float / string?**
- Avoids floating-point rounding errors in JS: `0.1 + 0.2 !== 0.3`
- Integer arithmetic is trivial to reason about
- Division with remainder handles installment splitting correctly
- `formatCurrencyFromCents(x / 100)` handles display; `parseCurrencyToCents(input * 100)` handles input

### Server Actions over API Routes

**Why?**
- Next.js server actions eliminate boilerplate — no route handler, no fetch call, no JSON serialization
- Form-centric: `<form action={serverAction}>` maps naturally to the data-mutation patterns used
- Revalidation is explicit: `revalidatePath()` after each mutation
- Type-safe: the action function and the form share TypeScript types

**Pattern used in every feature:**

```ts
// features/accounts/actions.ts
"use server";
export async function saveAccountBalanceSnapshotAction(formData: FormData) {
  upsertAccountBalanceSnapshot(/* parsed data */);
  revalidatePath("/accounts");
  revalidatePath("/daily");
}
```

```tsx
// In page component
<form action={saveAccountBalanceSnapshotAction}>
  <input type="hidden" name="accountId" value={account.id} />
  <Button type="submit">Salvar</Button>
</form>
```

### Three-Balance Model

The system tracks three distinct balance values for every account:

| Balance | Meaning | Source |
|---|---|---|
| **Calculated** | Sum of opening balance + all transactions | Computed from `transactions` table |
| **Checked** | Manually entered real balance | `account_balance_snapshots` table |
| **Projected** | Calculated + future scheduled events | Computed from transactions + recurring + bills |

This prevents a common personal finance error: treating projection as reality.

---

## 3. Audit and Improvement Process

The project was audited and improved in 7 rounds, each 1–3 hours:

### Round 1 — Structural Audit
- Mapped all 18 tables, 5 migrations, dependencies
- Identified typecheck failures, untested domain logic, and operational risks
- Discovered `executeSql` runtime schema creation alongside migrations — schema drift risk flagged

### Round 2 — Domain Tests
- Wrote 58 new tests across 6 new test files: `balance.test.ts`, `dates.test.ts`, `finance.spec.ts`, `import-mapping.test.ts`, `import-validation.test.ts`, `recurrence.test.ts`
- Focused on pure functions in `lib/domain/` — zero infrastructure, maximum ROI
- Test count grew from 17 to 75

### Round 3 — Asset Position Bugfix
- `upsertAssetPosition` had separate code paths for reserve/stock/crypto
- Each path checked existence differently (some by ID, some by name)
- Standardized all three paths to check by ID first, fall back to name match, then create

### Round 4 — Transactional Import
- `commitBatch()` ran 20+ INSERT/UPDATE statements outside a transaction
- **Risk:** partial batch commit on failure could leave orphan rows or inconsistent state
- **Fix:** wrapped entire operation in `sqlite.transaction()` — atomic rollback on any error

### Round 5 — UX for Destructive Actions
- Created reusable `<ConfirmDialog>` (native `<dialog>` modal) + `<ConfirmForm>` wrapper
- Applied confirmation to 14 destructive actions across 6 pages
- Added undo for daily net worth snapshot (`deleteDailyNetWorthSnapshot`)

### Round 6 — Documentation
- README: test badge, before/after metrics, screenshot placeholders, project evolution timeline

### Round 7 — Interview Materials (this document)

---

## 4. Technical Challenges & Solutions

### Challenge: TypeScript JSX Compatibility (Round 1)
**Problem:** Components returning `React.FC` or `ReactElement` from shadcn/ui templates caused `TS2786` errors across the entire app in React 19.

**Solution:** Rewrote all UI primitives (`Card`, `Button`, `Input`, `Select`, `Label`, `Badge`) to return explicit `JSX.Element` with properly typed props.

### Challenge: Server Actions + Client Confirmation (Round 2)
**Problem:** All forms use server actions in Server Components. Adding a confirmation dialog requires client-side intercept, but the form's `onSubmit` handler and server action interaction is non-obvious.

**Solution:** Created a `<ConfirmForm>` client component that:
1. Intercepts the form's `onSubmit`, prevents default, opens dialog
2. On confirm, calls `requestSubmit()` with a ref guard (`skipNextSubmit`) to bypass the intercept
3. The second `onSubmit` call (triggered by `requestSubmit()`) sees `skipNextSubmit=true` and lets the server action proceed

### Challenge: better-sqlite3 Native Compilation (Environment)
**Problem:** Node 24.18.0 had no prebuilt binary for `better-sqlite3@^11.8.1`. Native compilation from source failed.

**Solution:** Upgraded to `better-sqlite3@12.11.1` which ships prebuilt binaries for Node 24 (modules version `137`).

### Challenge: PowerShell Execution Policy (Environment)
**Problem:** `pnpm` and `npm` scripts failed because `.ps1` extension was blocked by execution policy.

**Solution:** Used `node.exe "C:\Program Files\nodejs\node_modules\corepack\dist\pnpm.js"` directly, bypassing the `.ps1` launcher.

---

## 5. Schema Design Highlights

### 18 Tables, Modular by Domain

| Domain | Tables |
|---|---|
| Core | `accounts`, `transactions`, `categories` |
| Recurring | `recurring_rules`, `recurring_occurrences` |
| Credit | `credit_cards`, `credit_card_purchases`, `credit_card_installments`, `credit_card_bills` |
| Net Worth | `net_worth_summaries`, `net_worth_snapshots`, `reserves`, `stock_positions`, `crypto_positions`, `asset_value_snapshots` |
| Import | `import_batches`, `import_batch_mappings`, `import_batch_rows` |

### Key Constraints
- `net_worth_snapshots.date` has a `unique index` — one snapshot per day
- `account_balance_snapshots` uses application-level dedup (same account + same date = upsert)
- Transactions reference `import_batch_rows` via `sourceImportRowId` — every imported row is traceable back to its origin

### Runtime Schema Concern
`ensureRuntimeSchema()` in `db/client.ts` creates tables outside migrations via `executeSql`. This is pragmatic for development but creates a schema drift risk — the migration history no longer represents the full schema state.

---

## 6. Testing Strategy

### Philosophy
- Pure domain functions in `lib/domain/` get the most tests — they have zero infrastructure dependencies and protect the core financial logic
- Integration tests exist where needed (import pipeline, service layer)
- No test for UI components yet — the domain logic is where the financial correctness risk lives

### Coverage

| File | Tests | What it covers |
|---|---|---|
| `finance.spec.ts` | 21 | Balance calculation, installments, recurrence materialization, month closing, credit card bill month, installment label parsing |
| `import-validation.test.ts` | 14 | Row validation, batch meta normalization, dry-run report normalization |
| `import-mapping.test.ts` | 12 | Sheet type detection, column suggestion, confidence scoring |
| `dates.test.ts` | 11 | isoDate, isoMonth, startOfMonth, endOfMonth, addMonths, addDays, withDayOfMonth |
| `recurrence.test.ts` | 7 | Monthly/weekly/quarterly generation, day-of-month adjustment, months-ahead limit |
| `balance.test.ts` | 6 | Realized vs projected balance, empty/pending edge cases, cash flow summary |
| `money.test.ts` | 3 | Currency parsing, installment splitting, formatting |
| `installments.test.ts` | 1 | Future installment generation with bill month |

**Total: 75 tests, all passing.**

---

## 7. Code Patterns

### File Organization

```
app/              Next.js App Router pages and layouts
components/       UI components (shadcn-style primitives + custom)
features/         Feature-specific server actions
services/         Business logic, data aggregation, persistence
db/               Schema, migrations, client setup
lib/              Pure functions (domain, currency, dates, formatters, utils)
tests/            Vitest test files
```

### Dependency Flow

```
Pages (app/) → Actions (features/) → Services (services/) → DB (db/)
Pages (app/) → UI Components (components/)
Services → Domain (lib/) + DB (db/)
```

No circular dependencies. Pages never import services directly — they go through actions.

### Server Action Pattern

```ts
// 1. Action file (features/X/actions.ts)
"use server";
export async function someAction(formData: FormData) {
  const parsed = schema.parse({ /* extract from formData */ });
  serviceFunction(parsed);
  revalidatePath("/some-path");
}

// 2. Page (app/(workspace)/some-path/page.tsx)
export default function Page() {
  const data = someService.list();  // synchronous SQLite call
  return <form action={someAction}>
    <input type="hidden" name="id" value={data.id} />
    <Button type="submit">Action</Button>
  </form>;
}
```

### Confirmation Pattern

```tsx
import { ConfirmForm } from "@/components/confirm-form";

<ConfirmForm
  action={deleteAction}
  message="Delete this permanently?"
  confirmLabel="Yes, delete"
>
  <input type="hidden" name="id" value={item.id} />
  <Button type="submit">Delete</Button>
</ConfirmForm>
```

---

## 8. Talking Points for Interviews

### For Frontend/Full-Stack roles

- **"Tell me about a project where you made architectural decisions."**
  → Discuss local-first vs cloud, why SQLite, why Drizzle ORM, the three-balance model, and how server actions simplify data mutation.

- **"How do you handle data integrity in a local-first system?"**
  → Integer cents, transaction wrapping for batch operations, explicit revalidation after mutations, separate calculated/checked/projected balances.

- **"How did you improve test coverage on an existing project?"**
  → 17 → 75 tests by focusing on pure domain functions with zero infrastructure dependencies. Prioritize financial logic over UI tests.

- **"Tell me about a challenging bug you solved."**
  → The `better-sqlite3` native compilation issue on Node 24, or the three-way upsert in `upsertAssetPosition` that had different behavior per asset type.

### For Backend/Systems roles

- **"How do you handle database migrations in a local-first app?"**
  → Drizzle Kit generates SQL from schema changes. Five migrations applied. But there's also `ensureRuntimeSchema()` which creates tables dynamically — a schema drift risk I identified and flagged.

- **"What's your approach to data correctness in financial systems?"**
  → Integer cents, transaction wrapping, three separate balance views (calculated, checked, projected), explicit audit trail via `sourceImportRowId`.

- **"How would you add sync to this local-first system?"**
  → Options: SQLite replication (Litestream, rqlite), CRDT-based sync (Automerge, Yjs), or operation log replays. Trade-offs between complexity and user needs.

### For Product/Engineering Manager roles

- **"How did you prioritize improvements?"**
  → Audit first (identify risks), then fix failing builds (typecheck), then protect domain logic (tests), then batch operations (transactions), then UX (confirmations), then documentation. Each round was 1-3 hours and independently deployable.

- **"How do you balance pragmatism and correctness?"**
  → The `ensureRuntimeSchema()` is pragmatic for fast iteration, but flagged as a future risk. Added tests to core logic but not to UI. Confirmation dialogs use native `<dialog>` instead of installing a library. Each decision has a documented trade-off.

---

## 9. Key Metrics

| Metric | Value |
|---|---|
| Test count | 75 (from 17) |
| Test files | 8 (from 6) |
| Typecheck errors | 0 |
| Build | Compiles, 22 static pages |
| Database tables | 18 |
| Migrations | 5 |
| Stack | Next.js 15, React 19, SQLite, Drizzle, Tailwind 4, TypeScript 5 |
| Lines of code | ~10,000+ across app, components, features, services, lib |
