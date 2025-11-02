# 🛡️ AI Email Shield Implementation Guide

## Overview
AI-powered email security analyzer that shows trust scores (0-100) for every email, detecting spam, phishing, and malicious content using Cloudflare AI Workers.

---

## Backend Implementation (Worker Code)

### 1. Update `wrangler.toml`

Add AI binding:
```toml
[ai]
binding = "AI"
```

### 2. Create AI Analyzer Function

Add to `worker/utils/emailAnalyzer.ts`:

```typescript
interface EmailAnalysis {
  trustScore: number
  threats: string[]
  category: 'safe' | 'suspicious' | 'dangerous'
  details: {
    hasPhishingIndicators: boolean
    hasSuspiciousLinks: boolean
    hasMaliciousAttachments: boolean
    hasSpamPatterns: boolean
    sentiment: string
  }
}

export async function analyzeEmail(
  env: Env,
  email: {
    subject: string
    body: string
    from: string
    links?: string[]
  }
): Promise<EmailAnalysis> {
  try {
    // Use Cloudflare AI to analyze email content
    const prompt = `Analyze this email for security threats. Rate its trustworthiness from 0-100.

From: ${email.from}
Subject: ${email.subject}
Body: ${email.body.substring(0, 1000)}
${email.links ? `Links: ${email.links.join(', ')}` : ''}

Analyze for:
1. Phishing attempts
2. Suspicious links
3. Spam patterns
4. Social engineering
5. Urgency tactics
6. Impersonation

Return JSON with:
{
  "trustScore": 0-100,
  "threats": ["list of threats found"],
  "isPhishing": boolean,
  "isSuspicious": boolean,
  "hasMaliciousLinks": boolean,
  "hasSpamPatterns": boolean
}`

    const aiResponse = await env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      prompt: prompt,
    })

    // Parse AI response
    const analysis = parseAIResponse(aiResponse)
    
    // Calculate trust score
    const trustScore = calculateTrustScore(analysis, email)
    
    // Determine category
    const category = trustScore >= 70 ? 'safe' : trustScore >= 40 ? 'suspicious' : 'dangerous'
    
    return {
      trustScore,
      threats: analysis.threats,
      category,
      details: {
        hasPhishingIndicators: analysis.isPhishing,
        hasSuspiciousLinks: analysis.hasMaliciousLinks,
        hasMaliciousAttachments: false, // Check attachments separately
        hasSpamPatterns: analysis.hasSpamPatterns,
        sentiment: analysis.sentiment || 'neutral'
      }
    }
  } catch (error) {
    console.error('Email analysis failed:', error)
    // Return neutral score on error
    return {
      trustScore: 50,
      threats: [],
      category: 'suspicious',
      details: {
        hasPhishingIndicators: false,
        hasSuspiciousLinks: false,
        hasMaliciousAttachments: false,
        hasSpamPatterns: false,
        sentiment: 'unknown'
      }
    }
  }
}

function calculateTrustScore(analysis: any, email: any): number {
  let score = 100
  
  // Deduct points for threats
  if (analysis.isPhishing) score -= 50
  if (analysis.hasMaliciousLinks) score -= 30
  if (analysis.hasSpamPatterns) score -= 20
  if (analysis.isSuspicious) score -= 15
  
  // Check sender domain reputation (simplified)
  const commonDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'icloud.com']
  const senderDomain = email.from.split('@')[1]
  if (!commonDomains.includes(senderDomain)) {
    score -= 5 // Unknown domain
  }
  
  // Ensure score is between 0-100
  return Math.max(0, Math.min(100, score))
}

function parseAIResponse(response: any): any {
  // Parse AI response and extract threat information
  try {
    const text = response.response || JSON.stringify(response)
    // Extract JSON from response if present
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0])
    }
    
    // Fallback: analyze text for keywords
    return {
      threats: extractThreats(text),
      isPhishing: text.toLowerCase().includes('phishing'),
      isSuspicious: text.toLowerCase().includes('suspicious'),
      hasMaliciousLinks: text.toLowerCase().includes('malicious'),
      hasSpamPatterns: text.toLowerCase().includes('spam')
    }
  } catch (error) {
    return {
      threats: [],
      isPhishing: false,
      isSuspicious: false,
      hasMaliciousLinks: false,
      hasSpamPatterns: false
    }
  }
}

function extractThreats(text: string): string[] {
  const threats: string[] = []
  const keywords = [
    { pattern: /phishing/i, threat: 'Phishing attempt detected' },
    { pattern: /suspicious link/i, threat: 'Suspicious links found' },
    { pattern: /malware/i, threat: 'Potential malware' },
    { pattern: /spam/i, threat: 'Spam patterns detected' },
    { pattern: /urgent|immediate action/i, threat: 'Urgency tactics' },
    { pattern: /verify account|confirm identity/i, threat: 'Identity verification request' }
  ]
  
  keywords.forEach(({ pattern, threat }) => {
    if (pattern.test(text)) {
      threats.push(threat)
    }
  })
  
  return threats
}
```

### 3. Update Email Receive Handler

In `worker/routes/email.ts`, add analysis when receiving emails:

```typescript
import { analyzeEmail } from '../utils/emailAnalyzer'

// When receiving new email
const analysis = await analyzeEmail(env, {
  subject: emailData.subject,
  body: emailData.body,
  from: emailData.from,
  links: extractLinks(emailData.body)
})

// Store analysis with email
await env.DB.prepare(`
  INSERT INTO emails (user_id, from_address, subject, body, trust_score, security_category, threats, received_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  userId,
  emailData.from,
  emailData.subject,
  emailData.body,
  analysis.trustScore,
  analysis.category,
  JSON.stringify(analysis.threats),
  new Date().toISOString()
).run()
```

### 4. Database Migration

Add columns to emails table:

```sql
ALTER TABLE emails ADD COLUMN trust_score INTEGER DEFAULT 50;
ALTER TABLE emails ADD COLUMN security_category TEXT DEFAULT 'suspicious';
ALTER TABLE emails ADD COLUMN threats TEXT DEFAULT '[]';
ALTER TABLE emails ADD COLUMN analysis_details TEXT DEFAULT '{}';
```

---

## Frontend Implementation

Already implemented in the components below!

---

## API Endpoints

### GET /api/emails/:id/security
Returns detailed security analysis for an email

```json
{
  "trustScore": 85,
  "category": "safe",
  "threats": [],
  "details": {
    "hasPhishingIndicators": false,
    "hasSuspiciousLinks": false,
    "hasMaliciousAttachments": false,
    "hasSpamPatterns": false,
    "sentiment": "neutral"
  },
  "analyzedAt": "2024-11-02T14:00:00Z"
}
```

---

## Testing

1. Send test emails with phishing indicators
2. Check trust scores display correctly
3. Test with various email types:
   - Normal emails (should be 80-100)
   - Suspicious emails (40-70)
   - Phishing attempts (0-40)

---

## Marketing Copy

**Website:**
"AI Email Shield - See the trust score of every email before you open it. Our AI analyzes each message for phishing, malware, and suspicious content."

**Key Features:**
- ✅ Real-time AI security analysis
- ✅ Visual trust scores (0-100)
- ✅ Detailed threat breakdowns
- ✅ Automatic categorization
- ✅ Learn as you go

**Competitive Advantage:**
Unlike Gmail or Outlook that silently filter spam, Buhumail SHOWS you exactly why an email is safe or dangerous. Full transparency.
