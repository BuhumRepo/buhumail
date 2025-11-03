# 🔧 Cloudflare Pages Functions - D1 Binding Setup

## ⚠️ Critical Issue: Pages Functions Need D1 Binding

Your backend API code is now in GitHub, but Pages Functions need to be **connected to your D1 database** in Cloudflare Dashboard.

---

## 🚀 Fix the Issue:

### Step 1: Go to Cloudflare Pages Settings

1. Open: https://dash.cloudflare.com
2. Click: **Pages**
3. Select: **buhumail** project
4. Click: **Settings** tab
5. Scroll to: **Functions** section

### Step 2: Add D1 Database Binding

In the **Functions** section:

1. Click **Add binding** under "D1 database bindings"
2. Set:
   - **Variable name:** `DB`
   - **D1 database:** Select `buhumail-db`
3. Click **Save**

### Step 3: Redeploy

After adding the binding:
1. Go to **Deployments** tab
2. Click the **...** (three dots) on the latest deployment
3. Click **Retry deployment**

OR just push any change to trigger a new deployment.

---

## 🔍 Verify It's Working:

After redeployment (takes 2-3 minutes):

1. Visit: https://buhumail.com/dashboard/domains
2. Hard refresh: **Ctrl + Shift + R**
3. Check browser console (F12) → Network tab
4. Look at `/api/domains` response

Should see:
```json
{
  "domains": [
    {
      "id": "system-test-domain-001",
      "domain": "buhumail.xyz",
      "verified": 1,
      "is_system_domain": 1
    }
  ]
}
```

---

## 📊 What Each Binding Does:

| Binding | Variable | Purpose |
|---------|----------|---------|
| D1 Database | `DB` | Access to buhumail-db for domains, users, etc. |
| Environment Variable | `ENVIRONMENT` | Set to "production" |

---

## 🆘 If Still Not Working:

Check if Pages Functions are being built:

1. Go to Pages deployment logs
2. Look for: `Functions` section
3. Should see: `✓ Compiled X function(s)`

If you see `0 functions compiled`, the `functions/` directory isn't being recognized.

---

**Add the D1 binding now and redeploy!** 🚀
