-- Create complete database schema with AI Email Shield
-- Run this first if tables don't exist

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL
);

-- Emails table with AI Email Shield columns
CREATE TABLE IF NOT EXISTS emails (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  from_address TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  received_at TEXT NOT NULL,
  is_read INTEGER DEFAULT 0,
  trust_score INTEGER DEFAULT 50,
  security_category TEXT DEFAULT 'suspicious',
  threats TEXT DEFAULT '[]',
  analysis_details TEXT DEFAULT '{}',
  analyzed_at TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Notes table (for self-destructive notes feature)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_at TEXT,
  max_views INTEGER DEFAULT 1,
  current_views INTEGER DEFAULT 0,
  is_burned INTEGER DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_received_at ON emails(received_at);
CREATE INDEX IF NOT EXISTS idx_emails_trust_score ON emails(trust_score);
CREATE INDEX IF NOT EXISTS idx_emails_security_category ON emails(security_category);
CREATE INDEX IF NOT EXISTS idx_notes_user_id ON notes(user_id);
CREATE INDEX IF NOT EXISTS idx_notes_expires_at ON notes(expires_at);
