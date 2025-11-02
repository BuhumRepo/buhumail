# 🛡️ AI Email Shield - Installation Guide

## ✅ Step 1: Update wrangler.toml (DONE ✓)

The AI binding has been added to your `wrangler.toml`:

```toml
[ai]
binding = "AI"
```

---

## 🗄️ Step 2: Update Database Schema

Run this command to add security columns to your database:

```bash
npx wrangler d1 execute buhumail-db --remote --file=setup-ai-shield/migration.sql
```

This will add:
- `trust_score` - Integer (0-100)
- `security_category` - Text ('safe', 'suspicious', 'dangerous')
- `threats` - JSON array of detected threats
- `analysis_details` - JSON with full analysis
- `analyzed_at` - Timestamp

---

## 📂 Step 3: Copy Worker Files

Copy the analyzer code to your worker:

```bash
# Create utils directory if it doesn't exist
mkdir -p worker/utils

# Copy the analyzer
copy setup-ai-shield\emailAnalyzer.ts worker\utils\emailAnalyzer.ts
```

---

## 🔌 Step 4: Integrate with Email Handler

In your `worker/routes/email.ts` or wherever you handle incoming emails, add:

```typescript
import { analyzeEmail, extractLinks } from '../utils/emailAnalyzer'

// When receiving email:
const links = extractLinks(emailData.body)
const analysis = await analyzeEmail(env, {
  subject: emailData.subject,
  body: emailData.body,
  from: emailData.from,
  links: links
})

// Store with security data:
await env.DB.prepare(`
  INSERT INTO emails (
    user_id, from_address, subject, body,
    trust_score, security_category, threats,
    analysis_details, analyzed_at, received_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).bind(
  userId,
  emailData.from,
  emailData.subject,
  emailData.body,
  analysis.trustScore,
  analysis.category,
  JSON.stringify(analysis.threats),
  JSON.stringify(analysis.details),
  new Date().toISOString(),
  new Date().toISOString()
).run()
```

See `email-handler-integration.ts` for complete examples.

---

## 🚀 Step 5: Deploy

```bash
# Deploy the worker with AI
npx wrangler deploy
```

---

## 🧪 Step 6: Test

Send a test email to verify AI analysis is working:

1. Send a normal email → Should get ~80-95 trust score
2. Send one with "URGENT: Verify Account" → Should get ~15-40 trust score
3. Check logs: `npx wrangler tail`

---

## 📊 Step 7: Update Frontend API Calls

Your frontend already has the components! Just make sure your API returns:

```json
{
  "id": "123",
  "from": "sender@example.com",
  "subject": "Hello",
  "trustScore": 85,
  "category": "safe",
  "threats": [],
  "details": {
    "hasPhishingIndicators": false,
    "hasSuspiciousLinks": false,
    "hasSpamPatterns": false
  }
}
```

---

## ✨ Features Now Available:

✅ Trust scores (0-100) for every email
✅ AI-powered threat detection
✅ Visual security indicators
✅ Detailed threat analysis
✅ Security dashboard
✅ Category-based filtering

---

## 🐛 Troubleshooting

### AI not working?
- Check AI binding is in wrangler.toml
- Verify Cloudflare AI is enabled on your account
- Check worker logs: `npx wrangler tail`

### Database errors?
- Run migration: `npx wrangler d1 execute buhumail-db --remote --file=setup-ai-shield/migration.sql`
- Check columns exist: `npx wrangler d1 execute buhumail-db --command "PRAGMA table_info(emails)"`

### Trust scores not showing?
- Verify email handler calls `analyzeEmail()`
- Check email API returns trust_score field
- Look at browser console for errors

---

## 🎯 Next Steps:

1. Run the migration ✅
2. Copy analyzer file ✅
3. Integrate with email handler ✅
4. Deploy ✅
5. Test with real emails ✅
6. Market the feature! 🚀

Your AI Email Shield is ready to protect users! 🛡️
