-- TEASys D1 Schema
-- Apply with: wrangler d1 execute teasys-db --remote --file=schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    UNIQUE NOT NULL,
  password_hash TEXT    NOT NULL,
  role          TEXT    NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at    TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT    PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT    NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS texts (
  id         TEXT    PRIMARY KEY,
  title      TEXT    NOT NULL,
  author     TEXT    NOT NULL,
  year       INTEGER,
  category   TEXT    NOT NULL DEFAULT '',
  type       TEXT    NOT NULL CHECK (type IN ('poetry','prose','drama','collection')),
  parent_id  TEXT    REFERENCES texts(id) ON DELETE SET NULL,
  sort_order INTEGER,
  raw_text   TEXT    NOT NULL DEFAULT '',
  tei_xml    TEXT,
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_texts_author ON texts(author);
CREATE INDEX IF NOT EXISTS idx_texts_type   ON texts(type);

CREATE TABLE IF NOT EXISTS annotations (
  id           TEXT    NOT NULL,
  text_id      TEXT    NOT NULL REFERENCES texts(id) ON DELETE CASCADE,
  anchor_text  TEXT    NOT NULL,
  anchor_start INTEGER NOT NULL,
  anchor_end   INTEGER NOT NULL,
  authors      TEXT    NOT NULL DEFAULT '[]',
  version      INTEGER NOT NULL DEFAULT 1,
  levels       TEXT    NOT NULL DEFAULT '[]',
  cross_refs   TEXT    NOT NULL DEFAULT '[]',
  created_at   TEXT    NOT NULL,
  updated_at   TEXT    NOT NULL,
  PRIMARY KEY (id, text_id)
);
CREATE INDEX IF NOT EXISTS idx_annotations_text ON annotations(text_id);

CREATE TABLE IF NOT EXISTS authors (
  slug             TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  bio_md           TEXT NOT NULL DEFAULT '',
  birth_year       INTEGER,
  death_year       INTEGER,
  photo_credit     TEXT,
  photo_credit_url TEXT,
  portrait_key     TEXT
);

CREATE TABLE IF NOT EXISTS pages (
  id         TEXT    PRIMARY KEY,
  title      TEXT    NOT NULL,
  content_md TEXT    NOT NULL DEFAULT '',
  menu       INTEGER NOT NULL DEFAULT 1,
  parent     TEXT,
  created_at TEXT    NOT NULL,
  updated_at TEXT    NOT NULL
);
