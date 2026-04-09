CREATE TABLE IF NOT EXISTS entity_archives (
  id TEXT PRIMARY KEY,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  reason TEXT DEFAULT '',
  metadata_json TEXT NOT NULL DEFAULT '{}',
  archived_at INTEGER NOT NULL,
  restored_at INTEGER,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS entity_archives_entity_unique
  ON entity_archives(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS entity_archives_type_idx
  ON entity_archives(entity_type);

CREATE TABLE IF NOT EXISTS asset_value_snapshots (
  id TEXT PRIMARY KEY,
  asset_type TEXT NOT NULL,
  asset_id TEXT,
  asset_label TEXT NOT NULL,
  snapshot_date TEXT NOT NULL,
  quantity REAL,
  value_cents INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE UNIQUE INDEX IF NOT EXISTS asset_value_snapshots_type_asset_date_unique
  ON asset_value_snapshots(asset_type, asset_id, snapshot_date);
CREATE INDEX IF NOT EXISTS asset_value_snapshots_snapshot_date_idx
  ON asset_value_snapshots(snapshot_date);
