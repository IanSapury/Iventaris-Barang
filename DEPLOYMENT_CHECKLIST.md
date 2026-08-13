# ✅ Deployment Checklist

Checklist step-by-step untuk deploy aplikasi ke production.

---

## 📋 Pre-Deployment

### 1. Persiapan Akun (Gratis Semua!)

- [ ] Akun GitHub: https://github.com/signup
- [ ] Akun Vercel: https://vercel.com/signup (login dengan GitHub)
- [ ] Akun Render: https://render.com/register
- [ ] Akun Aiven: https://console.aiven.io/signup (atau TiDB Cloud)

### 2. Persiapan Code

- [ ] Test aplikasi berjalan di lokal (ikuti [QUICK_START.md](./QUICK_START.md))
- [ ] Semua fitur sudah di-test dan berfungsi
- [ ] File `.env` di backend sudah dikonfigurasi untuk local testing

---

## 🗄️ Step 1: Setup Database (30 menit)

### Aiven MySQL

- [ ] Sign up di [Aiven Console](https://console.aiven.io/)
- [ ] Create new MySQL service (Free plan)
- [ ] Pilih region: **Singapore**
- [ ] Service name: `mysql-inventaris`
- [ ] Tunggu service aktif (~5-10 menit)
- [ ] Copy connection details:
  - [ ] Host: `mysql-xxx.aivencloud.com`
  - [ ] Port: `12345`
  - [ ] User: `avnadmin`
  - [ ] Password: `xxxx`
  - [ ] Database: `defaultdb`

### Import Database Schema

- [ ] Connect ke MySQL via CLI atau MySQL Workbench
- [ ] Create database: `CREATE DATABASE db_inventaris;`
- [ ] Import `backend/schema.sql`
- [ ] Verify tables: `SHOW TABLES;` (harus ada 7 tables)
- [ ] Verify data: `SELECT * FROM users;` (harus ada 3 users)

**Simpan credentials** untuk Step 2!

---

## 🔧 Step 2: Deploy Backend ke Render (20 menit)

### Push Code ke GitHub

- [ ] Initialize git (jika belum): `git init`
- [ ] Add remote: `git remote add origin https://github.com/IanSapury/sistem-inventaris.git`
- [ ] Stage files: `git add .`
- [ ] Commit: `git commit -m "Prepare for deployment"`
- [ ] Push: `git push -u origin main`

### Create Web Service di Render

- [ ] Login ke [Render Dashboard](https://dashboard.render.com/)
- [ ] Klik "New +" → "Web Service"
- [ ] Connect GitHub account
- [ ] Pilih repository: `IanSapury/sistem-inventaris`
- [ ] Configure:
  - [ ] Name: `sistem-inventaris-api`
  - [ ] Region: **Singapore**
  - [ ] Branch: `main`
  - [ ] Root Directory: **`backend`** ← PENTING!
  - [ ] Runtime: **Node**
  - [ ] Build Command: `npm install`
  - [ ] Start Command: `npm start`
  - [ ] Instance Type: **Free**

### Environment Variables

Klik "Advanced" → Add Environment Variable:

- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `3000`
- [ ] `DB_HOST` = (dari Aiven)
- [ ] `DB_PORT` = (dari Aiven)
- [ ] `DB_USER` = (dari Aiven)
- [ ] `DB_PASSWORD` = (dari Aiven)
- [ ] `DB_NAME` = `db_inventaris`
- [ ] `JWT_SECRET` = (generate random string 32 karakter)
- [ ] `FRONTEND_URL` = `https://your-app.vercel.app` (isi setelah deploy frontend)

**Generate JWT_SECRET**:
```bash
# Option 1: Online
# https://randomkeygen.com/

# Option 2: PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

### Deploy

- [ ] Klik "Create Web Service"
- [ ] Tunggu deployment selesai (~3-5 menit)
- [ ] **COPY URL Render**: `https://sistem-inventaris-api.onrender.com`
- [ ] Test endpoint:
  ```bash
  curl https://sistem-inventaris-api.onrender.com/
  # Should return: {"success":true,"message":"..."}
  ```

**Simpan URL Render** untuk Step 3!

---

## 🎨 Step 3: Deploy Frontend ke Vercel (15 menit)

### Update API Configuration

- [ ] Edit `frontend/public/js/config.js`
- [ ] Ganti URL Render:
  ```javascript
  API_BASE_URL: '...'
    : 'https://sistem-inventaris-api.onrender.com/api'
  ```
- [ ] Commit & push:
  ```bash
  git add frontend/public/js/config.js
  git commit -m "Update API URL for production"
  git push origin main
  ```

### Deploy to Vercel

- [ ] Login ke [Vercel Dashboard](https://vercel.com/dashboard)
- [ ] Klik "Add New..." → "Project"
- [ ] Import: `IanSapury/sistem-inventaris`
- [ ] Configure:
  - [ ] Framework Preset: **Other**
  - [ ] Root Directory: **`frontend`** ← Klik "Edit" dan pilih folder
  - [ ] Build Command: (kosongkan)
  - [ ] Output Directory: `public`
  - [ ] Install Command: (kosongkan)
- [ ] Klik "Deploy"
- [ ] Tunggu deployment selesai (~1-2 menit)
- [ ] **COPY URL Vercel**: `https://your-app.vercel.app`

**Simpan URL Vercel** untuk Step 4!

---

## 🔗 Step 4: Connect Frontend & Backend (5 menit)

### Update CORS di Backend

- [ ] Kembali ke Render Dashboard
- [ ] Pilih service `sistem-inventaris-api`
- [ ] Tab "Environment"
- [ ] Edit `FRONTEND_URL`:
  ```
  FRONTEND_URL=https://your-app.vercel.app
  ```
  (tanpa trailing slash!)
- [ ] Save (service akan auto-restart ~30 detik)

---

## ✨ Step 5: Testing (10 menit)

### Test Frontend

- [ ] Buka URL Vercel: `https://your-app.vercel.app`
- [ ] Halaman login muncul dengan benar
- [ ] Tidak ada error di browser console (F12)

### Test Authentication

- [ ] Login dengan Admin:
  - Username: `admin`
  - Password: `password123`
- [ ] Redirect ke dashboard
- [ ] Dashboard load data dari API (tidak error)

### Test CRUD Operations

- [ ] **Data Barang**:
  - [ ] List barang muncul
  - [ ] Search barang berfungsi
  - [ ] Tambah barang baru
  - [ ] Edit barang
  - [ ] Hapus barang
  
- [ ] **Transaksi Masuk**:
  - [ ] List transaksi muncul
  - [ ] Tambah transaksi masuk
  - [ ] Stok barang bertambah

- [ ] **POS (Kasir)**:
  - [ ] Logout, login sebagai kasir1
  - [ ] List produk muncul
  - [ ] Add to cart
  - [ ] Checkout berhasil
  - [ ] Stok berkurang

### Test Dashboard

- [ ] Login sebagai admin
- [ ] Dashboard menampilkan:
  - [ ] Total pendapatan
  - [ ] Total stok
  - [ ] Jumlah transaksi
  - [ ] Chart transaksi 7 hari
  - [ ] Top 5 produk

### Browser Compatibility

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (jika ada)
- [ ] Mobile browser

---

## 🚨 Step 6: Troubleshooting (Jika Ada Masalah)

### CORS Error

**Gejala**: Console error "blocked by CORS policy"

**Fix**:
- [ ] Check `FRONTEND_URL` di Render = URL Vercel (exact match)
- [ ] Restart Render service
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard reload (Ctrl+F5)

### Backend Not Responding

**Gejala**: API calls timeout atau 502 error

**Fix**:
- [ ] Check Render logs untuk error
- [ ] Verify database credentials di Render environment
- [ ] Test database connection dari local
- [ ] Wait 30 seconds (cold start Render free tier)

### Database Connection Failed

**Gejala**: "ER_ACCESS_DENIED_ERROR" di Render logs

**Fix**:
- [ ] Double-check DB credentials di Render
- [ ] Test connection:
  ```bash
  mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p
  ```
- [ ] Check Aiven service status (should be "Running")

### Login Failed

**Gejala**: "Invalid credentials" padahal password benar

**Fix**:
- [ ] Verify schema.sql sudah di-import
- [ ] Check users table:
  ```sql
  SELECT username, role FROM users;
  ```
- [ ] Try other users (kasir1, kasir2)

---

## 🎯 Step 7: Monitoring (Optional tapi Recommended)

### Setup Uptime Monitor

**Render free tier sleep setelah 15 menit. Gunakan uptime monitor untuk keep alive.**

- [ ] Sign up di [UptimeRobot](https://uptimerobot.com/) (gratis)
- [ ] Add New Monitor:
  - Type: HTTP(s)
  - URL: `https://sistem-inventaris-api.onrender.com/`
  - Interval: **5 minutes**
- [ ] Save
- [ ] Monitor akan ping backend setiap 5 menit (prevents sleep)

### Check Render Logs

- [ ] Render Dashboard → Service → Logs
- [ ] Monitor untuk errors atau warnings
- [ ] Verify requests dari frontend masuk

---

## 📝 Step 8: Documentation

### Update README (Optional)

- [ ] Add live demo link ke README
  ```markdown
  ## 🌐 Live Demo
  
  **Frontend**: https://your-app.vercel.app
  **Backend API**: https://sistem-inventaris-api.onrender.com
  
  **Test Credentials**:
  - Admin: admin / password123
  - Kasir: kasir1 / password123
  ```

### Share Project

- [ ] GitHub repository URL
- [ ] Live demo URL
- [ ] Screenshots (optional)
- [ ] Add to portfolio

---

## ✅ Deployment Complete!

Congratulations! 🎉 Aplikasi Anda sekarang LIVE dan bisa diakses dari mana saja!

### Summary

- ✅ Database: Aiven MySQL (Free)
- ✅ Backend: Render (Free)
- ✅ Frontend: Vercel (Free)
- ✅ Total Cost: **$0/bulan** 💰

### Important URLs

```
Frontend:  https://your-app.vercel.app
Backend:   https://sistem-inventaris-api.onrender.com
Database:  mysql-xxx.aivencloud.com:12345
GitHub:    https://github.com/IanSapury/sistem-inventaris
```

### Maintenance

- **Update code**: Push ke GitHub → Auto-deploy di Vercel & Render
- **Monitor**: Check Render logs & Vercel analytics
- **Database backup**: Aiven auto-backup daily (free tier: 2 days retention)

---

## 📞 Need Help?

- **Detailed Guide**: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- **Git Commands**: [GIT_COMMANDS.md](./GIT_COMMANDS.md)
- **Local Setup**: [QUICK_START.md](./QUICK_START.md)
- **GitHub Issues**: https://github.com/IanSapury/sistem-inventaris/issues

---

**Happy Deploying! 🚀**
