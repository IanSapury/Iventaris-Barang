# 🚀 Panduan Deployment Complete

Panduan lengkap untuk deploy aplikasi Sistem Inventaris ke cloud **GRATIS** menggunakan:
- **Frontend**: Vercel
- **Backend**: Render
- **Database**: Aiven / TiDB Cloud

---

## 📋 Checklist Sebelum Deploy

- [ ] Akun GitHub sudah dibuat
- [ ] Repository sudah di-push ke GitHub
- [ ] Akun Vercel sudah dibuat (login dengan GitHub)
- [ ] Akun Render sudah dibuat
- [ ] Akun Aiven/TiDB Cloud sudah dibuat
- [ ] Database schema sudah siap (schema.sql)

---

## 1️⃣ Setup Database MySQL (Aiven/TiDB)

### Option A: Aiven (Recommended)

1. **Buka [Aiven Console](https://console.aiven.io/)**
2. **Buat Service Baru**:
   - Klik "Create Service"
   - Pilih **MySQL**
   - Pilih **Free Plan** (1GB storage, 5GB bandwidth/bulan)
   - Pilih **Region**: Singapore (terdekat dengan Indonesia)
   - Service name: `mysql-inventaris`
   - Klik "Create Service"

3. **Tunggu Service Aktif** (~5-10 menit)
   - Status akan berubah dari "Rebuilding" → "Running"

4. **Copy Connection Details**:
   - Klik service yang sudah dibuat
   - Tab "Overview", copy:
     ```
     Host: mysql-inventaris-xxxx.aivencloud.com
     Port: 12345
     User: avnadmin
     Password: xxxxxxxxxxxxxxxx
     Database: defaultdb
     ```

5. **Import Database Schema**:
   
   **Via MySQL CLI** (Recommended):
   ```bash
   cd backend
   
   # Login ke MySQL Aiven
   mysql -h mysql-inventaris-xxxx.aivencloud.com \
         -P 12345 \
         -u avnadmin \
         -p \
         --ssl-mode=REQUIRED
   
   # Buat database baru
   CREATE DATABASE db_inventaris;
   USE db_inventaris;
   
   # Import schema
   SOURCE schema.sql;
   
   # Verify
   SHOW TABLES;
   ```
   
   **Via MySQL Workbench** (GUI):
   - Buat koneksi baru dengan detail dari Aiven
   - Enable SSL/TLS
   - Connect dan import `schema.sql`

### Option B: TiDB Cloud

1. **Buka [TiDB Cloud Console](https://tidbcloud.com/)**
2. **Create Free Cluster**:
   - Klik "Create Cluster"
   - Pilih **Serverless Tier** (Free)
   - Region: `us-west-2` atau terdekat
   - Cluster name: `inventaris-db`
   
3. **Get Connection String**:
   - Klik cluster → "Connect"
   - Copy MySQL connection string
   
4. **Import Schema**:
   ```bash
   mysql -h gateway01.us-west-2.prod.aws.tidbcloud.com \
         -P 4000 \
         -u xxxxx.root \
         -p \
         -D test \
         --ssl-mode=VERIFY_IDENTITY \
         --ssl-ca=/path/to/ca.pem
   
   # Import schema
   SOURCE backend/schema.sql;
   ```

---

## 2️⃣ Deploy Backend ke Render

### A. Prepare Repository

**PENTING**: Pastikan struktur folder sudah benar:
```
sistem-inventaris/
├── backend/           # ✅ Semua file backend di sini
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/          # ✅ Semua file frontend di sini
```

### B. Push ke GitHub

```bash
# Di root project
git add .
git commit -m "Prepare for deployment"
git push origin main
```

### C. Deploy di Render

1. **Buka [Render Dashboard](https://dashboard.render.com/)**

2. **Create New Web Service**:
   - Klik "New +" → "Web Service"
   - Klik "Connect account" (pilih GitHub)
   - Pilih repository: `IanSapury/sistem-inventaris`
   - Klik "Connect"

3. **Konfigurasi Web Service**:
   ```
   Name: sistem-inventaris-api
   Region: Singapore
   Branch: main
   Root Directory: backend          ← PENTING!
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Environment Variables**:
   
   Klik "Advanced" → "Add Environment Variable":
   
   | Key | Value | Keterangan |
   |-----|-------|------------|
   | `NODE_ENV` | `production` | Environment mode |
   | `PORT` | `3000` | Port default |
   | `DB_HOST` | `mysql-xxx.aivencloud.com` | Dari Aiven/TiDB |
   | `DB_PORT` | `12345` | Port MySQL |
   | `DB_USER` | `avnadmin` | Username MySQL |
   | `DB_PASSWORD` | `your-password` | Password MySQL |
   | `DB_NAME` | `db_inventaris` | Nama database |
   | `JWT_SECRET` | `random-secret-key-here` | Generate random string |
   | `FRONTEND_URL` | `https://your-app.vercel.app` | Isi setelah deploy frontend |

   **Generate JWT_SECRET**:
   ```bash
   # Linux/Mac
   openssl rand -base64 32
   
   # Windows PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   
   # Atau gunakan online: https://randomkeygen.com/
   ```

5. **Create Web Service**:
   - Klik "Create Web Service"
   - Tunggu deployment selesai (~3-5 menit)
   - Anda akan mendapat URL: `https://sistem-inventaris-api.onrender.com`

6. **Test Backend**:
   ```bash
   # Test health check
   curl https://sistem-inventaris-api.onrender.com/
   
   # Should return:
   # {"success":true,"message":"Sistem Inventaris API berjalan","version":"1.0.0"}
   ```

### D. Update FRONTEND_URL di Render

1. Kembali ke Render Dashboard
2. Pilih service `sistem-inventaris-api`
3. Tab "Environment"
4. Edit `FRONTEND_URL` dengan URL Vercel Anda (setelah deploy frontend)
5. Save changes (service akan auto-restart)

---

## 3️⃣ Deploy Frontend ke Vercel

### A. Update API URL di Config

**Edit `frontend/public/js/config.js`**:
```javascript
const CONFIG = {
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://sistem-inventaris-api.onrender.com/api' // ← Ganti dengan URL Render Anda
};
```

**Commit perubahan**:
```bash
git add frontend/public/js/config.js
git commit -m "Update API URL for production"
git push origin main
```

### B. Deploy via Vercel (Recommended)

1. **Buka [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Import Project**:
   - Klik "Add New..." → "Project"
   - Import dari GitHub: pilih `IanSapury/sistem-inventaris`
   - Klik "Import"

3. **Configure Project**:
   ```
   Framework Preset: Other
   Root Directory: frontend        ← PENTING! Klik "Edit" dan pilih "frontend"
   Build Command: (kosongkan)
   Output Directory: public
   Install Command: (kosongkan)
   ```

4. **Deploy**:
   - Klik "Deploy"
   - Tunggu deployment selesai (~1-2 menit)
   - Anda akan mendapat URL: `https://your-app.vercel.app`

5. **Test Frontend**:
   - Buka `https://your-app.vercel.app`
   - Coba login dengan:
     - Username: `admin`
     - Password: `password123`

### C. Deploy via Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend folder
cd frontend
vercel

# Follow prompts:
# - Setup and deploy: Y
# - Scope: Your account
# - Link to existing project: N
# - Project name: sistem-inventaris-frontend
# - Directory: ./ (current directory is frontend)
# - Override settings: N

# Production deployment
vercel --prod
```

---

## 4️⃣ Final Configuration

### A. Update CORS di Backend

Setelah mendapat URL Vercel, update `FRONTEND_URL` di Render:

1. Render Dashboard → Service → Environment
2. Edit `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-app.vercel.app
   ```
3. Save (auto-restart service)

### B. Test Integration

1. **Buka Frontend Vercel**:
   ```
   https://your-app.vercel.app
   ```

2. **Login**:
   - Username: `admin`
   - Password: `password123`

3. **Test Fitur**:
   - Dashboard → Lihat statistik
   - Data Barang → CRUD operations
   - POS → Test checkout

### C. Monitor Logs

**Backend Logs (Render)**:
- Render Dashboard → Service → Logs
- Lihat realtime logs untuk debugging

**Frontend Logs (Vercel)**:
- Vercel Dashboard → Project → Deployments → Latest → Logs

---

## 5️⃣ Performance Tips

### A. Prevent Render Cold Start

Service Render free tier akan "sleep" setelah 15 menit tidak ada traffic. Cold start pertama ~30 detik.

**Solusi: Gunakan Uptime Monitor (Gratis)**

1. **[UptimeRobot](https://uptimerobot.com/)** (Recommended):
   - Buat akun gratis
   - Add New Monitor:
     - Monitor Type: HTTP(s)
     - URL: `https://sistem-inventaris-api.onrender.com/`
     - Monitoring Interval: 5 minutes
   - Save

2. **[Cron-Job.org](https://cron-job.org/)**:
   - Buat cron job ping setiap 10 menit

### B. Optimize Database

**Index untuk performa query**:
```sql
-- Sudah ada di schema.sql, tapi verify:
SHOW INDEX FROM barang;
SHOW INDEX FROM transaksi_keluar;
```

### C. Enable Gzip di Render

Render secara otomatis enable Gzip compression untuk response.

---

## 🐛 Troubleshooting

### Issue: Backend CORS Error

**Gejala**: 
```
Access to fetch at 'https://sistem-inventaris-api.onrender.com/api/...' 
from origin 'https://your-app.vercel.app' has been blocked by CORS policy
```

**Solusi**:
1. Pastikan `FRONTEND_URL` di Render environment variables benar
2. Format: `https://your-app.vercel.app` (tanpa trailing slash `/`)
3. Save dan restart service
4. Clear browser cache dan reload

### Issue: Backend 502 Bad Gateway

**Gejala**: Backend tidak respond atau error 502

**Solusi**:
1. Check Render logs untuk error
2. Pastikan `PORT` di environment = `3000` atau hapus (default)
3. Pastikan database credentials benar
4. Test database connection dengan MySQL client

### Issue: Database Connection Failed

**Gejala**:
```
Error: ER_ACCESS_DENIED_ERROR: Access denied for user 'avnadmin'@'xxx.xxx.xxx.xxx'
```

**Solusi**:
1. Verify credentials di Render environment variables
2. Pastikan IP Render tidak di-block (Aiven allow all by default)
3. Test connection dengan MySQL Workbench dari local
4. Check Aiven/TiDB service status

### Issue: Frontend Load Lambat

**Gejala**: Halaman frontend lama loading

**Solusi**:
1. Check Network tab di browser DevTools
2. Pastikan assets (CSS, JS) sudah ter-cache
3. Vercel otomatis enable CDN, tapi bisa cek di Settings → Domains

### Issue: JWT Token Invalid

**Gejala**: Auto-logout atau "Unauthorized" error

**Solusi**:
1. Pastikan `JWT_SECRET` sama (tidak berubah)
2. Clear localStorage di browser:
   ```javascript
   localStorage.clear()
   ```
3. Login ulang

---

## 📊 Monitoring & Maintenance

### A. Check Backend Health

```bash
# Health check endpoint
curl https://sistem-inventaris-api.onrender.com/

# Test API endpoint
curl https://sistem-inventaris-api.onrender.com/api/kategori
```

### B. Database Maintenance

**Backup database** (Aiven):
1. Aiven Console → Service → Backups
2. Backups otomatis setiap hari (free tier: 2 hari retention)
3. Manual backup via mysqldump:
   ```bash
   mysqldump -h host -P port -u user -p db_inventaris > backup.sql
   ```

### C. Update Code

**Frontend Update**:
```bash
# Edit code di folder frontend/
git add frontend/
git commit -m "Update frontend"
git push origin main

# Vercel otomatis re-deploy saat ada push ke GitHub
```

**Backend Update**:
```bash
# Edit code di folder backend/
git add backend/
git commit -m "Update backend"
git push origin main

# Render otomatis re-deploy saat ada push ke GitHub
```

---

## 📝 Checklist Setelah Deploy

- [ ] Backend health check return success
- [ ] Frontend bisa diakses tanpa error
- [ ] Login berhasil (admin & kasir)
- [ ] Dashboard load dengan data yang benar
- [ ] CRUD barang berfungsi
- [ ] POS checkout berhasil
- [ ] Transaksi tersimpan di database
- [ ] CORS tidak ada error di browser console
- [ ] Uptime monitor sudah di-setup (optional tapi recommended)

---

## 🎉 Selesai!

Aplikasi Anda sekarang sudah LIVE dan bisa diakses dari mana saja!

**URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://sistem-inventaris-api.onrender.com`
- Database: Aiven/TiDB Cloud

**Share aplikasi Anda**:
- Beri link frontend ke user
- Default credentials ada di info box login page

---

## 🆘 Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Aiven Docs**: https://docs.aiven.io/
- **GitHub Issues**: https://github.com/IanSapury/sistem-inventaris/issues

---

**Good luck! 🚀**
