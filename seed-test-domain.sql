-- Add is_system_domain column if it doesn't exist
ALTER TABLE domains ADD COLUMN is_system_domain INTEGER DEFAULT 0;

-- First, check if test domain exists and delete it to avoid duplicates
DELETE FROM domains WHERE domain = 'buhumail.xyz';

-- Insert the test domain (using first user as owner, but marked as system domain)
-- Note: You may need to adjust the user_id to match an existing user in your database
INSERT INTO domains (
  id,
  user_id,
  domain,
  verified,
  is_system_domain,
  dns_records,
  created_at
)
SELECT 
  'system-test-domain-001',
  (SELECT id FROM users LIMIT 1),
  'buhumail.xyz',
  1,
  1,
  '[]',
  1762131806027;