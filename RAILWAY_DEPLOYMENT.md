# 🚂 Railway Deployment Guide

Panduan lengkap deploy aplikasi Sistem Inventaris ke Railway (Full-stack: Frontend + Backend + MySQL dalam satu project).

---

## 🎯 Keuntungan Railway

- ✅ **Deploy dari root** - Tidak perlu set root directory manual
- ✅ **Monorepo support** - Frontend & backend dalam 1 project
- ✅ **MySQL built-in** - Plugin MySQL otomatis inject environment variables
- ✅ **Auto-deploy** - Push ke GitHub = auto deploy
- ✅ **Free tier** - $5 credit/bulan (cukup untuk small projects)

---

## 📋 Prerequisites

- ✅ Akun GitHub (repository sudah di-push)
- ✅ Akun Railway: https://railway.app/ (sign up dengan GitHub)
- ✅ Project sudah di-refactor (structure saat ini)

---

## 🚀 Step-by-Step Deployment

### Step 1: Push ke GitHub

```bash
# Di root project
git add .
git commit -m "Refactor for Railway deployment - fullstack ready"
git push origin main
```

### Step 2: Create New Project di Railway

1. **Login ke Railway**: https://railway.app/
2. **Dashboard** → Klik "New Project"
3. Pilih **"Deploy from GitHub repo"**
4. Authorize Railway untuk akses GitHub
5. Pilih repository: **`IanSapury/sistem-inventaris`**
6. Railway akan otomatis detect dan mulai build

### Step 3: Add MySQL Database

1. Di project Railway, klik **"+ New"**
2. Pilih **"Database"** → **"Add MySQL"**
3. Railway akan:
   - Deploy MySQL container
   - Generate credentials otomatis
   - Inject environment variables ke app:
     - `MYSQLHOST`
     - `MYSQLPORT`
     - `MYSQLUSER`
     - `MYSQLPASSWORD`
     - `MYSQLDATABASE`

### Step 4: Import Database Schema

**Option A: Via Railway CLI (Recommended)**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Get MySQL connection string
railway variables

# Connect dan import schema
mysql -h <MYSQLHOST> -P <MYSQLPORT> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < backend/schema.sql
```

**Option B: Via MySQL Workbench**

1. Copy credentials dari Railway MySQL variables
2. Buat connection di MySQL Workbench
3. Connect
4. Import `backend/schema.sql`

**Option C: Via Railway Web Terminal (Beta)**

1. Railway Dashboard → MySQL service → Shell
2. Login ke MySQL: `mysql -u root -p`
3. Copy-paste isi `schema.sql` satu per satu

### Step 5: Configure Environment Variables (Optional)

Railway MySQL sudah otomatis inject environment variables, tapi Anda bisa tambah:

1. Railway Dashboard → Project → Variables
2. Tambah variabel:
   ```
   NODE_ENV=production
   JWT_SECRET=<generate-random-32-chars>
   ```

**Generate JWT_SECRET**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Deploy & Test

1. Railway akan auto-deploy setelah push/changes
2. Check logs: Railway Dashboard → Service → Deployments → Logs
3. Tunggu build selesai (~2-3 menit)
4. Railway akan generate URL: `https://your-app.up.railway.app`

**Test Deployment**:
```bash
# Test API health
curl https://your-app.up.railway.app/api

# Should return:
# {"success":true,"message":"Sistem Inventaris API berjalan",...}
```

5. **Buka browser**: `https://your-app.up.railway.app`
6. Login dengan:
   - Username: `admin`
   - Password: `password123`

---

## 🔍 Troubleshooting

### Issue: Build Failed

**Check logs di Railway Dashboard → Deployments → Build Logs**

**Common fixes**:
```bash
# Pastikan package.json di root ada
# Pastikan backend/package.json ada
# Pastikan postinstall script berjalan
```

### Issue: Database Connection Failed

**Symptoms**: App crash atau error "ER_ACCESS_DENIED"

**Solutions**:
1. Verify MySQL service running di Railway
2. Check environment variables: Dashboard → Variables
3. Pastikan `MYSQLHOST`, `MYSQLUSER`, dll terisi
4. Check logs untuk error message detail

### Issue: Frontend Tidak Muncul

**Symptoms**: API works tapi HTML tidak load

