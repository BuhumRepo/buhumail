-- Simple insert for test domain (doesn't require existing users)
DELETE FROM domains WHERE domain = 'buhumail.xyz';

-- Insert with a placeholder user_id (will be visible to all users via is_system_domain flag)
INSERT INTO domains (
  id,
  user_id,
  domain,
  verified,
  is_system_domain,
  dns_records,
  created_at
) VALUES (
  'system-test-domain-001',
  'system-user',
  'buhumail.xyz',
  1,
  1,
  '[]',
  1762132819000
);
