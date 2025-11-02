# Deployment Guide for Buhumail

This guide will walk you through deploying Buhumail to Cloudflare Pages and Workers.

## Prerequisites

1. A Cloudflare account (free tier works)
2. Wrangler CLI installed globally: `npm install -g wrangler`
3. Cloudflare account authenticated: `wrangler login`

## Step 1: Create D1 Database

```bash
# Create the database
wrangler d1 create buhumail-db
```

Copy the database ID from the output and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "buhumail-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace this
```

## Step 2: Run Database Migrations

### For Local Development
```bash
wrangler d1 migrations apply buhumail-db --local
```

### For Production
```bash
wrangler d1 migrations apply buhumail-db
```

## Step 3: Deploy the Worker

```bash
npm run worker:deploy
```

This will deploy your API backend to Cloudflare Workers.

## Step 4: Build and Deploy Frontend

```bash
# Build the frontend
npm run build

# Deploy to Cloudflare Pages
npm run deploy
```

Alternatively, you can connect your GitHub repository to Cloudflare Pages:

1. Go to Cloudflare Dashboard → Pages
2. Click "Create a project"
3. Connect to your Git provider
4. Select your repository
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/`
6. Click "Save and Deploy"

## Step 5: Configure Email Routing (Optional)

For the temp mail feature to work:

1. Go to Cloudflare Dashboard → Email Routing
2. Enable Email Routing for your domain
3. Add destination addresses
4. Create catch-all route pointing to your Worker
5. Update the Worker's email bindings in `wrangler.toml`

## Step 6: Environment Variables

If you need environment variables, create a `.dev.vars` file for local development:

```bash
# .dev.vars
ENVIRONMENT=development
```

For production, set secrets using:

```bash
wrangler secret put SECRET_NAME
```

## Step 7: Configure Custom Domain (Optional)

### For Cloudflare Pages:
1. Go to your Pages project
2. Click "Custom domains"
3. Add your domain
4. Follow DNS configuration instructions

### For Workers:
1. Go to Workers & Pages → Your Worker
2. Click "Triggers" tab
3. Add custom domain

## Troubleshooting

### Database Connection Issues

If you get database errors:
- Verify the database ID in `wrangler.toml`
- Ensure migrations have been run
- Check D1 bindings in the Worker

### CORS Errors

The Worker is configured to allow CORS. If you encounter issues:
- Check the `corsHeaders` in `worker/types.ts`
- Ensure your frontend origin is allowed

### Build Errors

```bash
# Clear cache and rebuild
rm -rf node_modules dist .wrangler
npm install
npm run build
```

### Email Not Receiving

- Verify Email Routing is enabled in Cloudflare
- Check MX records are correctly configured
- Ensure the Worker email handler is bound correctly
- Check Worker logs: `wrangler tail`

## Monitoring

### View Worker Logs
```bash
wrangler tail
```

### View D1 Database
```bash
wrangler d1 execute buhumail-db --command "SELECT * FROM users LIMIT 10"
```

### Check Deployment Status
```bash
wrangler deployments list
```

## Updating the Application

### Update Worker
```bash
npm run worker:deploy
```

### Update Frontend
```bash
npm run build
npm run deploy
```

### Run New Migrations
```bash
# Create new migration file in migrations/
wrangler d1 migrations apply buhumail-db
```

## Production Checklist

- [ ] D1 database created and migrated
- [ ] Worker deployed successfully
- [ ] Frontend built and deployed to Pages
- [ ] Custom domain configured (if applicable)
- [ ] Email routing set up (if using temp mail)
- [ ] Environment variables/secrets configured
- [ ] HTTPS enabled (automatic with Cloudflare)
- [ ] Test authentication flow
- [ ] Test note creation and viewing
- [ ] Test domain addition (if applicable)

## Costs

Buhumail uses Cloudflare's free tier:
- **Workers:** 100,000 requests/day (free)
- **Pages:** Unlimited requests (free)
- **D1:** 5GB storage, 5M rows read/day (free)
- **Email Routing:** 200 emails/day (free)

For higher usage, check Cloudflare's pricing pages.

## Support

For deployment issues:
- Check Cloudflare Workers documentation
- Review Wrangler CLI documentation
- Check application logs
- Open an issue on the repository
