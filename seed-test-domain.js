/**
 * Seed Script: Add buhumail.pages.dev as a test domain
 * 
 * This script adds a pre-verified test domain that all users can use
 * to create temporary emails without setting up their own domain.
 * 
 * Usage:
 *   node seed-test-domain.js
 * 
 * Or via Wrangler:
 *   npx wrangler d1 execute buhumail-db --local --command "INSERT INTO domains..."
 */

import { writeFileSync } from 'fs'

const TEST_DOMAIN = 'buhumail.xyz'

// SQL to insert the test domain
const seedSQL = `
-- Add is_system_domain column if it doesn't exist
ALTER TABLE domains ADD COLUMN is_system_domain INTEGER DEFAULT 0;

-- First, check if test domain exists and delete it to avoid duplicates
DELETE FROM domains WHERE domain = '${TEST_DOMAIN}';

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
  '${TEST_DOMAIN}',
  1,
  1,
  '[]',
  ${Date.now()};
`;

console.log('='.repeat(60))
console.log('📧 Buhumail Test Domain Seed Script')
console.log('='.repeat(60))
console.log()
console.log('Test Domain:', TEST_DOMAIN)
console.log()
console.log('To seed this domain into your database, run ONE of these:')
console.log()
console.log('1️⃣  LOCAL DATABASE:')
console.log('   npx wrangler d1 execute buhumail-db --local --file=./seed-test-domain.sql')
console.log()
console.log('2️⃣  PRODUCTION DATABASE:')
console.log('   npx wrangler d1 execute buhumail-db --remote --file=./seed-test-domain.sql')
console.log()
console.log('='.repeat(60))
console.log()
console.log('SQL Query to run:')
console.log(seedSQL)
console.log()
console.log('✅ After seeding, all users will see this test domain!')
console.log()

// Also write the SQL to a file
writeFileSync('seed-test-domain.sql', seedSQL.trim())
console.log('💾 SQL saved to: seed-test-domain.sql')
console.log()
