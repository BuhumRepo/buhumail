-- Migration: Add AI Email Shield columns to emails table
-- Run this with: npx wrangler d1 execute buhumail-db --remote --file=setup-ai-shield/migration.sql

-- Add security analysis columns to emails table
ALTER TABLE emails ADD COLUMN trust_score INTEGER DEFAULT 50;
ALTER TABLE emails ADD COLUMN security_category TEXT DEFAULT 'suspicious';
ALTER TABLE emails ADD COLUMN threats TEXT DEFAULT '[]';
ALTER TABLE emails ADD COLUMN analysis_details TEXT DEFAULT '{}';
ALTER TABLE emails ADD COLUMN analyzed_at TEXT;

-- Create index for faster security filtering
CREATE INDEX IF NOT EXISTS idx_emails_trust_score ON emails(trust_score);
CREATE INDEX IF NOT EXISTS idx_emails_security_category ON emails(security_category);
