-- Update existing test domain to buhumail.xyz
-- First, delete the old test domain
DELETE FROM domains WHERE domain = 'buhumail.pages.dev' AND is_system_domain = 1;
DELETE FROM domains WHERE id = 'system-test-domain-001';

-- Insert the new test domain
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
