# Automatic Deployment Setup

This will make both your **frontend (Pages)** and **backend (Worker)** deploy automatically on every `git push`.

---

## 🔧 One-Time Setup (5 minutes)

### Step 1: Get Your Cloudflare API Token

1. Go to: https://dash.cloudflare.com/profile/api-tokens
2. Click **"Create Token"**
3. Use template: **"Edit Cloudflare Workers"**
4. Or create custom token with permissions:
   - **Account** → **Cloudflare Pages** → **Edit**
   - **Account** → **Workers Scripts** → **Edit**
   - **Zone** → **Workers Routes** → **Edit**
5. Click **"Continue to summary"** → **"Create Token"**
6. **Copy the token** (you'll only see it once!)

### Step 2: Get Your Cloudflare Account ID

1. Go to: https://dash.cloudflare.com
2. Click on **"Workers & Pages"**
3. On the right side, you'll see **"Account ID"**
4. Copy it

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repo: https://github.com/buhument/buhumail
2. Click **"Settings"** → **"Secrets and variables"** → **"Actions"**
3. Click **"New repository secret"**

Add these two secrets:

**Secret 1:**
- Name: `CLOUDFLARE_API_TOKEN`
- Value: [paste the API token from Step 1]

**Secret 2:**
- Name: `CLOUDFLARE_ACCOUNT_ID`
- Value: [paste the Account ID from Step 2]

---

## ✅ That's It!

From now on, **every time you push to main branch:**

```bash
git add .
git commit -m "Your changes"
git push origin main
```

**GitHub Actions will automatically:**
1. ✅ Build your frontend
2. ✅ Deploy to Cloudflare Pages (buhumail.pages.dev)
3. ✅ Deploy your Worker backend (API)

---

## 🔍 Monitor Deployments

**GitHub**: https://github.com/buhument/buhumail/actions
- See deployment status and logs

**Cloudflare Pages**: https://dash.cloudflare.com → Workers & Pages → buhumail
- See Pages deployment

**Cloudflare Workers**: https://dash.cloudflare.com → Workers & Pages → buhumail-worker
- See Worker deployment

---

## 🚨 If Something Goes Wrong

### Deployment fails with "Unauthorized"
- Check that your API token is correct in GitHub Secrets
- Make sure the token has the right permissions

### Worker doesn't deploy
- Make sure `wrangler.toml` exists and isn't gitignored
- Check that worker code exists in your repo

### Pages deploys but login still broken
- Worker might have failed to deploy
- Check GitHub Actions logs for errors
- Verify Worker is actually running in Cloudflare dashboard

---

## 🎯 Current Deployment Status

After this setup:
- **Manual deployment**: ❌ Not needed anymore
- **Automatic deployment**: ✅ On every push
- **Frontend + Backend together**: ✅ Both deploy automatically

No more separate `wrangler deploy` commands!
