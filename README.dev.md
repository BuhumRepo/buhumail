# Buhumail Development Guide

## 🚀 Quick Start for Development

### Prerequisites
- Node.js 18+
- Cloudflare account
- Wrangler CLI configured

### Local Development Setup

**Option 1: Run Everything (Recommended)**
```bash
npm run dev:all
```
This starts both frontend (port 3000) and backend (port 3001) simultaneously.

**Option 2: Run Separately**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run dev:backend
```

### Access Points
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api

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

### "Request failed" on Login
**Problem**: Backend not running
**Solution**: Run `npm run dev:all` instead of just `npm run dev`

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
