# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan project secara lokal.

---

## 🎯 Prerequisites

- Node.js >= 14.x ([Download](https://nodejs.org/))
- MySQL >= 5.7 ([Download](https://dev.mysql.com/downloads/))
- Git ([Download](https://git-scm.com/))

---

## 📦 Installation

### 1. Clone Repository

```bash
git clone https://github.com/IanSapury/sistem-inventaris.git
cd sistem-inventaris
```

### 2. Setup Database

**Buat database MySQL**:
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE db_inventaris;
USE db_inventaris;

# Import schema
SOURCE backend/schema.sql;

# Verify
SHOW TABLES;

# Exit
EXIT;
```

### 3. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env (gunakan editor favorit)
# Update DB_PASSWORD dengan password MySQL Anda
```

**Edit `backend/.env`**:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here    ← Ganti dengan password Anda
DB_NAME=db_inventaris

JWT_SECRET=inventaris-secret-key-2026
FRONTEND_URL=http://localhost:8000
```

**Run backend**:
```bash
npm run dev
```

Backend sekarang berjalan di `http://localhost:3000` ✅

### 4. Setup Frontend

**Buka terminal baru**:

```bash
cd frontend/public

# Option 1: Python (jika sudah install Python)
python -m http.server 8000

# Option 2: Node.js http-server
npx http-server -p 8000

# Option 3: VS Code Live Server Extension
# Klik kanan login.html → "Open with Live Server"
```

Frontend sekarang berjalan di `http://localhost:8000` ✅

---

## 🚀 Akses Aplikasi

1. **Buka browser**: `http://localhost:8000`
2. **Login dengan**:
   - **Admin**:
     - Username: `admin`
     - Password: `password123`
   - **Kasir**:
     - Username: `kasir1`
     - Password: `password123`

---

## 🎨 Development Workflow

### Backend Development

```bash
cd backend
npm run dev    # Auto-reload dengan nodemon
```

**Test API**:
```bash
# Health check
curl http://localhost:3000/

# Get kategori
curl http://localhost:3000/api/kategori

# Login (test)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

### Frontend Development

Edit files di `frontend/public/`:
- `*.html` - HTML pages
- `css/*.css` - Stylesheets
- `js/*.js` - JavaScript files

**Reload browser** untuk lihat perubahan.

---

## 📁 Project Structure

```
sistem-inventaris/
├── backend/                  # Node.js + Express API
│   ├── config/
│   │   └── db.js            # Database connection
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── routes/
│   │   ├── auth.js          # Authentication
│   │   ├── barang.js        # Items CRUD
│   │   ├── kategori.js      # Categories
│   │   └── transaksi.js     # Transactions
│   ├── .env.example         # Environment template
│   ├── .nvmrc               # Node version
│   ├── package.json
│   ├── schema.sql           # Database schema
│   └── server.js            # Entry point
│
├── frontend/                 # Static HTML/CSS/JS
│   ├── public/
│   │   ├── css/             # Stylesheets
│   │   ├── js/
│   │   │   ├── config.js    # ⭐ API URL config
│   │   │   ├── api.js       # API wrapper
│   │   │   ├── auth.js      # Auth utilities
│   │   │   └── ...
│   │   ├── login.html       # Login page
│   │   ├── dashboard.html   # Admin dashboard
│   │   ├── pos.html         # Kasir POS
│   │   └── ...
│   ├── vercel.json          # Vercel config
│   └── package.json
│
├── .gitignore
├── README.md                 # Project overview
├── QUICK_START.md            # This file
└── DEPLOYMENT_GUIDE.md       # Cloud deployment guide
```

---

## 🔧 Common Issues

### Issue: `npm install` gagal

**Solusi**:
```bash
# Clear npm cache
npm cache clean --force

# Try install again
npm install
```

### Issue: Database connection error

**Gejala**:
```
❌ Gagal terhubung ke database: ER_ACCESS_DENIED_ERROR
```

**Solusi**:
1. Check MySQL service sudah berjalan
2. Verify password di `.env` benar
3. Test connection:
   ```bash
   mysql -u root -p
   # Masukkan password
   ```

### Issue: Port 3000 already in use

**Solusi**:
```bash
# Ganti port di .env
PORT=3001
```

### Issue: CORS error di browser

**Solusi**:
1. Pastikan backend berjalan di port yang benar
2. Check `frontend/public/js/config.js`:
   ```javascript
   API_BASE_URL: 'http://localhost:3000/api'
   ```

---

## 📖 Next Steps

- ✅ **Development**: Edit code di folder backend/frontend
- ✅ **Testing**: Test semua fitur (CRUD, POS, Dashboard)
- ✅ **Deployment**: Ikuti [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk deploy ke cloud

---

## 🆘 Need Help?

- Baca [README.md](./README.md) untuk fitur lengkap
- Baca [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) untuk deployment
- Buat [GitHub Issue](https://github.com/IanSapury/sistem-inventaris/issues) jika ada masalah

---

**Happy Coding! 🎉**
