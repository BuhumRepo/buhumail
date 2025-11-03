// Test script to check if API returns system domains
// Run: node test-api.js

const API_URL = 'https://buhumail.com/api/domains'

// You'll need to get your token from browser localStorage
const TOKEN = 'YOUR_TOKEN_HERE'

async function testDomainsAPI() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    console.log('API Response:', JSON.stringify(data, null, 2))
    
    if (data.domains && data.domains.length > 0) {
      console.log('\n✅ Domains found:', data.domains.length)
      data.domains.forEach(domain => {
        console.log(`  - ${domain.domain} (system: ${domain.is_system_domain === 1 ? 'YES' : 'NO'})`)
      })
    } else {
      console.log('\n❌ No domains returned')
    }
  } catch (error) {
    console.error('Error:', error)
  }
}

console.log('Testing /api/domains endpoint...')
console.log('Note: Replace YOUR_TOKEN_HERE with your actual token from browser localStorage\n')
testDomainsAPI()
