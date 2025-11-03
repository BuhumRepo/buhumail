# 🚀 buhumail.xyz Email Routing Setup Guide

Your test domain **buhumail.xyz** is now configured in the database! Follow these steps to set up Cloudflare Email Routing so users can actually receive emails.

---

## ✅ What You Have Now

- ✅ Domain purchased: `buhumail.xyz`
- ✅ Database updated with test domain
- ✅ UI configured to show test domain
- ⏳ Email routing: **NEEDS SETUP** (this guide)

---

## 📋 Prerequisites

1. Cloudflare account (same one with your Workers)
2. `buhumail.xyz` added to Cloudflare (do this first!)
3. Nameservers pointed to Cloudflare

---

## 🔧 Step 1: Add Domain to Cloudflare

1. **Login to Cloudflare Dashboard**
   - Go to: https://dash.cloudflare.com

2. **Add Site**
   - Click "Add a Site" button
   - Enter: `buhumail.xyz`
   - Select Free plan
   - Click "Add Site"

3. **Update Nameservers** (at your domain registrar)
   - Cloudflare will show you 2 nameservers like:
     ```
     alice.ns.cloudflare.com
     bob.ns.cloudflare.com
     ```
   - Go to your domain registrar (where you bought buhumail.xyz)
   - Update nameservers to Cloudflare's
   - Wait 5-60 minutes for propagation

4. **Verify Domain is Active**
   - Check status in Cloudflare dashboard
   - Should show "Active" with green checkmark

---

## 📧 Step 2: Enable Email Routing

### 2.1 Go to Email Routing
1. In Cloudflare Dashboard, select `buhumail.xyz`
2. Click **"Email"** in the left sidebar
3. Click **"Email Routing"** tab
4. Click **"Get Started"** or **"Enable Email Routing"**

### 2.2 Configure Destination
Cloudflare will ask where to send emails. You have **2 options:**

#### Option A: Send to Worker (Recommended)
This routes emails directly to your `buhumail-worker`:

1. Click **"Route to Worker"**
2. Select your worker: `buhumail-worker`
3. Click **"Create"**

Your worker should have email handler:
```typescript
export default {
  async email(message, env, ctx) {
    // Extract email data
    const from = message.from
    const to = message.to
    const subject = message.headers.get("subject")
    
    // Store in D1 database
    await env.DB.prepare(`
      INSERT INTO messages (from_address, to_address, subject, body_text, received_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(from, to, subject, await message.text(), Date.now()).run()
    
    return new Response("OK")
  }
}
```

#### Option B: Forward to Email Address (for testing)
1. Enter your email address (e.g., your@gmail.com)
2. Check your email and click verification link
3. Set as destination

### 2.3 DNS Records (Auto-Created)
Cloudflare will automatically add these DNS records:
```
Type: MX
Name: @
Content: route1.mx.cloudflare.net
Priority: 56

