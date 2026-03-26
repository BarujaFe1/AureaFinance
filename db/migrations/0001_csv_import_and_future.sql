ALTER TABLE card_purchases ADD COLUMN purchase_type TEXT NOT NULL DEFAULT 'parcelado';
ALTER TABLE card_purchases ADD COLUMN responsible TEXT DEFAULT '';

CREATE TABLE IF NOT EXISTS reserves (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_value_cents INTEGER NOT NULL DEFAULT 0,
  current_value_cents INTEGER NOT NULL DEFAULT 0,
  total_profit_cents INTEGER NOT NULL DEFAULT 0,
  yield_total_percent REAL,
  monthly_profit_cents INTEGER NOT NULL DEFAULT 0,
  yield_monthly_percent REAL,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS reserves_name_unique ON reserves(name);

CREATE TABLE IF NOT EXISTS stock_positions (
  id TEXT PRIMARY KEY,
  ticker TEXT NOT NULL,
  full_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_cents INTEGER NOT NULL DEFAULT 0,
  current_cents INTEGER NOT NULL DEFAULT 0,
  result_total_cents INTEGER NOT NULL DEFAULT 0,
  rentability_total_percent REAL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS stock_positions_ticker_unique ON stock_positions(ticker);

CREATE TABLE IF NOT EXISTS crypto_positions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 0,
  invested_cents INTEGER NOT NULL DEFAULT 0,
  previous_cents INTEGER NOT NULL DEFAULT 0,
  current_cents INTEGER NOT NULL DEFAULT 0,
  total_profit_cents INTEGER NOT NULL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS crypto_positions_name_unique ON crypto_positions(name);

CREATE TABLE IF NOT EXISTS asset_trades (
  id TEXT PRIMARY KEY,
  action TEXT NOT NULL,
  asset_name TEXT NOT NULL,
  quantity REAL NOT NULL,
  trade_date TEXT NOT NULL,
  total_initial_cents INTEGER NOT NULL DEFAULT 0,
  price_per_unit_initial_cents INTEGER NOT NULL DEFAULT 0,
  total_current_cents INTEGER NOT NULL DEFAULT 0,
  price_per_unit_current_cents INTEGER NOT NULL DEFAULT 0,
  yield_percent REAL,
  description_text TEXT DEFAULT '',
  is_completed INTEGER NOT NULL DEFAULT 1,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS asset_trades_trade_date_idx ON asset_trades(trade_date);

CREATE TABLE IF NOT EXISTS net_worth_snapshots (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  account_balance_cents INTEGER NOT NULL DEFAULT 0,
  investment_1_cents INTEGER NOT NULL DEFAULT 0,
  investment_2_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,
  variation_type TEXT DEFAULT '',
  created_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS net_worth_snapshots_date_unique ON net_worth_snapshots(date);
