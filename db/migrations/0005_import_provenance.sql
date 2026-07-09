ALTER TABLE transactions ADD COLUMN source_import_batch_id TEXT;
ALTER TABLE accounts ADD COLUMN source_import_batch_id TEXT;
ALTER TABLE credit_cards ADD COLUMN source_import_batch_id TEXT;
ALTER TABLE credit_card_bills ADD COLUMN source_import_batch_id TEXT;
ALTER TABLE net_worth_summaries ADD COLUMN source_import_batch_id TEXT;

CREATE INDEX IF NOT EXISTS transactions_source_import_batch_idx
  ON transactions(source_import_batch_id);
