-- Simple migration: Add AI Email Shield columns if they don't exist
-- This handles existing tables gracefully

-- Create emails table if it doesn't exist (with all columns)
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
  analyzed_at TEXT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_trust_score ON emails(trust_score);
CREATE INDEX IF NOT EXISTS idx_emails_security_category ON emails(security_category);
