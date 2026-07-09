CREATE TABLE IF NOT EXISTS category_budgets (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  limit_cents INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS category_budgets_category_month_unique
  ON category_budgets(category_id, month);
