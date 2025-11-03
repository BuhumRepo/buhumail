# 🧪 Test Domain Setup Guide

This guide will help you add **buhumail.xyz** as a test domain so users can immediately test your temp email service without setting up their own domains.

---

## 🎯 What is the Test Domain?

The test domain (`buhumail.xyz`) is a **shared, pre-verified domain** that:
- ✅ Appears automatically for all users
- ✅ Requires no DNS setup
- ✅ Allows instant testing
- ✅ Cannot be deleted by users
- ⚠️ Is shared (public) - anyone can create `username@buhumail.pages.dev`

---

## 📋 Prerequisites

Before setting up the test domain, you need:

1. **Cloudflare Account** with Pages and Workers
2. **Domain purchased**: `buhumail.xyz` ($0.99/year)
3. **D1 Database** (`buhumail-db`) created
4. **Domain added to Cloudflare** with nameservers configured
5. **Cloudflare Email Routing** configured (see BUHUMAIL-XYZ-SETUP.md)

---

## 🚀 Step 1: Seed the Database

Run the seed script to add the test domain to your database:

### For LOCAL Database:
```bash
node seed-test-domain.js
npx wrangler d1 execute buhumail-db --local --file=seed-test-domain.sql
```

### For PRODUCTION Database:
```bash
node seed-test-domain.js
npx wrangler d1 execute buhumail-db --remote --file=seed-test-domain.sql
```

This will:
- Add `is_system_domain` column to the `domains` table
- Insert `buhumail.pages.dev` as a verified system domain
- Mark it so users can't delete it

---

## 📧 Step 2: Configure Cloudflare Email Routing

### Option A: If You Own buhumail.com (Recommended)

Since `.pages.dev` domains don't support email routing, **use a subdomain of your main domain**:

1. **Update the seed script:**
   ```javascript
   const TEST_DOMAIN = 'test.buhumail.com'  // Change this line
   ```

2. **Re-run the seed script** with the new domain

3. **Configure Email Routing** in Cloudflare:
   ```
   Dashboard → Email Routing → Destination Addresses
   → Add route: test.buhumail.com → buhumail-worker
   ```

4. **Add DNS Record** (Cloudflare usually auto-adds):
   ```
   Type: MX
   Name: test.buhumail.com
   Priority: 10
   Target: route1.mx.cloudflare.net
   ```

### Option B: Using buhumail.pages.dev (No Email Routing Yet)

**Important:** `.pages.dev` domains don't currently support Cloudflare Email Routing.

You can still implement the UI changes, but emails won't actually be received until:
- Cloudflare adds email routing support for `.pages.dev`, OR
- You use a custom domain instead

---

## 🎨 Step 3: Deploy Frontend Changes

The UI has been updated to show the test domain with special styling:

```bash
# Commit changes
git add .
git commit -m "Add test domain feature with buhumail.pages.dev"

# Push to trigger auto-deploy
git push origin main
```

The frontend will now:
- Show test domain with ⭐ badge
- Display it first in the list
- Default to it when creating temp emails
- Show an info banner explaining it's shared
- Prevent users from deleting it

---

## 🔍 Step 4: Verify Setup

### Check Database:
```bash
# Local
npx wrangler d1 execute buhumail-db --local --command "SELECT * FROM domains WHERE is_system_domain = 1;"

# Production
npx wrangler d1 execute buhumail-db --remote --command "SELECT * FROM domains WHERE is_system_domain = 1;"
```

You should see:
```
id: system-test-domain-001
domain: buhumail.pages.dev
verified: 1
is_system_domain: 1
```

### Check UI:
1. Login to your app
2. Go to **Domains** tab
3. You should see `buhumail.pages.dev` with:
   - ✨ Purple gradient icon
   - ⭐ "TEST DOMAIN" badge
   - 🎉 "Free test domain for all users" message
   - Grayed out delete button

4. Go to **Temp Emails** tab
5. You should see:
   - Info banner about the test domain
   - Test domain pre-selected in dropdown
   - ⭐ indicator in domain selector

---

## 🔄 Alternative: Remove Test Domain

If you want to remove the test domain later:

```bash
# Remove from database
npx wrangler d1 execute buhumail-db --remote --command "DELETE FROM domains WHERE is_system_domain = 1;"

# Remove files (optional)
rm seed-test-domain.js
rm seed-test-domain.sql
rm TEST-DOMAIN-SETUP.md
```

---

## 💡 Tips & Best Practices

### Security Considerations:
- ⚠️ **Test domain is PUBLIC** - anyone can create `anything@buhumail.pages.dev`
- ⚠️ **Don't use for sensitive data** - this is for testing only
- ✅ **Encourage users to add their own domains** for production use

### User Experience:
- The test domain lowers the barrier to entry
- New users can test immediately without DNS setup
- Clear messaging explains it's shared/public
- Easy upgrade path to custom domains

### Production Recommendations:
1. Use `test.buhumail.com` instead of `.pages.dev`
2. Set up rate limiting on test domain emails
3. Add auto-cleanup for old test emails
4. Monitor test domain for abuse

---

## 🆘 Troubleshooting

### Test Domain Not Showing?
- Check if database seed was successful
- Verify backend returns `is_system_domain` in API responses
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for errors

### Can't Create Emails on Test Domain?
- Verify email routing is configured in Cloudflare
- Check worker logs: `npx wrangler tail`
- Ensure domain is marked as verified in database

### Users Can Delete Test Domain?
- Check `is_system_domain = 1` in database
- Verify frontend checks for `domain.is_system_domain`
- Clear and rebuild frontend

---

## 📚 Related Files

- `seed-test-domain.js` - Seed script generator
- `seed-test-domain.sql` - Generated SQL file
- `src/components/DomainsPanel.tsx` - Domains UI with test domain styling
- `src/components/TempEmailsPanel.tsx` - Temp emails UI with test domain banner

---

## ✅ Summary

After setup, users will see:

**Domains Tab:**
```
┌─────────────────────────────────────────────┐
│ ✨ buhumail.pages.dev    ⭐ TEST DOMAIN    │
│ 🎉 Free test domain for all users          │
│ ✓ Verified                                  │
│                                        🚫   │
└─────────────────────────────────────────────┘
```

**Temp Emails Tab:**
```
┌─────────────────────────────────────────────┐
│ ✨ Test Domain Available!        FREE      │
│                                             │
│ Use buhumail.pages.dev to test instantly   │
│ ℹ️  Note: Shared test domain. Add your    │
│    own domain for production use.          │
└─────────────────────────────────────────────┘
```

**Result:** Lower barrier to entry + Better user onboarding! 🎉

---

Built with ❤️ for better user experience
