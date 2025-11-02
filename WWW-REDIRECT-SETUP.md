# 🌐 WWW to Non-WWW HTTPS Redirect Setup

## ✅ Recommended: Cloudflare Page Rules (Easiest)

### Step 1: Add www.buhumail.com as Custom Domain

1. Go to: https://dash.cloudflare.com
2. Navigate to: **Workers & Pages** → **buhumail**
3. Click **"Custom domains"** tab
4. Click **"Set up a custom domain"**
5. Enter: `www.buhumail.com`
6. Click **"Continue"** and follow prompts
7. Wait for DNS to propagate (~2 minutes)

### Step 2: Create 301 Redirect Rule

**Option A: Page Rules (Classic)**
1. Go to your domain dashboard
2. Click **"Rules"** → **"Page Rules"**
3. Click **"Create Page Rule"**
4. Configure:
   ```
   URL: www.buhumail.com/*
   Setting: Forwarding URL
   Type: 301 - Permanent Redirect
   Destination: https://buhumail.com/$1
   ```
5. Click **"Save and Deploy"**

**Option B: Redirect Rules (Modern - Recommended)**
1. Go to your domain dashboard
2. Click **"Rules"** → **"Redirect Rules"**
3. Click **"Create rule"**
4. Configure:
   - **Name**: `WWW to non-WWW redirect`
   - **When incoming requests match**:
     - Hostname equals `www.buhumail.com`
   - **Then**:
     - Type: `Dynamic`
     - Expression: `concat("https://buhumail.com", http.request.uri.path)`
     - Status code: `301`
5. Click **"Deploy"**

---

## 🧪 Test Your Redirect

After setup, test these URLs:

```bash
# Should redirect to https://buhumail.com
http://www.buhumail.com

# Should redirect to https://buhumail.com
https://www.buhumail.com

# Should work directly
https://buhumail.com

# Should redirect to https://buhumail.com
http://buhumail.com
```

---

## 🔐 Bonus: Force HTTPS Everywhere

To ensure ALL traffic uses HTTPS:

1. Go to: Cloudflare Dashboard → **buhumail.com**
2. Click **"SSL/TLS"** → **"Edge Certificates"**
3. Enable **"Always Use HTTPS"** → ON

This redirects all HTTP requests to HTTPS automatically.

---

## 📊 Final URL Structure

After setup:
- ✅ `www.buhumail.com` → redirects to → `https://buhumail.com`
- ✅ `http://buhumail.com` → redirects to → `https://buhumail.com`
- ✅ `http://www.buhumail.com` → redirects to → `https://buhumail.com`
- ✅ `https://buhumail.com` → main URL (canonical)

---

## ⚡ Why This Matters

1. **SEO**: Search engines prefer one canonical URL
2. **Analytics**: All traffic goes to one domain
3. **SSL**: HTTPS everywhere for security
4. **Professional**: Standard practice for production sites

---

## 🎯 Best Practice

Always use:
- Non-www (`buhumail.com`) as canonical
- HTTPS always
- 301 permanent redirects

This is what big companies do! 🚀