Type: TXT
Name: @
Content: v=spf1 include:_spf.mx.cloudflare.net ~all
```

✅ **Email routing is now enabled!**

---

## 🧪 Step 3: Test Email Reception

### Test 1: Send Test Email
1. Login to your app
2. Go to **Temp Emails** tab
3. Create email: `test@buhumail.xyz`
4. Send email to `test@buhumail.xyz` from your personal email
5. Check inbox in your app

### Test 2: Cloudflare Dashboard
1. Go to Email Routing in Cloudflare
2. Click **"Logs"** tab
3. You should see incoming emails

### Test 3: Worker Logs
```bash
# Watch worker logs in real-time
npx wrangler tail buhumail-worker
```

Send a test email and watch logs appear.

---

## 🎨 Step 4: Deploy Frontend Changes

Your UI already shows `buhumail.xyz`, but make sure it's deployed:

```bash
git add .
git commit -m "Update test domain to buhumail.xyz"
git push origin main
```

Cloudflare Pages will auto-deploy in ~2 minutes.

---

## 🔍 Verify Everything Works

### Check 1: Database
```bash
npx wrangler d1 execute buhumail-db --remote --command "SELECT * FROM domains WHERE is_system_domain = 1;"
```

Should show:
```
domain: buhumail.xyz
verified: 1
is_system_domain: 1
```

### Check 2: UI
1. Login to https://buhumail.com
2. Go to **Domains** tab
3. Should see `buhumail.xyz` with:
   - ✨ Purple sparkle icon
   - ⭐ "TEST DOMAIN" badge
   - 🎉 "Free test domain" message

### Check 3: Create Test Email
1. Go to **Temp Emails** tab
2. Click "New Email"
3. `buhumail.xyz` should be pre-selected with ⭐
4. Create email like `john@buhumail.xyz`
5. Send a test email to it
6. Check inbox - email should appear!

---

## 🛠️ Troubleshooting

### Emails Not Arriving?

**Check 1: Email Routing Status**
- Go to Cloudflare → buhumail.xyz → Email → Email Routing
- Status should be "Active" (green)

**Check 2: DNS Records**
```bash
# Check MX records
nslookup -type=mx buhumail.xyz
```
Should show Cloudflare MX records.

**Check 3: Worker Has Email Handler**
Make sure your worker exports an `email` function:
```typescript
export default {
  async email(message, env) {
    // Handle email
  }
}
```

**Check 4: Worker Logs**
```bash
npx wrangler tail buhumail-worker
```
Send test email and watch for errors.

### UI Not Showing New Domain?

1. Clear browser cache (Ctrl+Shift+R)
2. Check if frontend deployed: https://buhumail.com
3. Check browser console for errors

### Domain Not Active in Cloudflare?

- Nameservers take 5-60 minutes to propagate
- Check current nameservers:
  ```bash
  nslookup -type=ns buhumail.xyz
  ```
- Should show Cloudflare nameservers

---

## 🎯 What Users Will See

**Domains Tab:**
```
┌──────────────────────────────────────┐
│ ✨ buhumail.xyz     ⭐ TEST DOMAIN  │
│ 🎉 Free test domain for all users   │
│ ✓ Verified                           │
└──────────────────────────────────────┘
```

**Temp Emails Tab:**
```
┌──────────────────────────────────────┐
│ ✨ Test Domain Available!     FREE  │
│ Use buhumail.xyz to test instantly   │
│ ℹ️  Shared test domain. Add your own│
│    for production use.               │
└──────────────────────────────────────┘
```

**Benefits:**
- ✅ Zero risk to buhumail.com reputation
- ✅ Real email functionality
- ✅ Instant testing for new users
- ✅ Professional and clean

---

## 📊 Monitor Usage

### Email Routing Metrics
In Cloudflare Dashboard → buhumail.xyz → Email:
- Total emails received
- Emails forwarded
- Errors and bounces

### Database Queries
```bash
# Count test domain emails
npx wrangler d1 execute buhumail-db --remote --command "
  SELECT COUNT(*) as total 
  FROM temp_emails 
  WHERE domain = 'buhumail.xyz';
"
```

---

## 🔐 Security Best Practices

### Rate Limiting
Consider adding rate limiting to prevent spam:
```typescript
// In your worker
const rateLimiter = new Map()

export default {
  async email(message, env) {
    const fromDomain = message.from.split('@')[1]
    
    // Simple rate limit: max 10 emails/hour per domain
    const key = `rate:${fromDomain}`
    const count = rateLimiter.get(key) || 0
    
    if (count > 10) {
      return new Response("Rate limit exceeded", { status: 429 })
    }
    
    rateLimiter.set(key, count + 1)
    // Continue processing...
  }
}
```

### Spam Filtering
Monitor for spam patterns:
- Too many emails from same sender
- Suspicious subject lines
- Large attachments

### Cleanup
Set up auto-cleanup for old test emails:
```sql
-- Delete test emails older than 7 days
DELETE FROM temp_emails 
WHERE domain = 'buhumail.xyz' 
AND created_at < strftime('%s', 'now', '-7 days') * 1000;
```

---

## 🎉 You're All Set!

Your test domain `buhumail.xyz` is now fully configured and ready to:
- ✅ Receive real emails
- ✅ Let users test instantly
- ✅ Protect your main domain
- ✅ Provide professional experience

**Next: Push frontend changes and test it out!**

```bash
git push origin main
```

Then create a test email and send yourself a message! 🚀

---

## 🆘 Need Help?

- **Cloudflare Email Docs**: https://developers.cloudflare.com/email-routing/
- **Workers Email Handler**: https://developers.cloudflare.com/workers/runtime-apis/handlers/email/
- **D1 Database**: https://developers.cloudflare.com/d1/

Happy testing! 🎊
