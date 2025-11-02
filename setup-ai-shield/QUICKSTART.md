# 🚀 AI Email Shield - Quick Start Guide

## ⚠️ Important: You need to complete these steps

### Step 1: Login to Wrangler (if needed)

```bash
npx wrangler login
```

### Step 2: Run Database Migration

```bash
npx wrangler d1 execute buhumail-db --remote --file=setup-ai-shield/migration.sql
```

This adds AI security columns to your emails table.

### Step 3: Copy Analyzer to Worker

```bash
# Copy the analyzer function
copy setup-ai-shield\emailAnalyzer.ts worker\utils\emailAnalyzer.ts
```

### Step 4: Update Email Handler

Look at `setup-ai-shield/email-handler-integration.ts` for examples on how to:
- Call `analyzeEmail()` when receiving emails
- Store trust scores and threats
- Return security data in API responses

### Step 5: Deploy

```bash
npx wrangler deploy
```

### Step 6: Test

Visit `/security-demo` on your site to see it working!

---

## ✅ What's Already Done:

✓ AI binding added to wrangler.toml
✓ Frontend components created
✓ Security dashboard built
✓ Demo page live at /security-demo
✓ Analyzer function ready to deploy

## 🎯 What You Need to Do:

1. Run migration (adds database columns)
2. Copy analyzer to worker folder
3. Integrate with email handler
4. Deploy!

That's it! Your AI Email Shield will be live! 🛡️