**Solutions**:
1. Check `backend/server.js` → `express.static` path benar
2. Verify `../frontend/public` folder exists
3. Check Railway logs: "Static files path: ..."
4. Test API endpoint: `/api` harus return JSON
5. Test root: `/` harus return HTML

### Issue: 404 Not Found untuk Assets

**Symptoms**: CSS/JS tidak load

**Solutions**:
1. Check browser DevTools → Network tab
2. Pastikan path di HTML benar (relative path)
3. Example: `<script src="/js/config.js">` bukan `<script src="js/config.js">`
4. Verify static middleware di server.js aktif

### Issue: CORS Error

**Symptoms**: Frontend tidak bisa fetch API

**Solutions**:
Railway serve frontend dan backend di same origin, jadi tidak perlu CORS config special.

Pastikan `frontend/public/js/config.js`:
```javascript
API_BASE_URL: '/api'  // Relative path untuk production
```

---

## 📊 Railway Environment Variables

Railway MySQL otomatis inject variabel ini:

| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQLHOST` | MySQL hostname | `containers-us-west-xxx.railway.app` |
| `MYSQLPORT` | MySQL port | `6379` |
| `MYSQLUSER` | MySQL username | `root` |
| `MYSQLPASSWORD` | MySQL password | `xxx` |
| `MYSQLDATABASE` | Database name | `railway` |
| `PORT` | App port | `3000` (auto-set oleh Railway) |

**Custom variables** yang perlu ditambah:
- `NODE_ENV=production`
- `JWT_SECRET=<random-string>`

---

## 🔄 Update & Redeploy

### Auto-Deploy (Recommended)

Railway otomatis re-deploy saat ada push ke GitHub:

```bash
# Edit code
git add .
git commit -m "Update feature X"
git push origin main

# Railway akan auto-detect dan re-deploy (~2 min)
```

### Manual Trigger Deploy

1. Railway Dashboard → Service
2. Klik "..." → "Redeploy"

---

## 💰 Railway Pricing

**Free Tier**:
- $5 credit/bulan
- Cukup untuk:
  - 1 web app (512MB RAM)
  - 1 MySQL database (256MB RAM)
  - ~$5/month usage untuk hobby project

**Estimasi usage**:
- Web app: ~$3/month
- MySQL: ~$2/month

**Jika over limit**:
- App akan sleep
- Bisa upgrade ke paid plan ($5/month)

---

## 📁 File Structure untuk Railway

```
sistem-inventaris/
├── package.json          ← Root package.json (Railway entry point)
├── railway.toml          ← Railway config (optional)
├── backend/
│   ├── server.js         ← Express app
│   ├── package.json      ← Backend dependencies
│   ├── config/db.js      ← MySQL config (Railway-ready)
│   └── ...
└── frontend/
    └── public/
        ├── js/config.js  ← API config (relative path)
        └── ...
```

---

## ✅ Checklist Deployment

- [ ] Push code ke GitHub
- [ ] Create Railway project from GitHub repo
- [ ] Add MySQL database plugin
- [ ] Import database schema
- [ ] Set environment variables (NODE_ENV, JWT_SECRET)
- [ ] Wait for build & deploy (~2-3 min)
- [ ] Test API: `https://your-app.railway.app/api`
- [ ] Test frontend: `https://your-app.railway.app/`
- [ ] Login dengan admin/password123
- [ ] Test CRUD operations
- [ ] Check MySQL data

---

## 🎉 Done!

Aplikasi Anda sekarang LIVE di Railway!

**URLs**:
- Full-stack app: `https://your-app.up.railway.app`
- API: `https://your-app.up.railway.app/api`
- Frontend: `https://your-app.up.railway.app/`

**Free hosting tanpa setup ribet!** 🚀

---

## 📚 Resources

- **Railway Docs**: https://docs.railway.app/
- **Railway CLI**: https://docs.railway.app/develop/cli
- **Railway Discord**: https://discord.gg/railway

---

## 🆚 Railway vs Vercel+Render

| Feature | Railway | Vercel+Render |
|---------|---------|---------------|
| Setup | 1 project | 2 projects |
| Database | Built-in MySQL | External (Aiven) |
| Deploy | 1 command | 2 deploys |
| Cost | $5/month | $0 (with limits) |
| Complexity | Simple | Medium |

**Pilih Railway jika**: Mau simple, 1 project all-in-one  
**Pilih Vercel+Render jika**: Mau 100% gratis, tidak masalah setup 2 services

---

**Happy Railway Deployment! 🚂**
