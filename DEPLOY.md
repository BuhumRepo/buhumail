# Quick Deployment Guide for Buhumail

## 🚀 Deploy to Cloudflare Pages

### Prerequisites
- Cloudflare account
- Pages project created and connected to GitHub
- Custom domain (buhumail.com) added to Pages project

### Automatic Deployment (Recommended)
1. Push your code to GitHub main branch (already done!)
```bash
git push origin main
```

2. Cloudflare Pages automatically:
   - Detects the push
   - Runs `npm run build`
   - Deploys to buhumail.pages.dev
   - Updates custom domain (buhumail.com)

3. Check deployment status:
   - Go to: https://dash.cloudflare.com
   - Navigate to: **Workers & Pages** → **buhumail**
   - View deployment logs

### Manual Deployment
If auto-deploy isn't set up:

```bash
# Build the project
npm run build

# Deploy using Wrangler
npx wrangler pages deploy dist --project-name=buhumail
```

### After Deployment
- Visit: https://buhumail.pages.dev (should work immediately)
- Visit: https://buhumail.com (custom domain - may take a few minutes)

---

## 🔍 Troubleshooting Production Issues

### "Request failed" on buhumail.com

**Check 1: Is the latest code deployed?**
- Go to Cloudflare Pages dashboard
- Check the latest deployment timestamp
- Should match your latest git push

**Check 2: Are Pages Functions working?**
- Test: https://buhumail.com/api/health (or similar endpoint)
- Should return a response, not 404

**Check 3: Is custom domain configured?**
- In Cloudflare Pages → Settings → Custom domains
- buhumail.com should be listed and active

**Check 4: Browser cache**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Or clear browser cache

---

## 📋 Deployment Checklist

- [ ] Latest code pushed to GitHub
- [ ] Cloudflare Pages auto-deploys or manual deploy completed
- [ ] Check https://buhumail.pages.dev works
- [ ] Check https://buhumail.com works
- [ ] Test login/register on production
- [ ] Verify Pages Functions are responding

---

## ⚙️ Pages Functions Setup

Your backend API runs as **Cloudflare Pages Functions**.

**Location**: `/functions/api/` directory

**Access**: `https://buhumail.com/api/*`

**Make sure**:
1. Functions are in the `functions/` directory
2. D1 database binding is configured in Pages settings
3. Environment variables are set in Pages dashboard

---

## 🆘 Common Issues

### Login works on buhumail.pages.dev but not buhumail.com
- **Cause**: Custom domain not properly configured
- **Fix**: In Cloudflare Pages, go to Custom domains → Verify DNS

### "Request failed" error
- **Cause**: Backend not responding
- **Fix**: Check Pages Functions are deployed and D1 binding is configured

### Old version showing
- **Cause**: Browser cache or deployment not finished
- **Fix**: Hard refresh browser (Ctrl+Shift+R) or wait for deployment

---

## 📞 Need Help?

1. Check Cloudflare Pages deployment logs
2. Check browser console (F12) for errors
3. Test API endpoints directly: https://buhumail.com/api/
