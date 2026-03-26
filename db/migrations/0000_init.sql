CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  type TEXT NOT NULL,
  institution TEXT DEFAULT '',
  opening_balance_cents INTEGER NOT NULL DEFAULT 0,
  color TEXT DEFAULT '#5b7cfa',
  notes TEXT DEFAULT '',
  include_in_net_worth INTEGER NOT NULL DEFAULT 1,
  is_archived INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS accounts_slug_unique ON accounts(slug);

CREATE TABLE IF NOT EXISTS account_balance_snapshots (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL,
  snapshot_date TEXT NOT NULL,
  balance_cents INTEGER NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS account_balance_snapshots_account_date_unique ON account_balance_snapshots(account_id, snapshot_date);

CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'expense',
  color TEXT DEFAULT '#7c83ff',
  icon TEXT DEFAULT 'circle',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_unique ON categories(slug);

CREATE TABLE IF NOT EXISTS subcategories (
  id TEXT PRIMARY KEY NOT NULL,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT DEFAULT '#8f96ff',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS subcategories_slug_unique ON subcategories(category_id, slug);

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  color TEXT DEFAULT '#9498a4',
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS tags_slug_unique ON tags(slug);

CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT,
  category_id TEXT,
  subcategory_id TEXT,
  transfer_id TEXT,
  recurring_occurrence_id TEXT,
  source_import_row_id TEXT,
  direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'posted',
  description TEXT NOT NULL,
  counterparty TEXT DEFAULT '',
  amount_cents INTEGER NOT NULL,
  occurred_on TEXT NOT NULL,
  due_on TEXT,
  competence_month TEXT NOT NULL,
  notes TEXT DEFAULT '',
  is_projected INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS transactions_account_idx ON transactions(account_id);
CREATE INDEX IF NOT EXISTS transactions_occurred_on_idx ON transactions(occurred_on);
CREATE INDEX IF NOT EXISTS transactions_competence_month_idx ON transactions(competence_month);

CREATE TABLE IF NOT EXISTS transaction_tags (
  transaction_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS transaction_tags_unique ON transaction_tags(transaction_id, tag_id);

CREATE TABLE IF NOT EXISTS transfers (
  id TEXT PRIMARY KEY NOT NULL,
  from_account_id TEXT NOT NULL,
  to_account_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  occurred_on TEXT NOT NULL,
  notes TEXT DEFAULT '',
  out_transaction_id TEXT,
  in_transaction_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS recurring_rules (
  id TEXT PRIMARY KEY NOT NULL,
  account_id TEXT NOT NULL,
  category_id TEXT,
  title TEXT NOT NULL,
  direction TEXT NOT NULL,
  frequency TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  starts_on TEXT NOT NULL,
  ends_on TEXT,
  next_run_on TEXT NOT NULL,
  auto_post INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS recurring_occurrences (
  id TEXT PRIMARY KEY NOT NULL,
  rule_id TEXT NOT NULL,
  due_on TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  transaction_id TEXT,
  notes TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (rule_id) REFERENCES recurring_rules(id) ON DELETE CASCADE,
  FOREIGN KEY (transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS recurring_occurrences_rule_due_unique ON recurring_occurrences(rule_id, due_on);

CREATE TABLE IF NOT EXISTS credit_cards (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  brand TEXT DEFAULT '',
  network TEXT DEFAULT '',
  settlement_account_id TEXT NOT NULL,
  limit_total_cents INTEGER NOT NULL,
  close_day INTEGER NOT NULL,
  due_day INTEGER NOT NULL,
  color TEXT DEFAULT '#111827',
  is_archived INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (settlement_account_id) REFERENCES accounts(id) ON DELETE RESTRICT
);
CREATE UNIQUE INDEX IF NOT EXISTS credit_cards_slug_unique ON credit_cards(slug);

CREATE TABLE IF NOT EXISTS credit_card_bills (
  id TEXT PRIMARY KEY NOT NULL,
  credit_card_id TEXT NOT NULL,
  bill_month TEXT NOT NULL,
  closes_on TEXT NOT NULL,
  due_on TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL DEFAULT 0,
  paid_amount_cents INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open',
  settlement_transaction_id TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (settlement_transaction_id) REFERENCES transactions(id) ON DELETE SET NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS credit_card_bills_card_month_unique ON credit_card_bills(credit_card_id, bill_month);

CREATE TABLE IF NOT EXISTS card_purchases (
  id TEXT PRIMARY KEY NOT NULL,
  credit_card_id TEXT NOT NULL,
  category_id TEXT,
  subcategory_id TEXT,
  first_bill_id TEXT,
  description TEXT NOT NULL,
  merchant TEXT DEFAULT '',
  purchase_date TEXT NOT NULL,
  total_amount_cents INTEGER NOT NULL,
  installment_count INTEGER NOT NULL DEFAULT 1,
  notes TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
  FOREIGN KEY (subcategory_id) REFERENCES subcategories(id) ON DELETE SET NULL,
  FOREIGN KEY (first_bill_id) REFERENCES credit_card_bills(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS card_installments (
  id TEXT PRIMARY KEY NOT NULL,
  purchase_id TEXT NOT NULL,
  bill_id TEXT NOT NULL,
  installment_number INTEGER NOT NULL,
  total_installments INTEGER NOT NULL,
  amount_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'billed',
  due_on TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (purchase_id) REFERENCES card_purchases(id) ON DELETE CASCADE,
  FOREIGN KEY (bill_id) REFERENCES credit_card_bills(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS card_installments_purchase_number_unique ON card_installments(purchase_id, installment_number);

CREATE TABLE IF NOT EXISTS bill_entries (
  id TEXT PRIMARY KEY NOT NULL,
  bill_id TEXT NOT NULL,
  entry_type TEXT NOT NULL,
  description TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  purchase_id TEXT,
  installment_id TEXT,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (bill_id) REFERENCES credit_card_bills(id) ON DELETE CASCADE,
  FOREIGN KEY (purchase_id) REFERENCES card_purchases(id) ON DELETE SET NULL,
  FOREIGN KEY (installment_id) REFERENCES card_installments(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS reminders (
  id TEXT PRIMARY KEY NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  title TEXT NOT NULL,
  remind_on TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS import_batches (
  id TEXT PRIMARY KEY NOT NULL,
  filename TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  workbook_summary_json TEXT NOT NULL DEFAULT '{}',
  dry_run_report_json TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS import_raw_rows (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  row_number INTEGER NOT NULL,
  row_hash TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  validation_status TEXT NOT NULL DEFAULT 'pending',
  created_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS import_mappings (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  sheet_name TEXT NOT NULL,
  target_entity TEXT NOT NULL,
  column_map_json TEXT NOT NULL,
  options_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS import_mappings_batch_sheet_unique ON import_mappings(batch_id, sheet_name);

CREATE TABLE IF NOT EXISTS import_issues (
  id TEXT PRIMARY KEY NOT NULL,
  batch_id TEXT NOT NULL,
  raw_row_id TEXT,
  sheet_name TEXT NOT NULL,
  severity TEXT NOT NULL,
  issue_code TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (batch_id) REFERENCES import_batches(id) ON DELETE CASCADE,
  FOREIGN KEY (raw_row_id) REFERENCES import_raw_rows(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS monthly_closings (
  id TEXT PRIMARY KEY NOT NULL,
  month TEXT NOT NULL,
  opening_balance_cents INTEGER NOT NULL,
  incomes_cents INTEGER NOT NULL,
  expenses_cents INTEGER NOT NULL,
  transfers_net_cents INTEGER NOT NULL,
  projected_bill_payments_cents INTEGER NOT NULL,
  closing_balance_cents INTEGER NOT NULL,
  projected_free_cash_cents INTEGER NOT NULL,
  notes TEXT DEFAULT '',
  snapshot_json TEXT NOT NULL DEFAULT '{}',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS monthly_closings_month_unique ON monthly_closings(month);

CREATE TABLE IF NOT EXISTS net_worth_summaries (
  id TEXT PRIMARY KEY NOT NULL,
  month TEXT NOT NULL,
  reserves_cents INTEGER NOT NULL DEFAULT 0,
  investments_cents INTEGER NOT NULL DEFAULT 0,
  debts_cents INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  source TEXT NOT NULL DEFAULT 'manual',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS net_worth_summaries_month_unique ON net_worth_summaries(month);

CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY NOT NULL,
  base_currency TEXT NOT NULL DEFAULT 'BRL',
  theme_preference TEXT NOT NULL DEFAULT 'system',
  user_display_name TEXT NOT NULL DEFAULT 'Você',
  is_onboarded INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
