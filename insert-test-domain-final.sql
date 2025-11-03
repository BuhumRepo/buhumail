-- Insert test domain using existing user, but marked as system domain (visible to everyone)
DELETE FROM domains WHERE domain = 'buhumail.xyz';

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
  'fd0acd37-7c96-44ec-84f0-1754da010789',
  'buhumail.xyz',
  1,
  1,
  '[]',
  1762133100000
);
