-- Local single-installation storage. Foreign keys are enabled on every connection.
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'manufacturer', 'service'))
);
CREATE TABLE IF NOT EXISTS rfqs (
  id TEXT PRIMARY KEY,
  buyer_id TEXT NOT NULL REFERENCES organizations(id),
  recipient_id TEXT REFERENCES organizations(id),
  kind TEXT NOT NULL CHECK (kind IN ('goods', 'service')),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  rfq_id TEXT NOT NULL REFERENCES rfqs(id),
  sender_id TEXT NOT NULL REFERENCES organizations(id),
  body TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  rfq_id TEXT NOT NULL REFERENCES rfqs(id),
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  amount_minor INTEGER NOT NULL DEFAULT 0 CHECK (amount_minor >= 0),
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending'
);
CREATE TABLE IF NOT EXISTS documents (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id),
  rfq_id TEXT REFERENCES rfqs(id),
  title TEXT NOT NULL,
  storage_path TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHECK (project_id IS NOT NULL OR rfq_id IS NOT NULL)
);
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  milestone_id TEXT REFERENCES milestones(id),
  paypal_order_id TEXT UNIQUE,
  paypal_capture_id TEXT UNIQUE,
  amount_minor INTEGER NOT NULL CHECK (amount_minor >= 0),
  currency TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS rfqs_recipient_idx ON rfqs(recipient_id);
CREATE INDEX IF NOT EXISTS messages_rfq_idx ON messages(rfq_id, created_at);
PRAGMA user_version = 1;
