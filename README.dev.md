# Buhumail Development Guide

## 🚀 Quick Start for Development

### Prerequisites
- Node.js 18+
- Production backend deployed to Cloudflare Pages

### Local Development Setup

**Simple Setup (Current - Uses Production Backend)**
```bash
npm run dev
```
This starts the frontend on port 3000. It will use your **production backend** at buhumail.pages.dev.

**Full Local Setup (Optional - For Backend Development)**
```bash
npm run dev:all
```
This starts both frontend (port 3000) and backend (port 3001) if you need to test backend changes locally.

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: Uses https://buhumail.pages.dev/api (production)

---

## 📦 Production vs Development

### Development (What You're Running Locally)
- Frontend runs on Vite dev server (port 3000)
- Backend runs on Wrangler dev (port 3001)
- Uses local D1 database (`.wrangler/state/v3/d1/`)
- Requires both servers running

### Production (buhumail.com)
- Frontend deployed to Cloudflare Pages
- Backend deployed to Cloudflare Workers
- Uses production D1 database
- **Always running** - no manual start needed
- Users never experience "server not running" issues

---

## 🔧 Deployment Commands

### Deploy Backend (Workers + D1)
```bash
npx wrangler deploy
```

### Deploy Frontend
```bash
npm run build
# Then deploy the `dist` folder to your hosting
```

---

## 🐛 Troubleshooting

### "Request failed" on Login/Register
**Problem**: Local dev is now configured to use production backend
**Solution**: 
1. Make sure your production backend is deployed to buhumail.pages.dev
2. Check that your Pages Functions are working
3. Run `npm run dev` - it will connect to production backend

### Want to Test Backend Locally?
Run `npm run dev:all` to start local backend on port 3001

### Port Already in Use
**Frontend (3000)**: 
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Backend (3001)**:
```bash
netstat -ano | findstr :3001
taskkill /PID <PID> /F
```

---

## 📝 Important Notes

1. **Local dev needs both servers** - this is normal
2. **Production is always running** - users never start servers
3. **Your D1 data is safe** - separate local and production databases
4. **Frontend changes** don't affect backend functionality

---

## 🔐 Environment Variables

Create `.dev.vars` for local development:
```
JWT_SECRET=your-local-secret
```

Production secrets are in Cloudflare Workers settings.
