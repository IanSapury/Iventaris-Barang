# Backend - Sistem Inventaris Barang

Backend API aplikasi Sistem Inventaris menggunakan Node.js, Express, dan MySQL.

## 🚀 Deployment ke Render

### Langkah-langkah:

1. **Buka [Render Dashboard](https://dashboard.render.com/)**

2. **Klik "New +" → "Web Service"**

3. **Connect GitHub Repository**:
   - Pilih repository: `IanSapury/sistem-inventaris`
   - Klik "Connect"

4. **Konfigurasi Web Service**:
   - **Name**: `sistem-inventaris-api` (atau nama lain)
   - **Region**: Singapore (terdekat)
   - **Branch**: `main` atau `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. **Environment Variables** (klik "Advanced" → "Add Environment Variable"):
   ```
   NODE_ENV=production
   PORT=3000
   DB_HOST=<your-aiven-or-tidb-host>
   DB_PORT=3306
   DB_USER=<your-db-username>
   DB_PASSWORD=<your-db-password>
   DB_NAME=db_inventaris
   JWT_SECRET=<generate-random-secret-key>
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

6. **Klik "Create Web Service"**

7. Tunggu deploy selesai (~2-5 menit). Anda akan mendapat URL seperti:
   ```
   https://sistem-inventaris-api.onrender.com
   ```

### ⚠️ Penting untuk Free Tier Render:

- Service akan "sleep" setelah 15 menit tidak ada request
- Cold start pertama akan memakan waktu ~30 detik
- Untuk menghindari, gunakan uptime monitoring seperti [UptimeRobot](https://uptimerobot.com/) (gratis) untuk ping setiap 5 menit

## 🗄️ Setup Database MySQL (Aiven/TiDB)

### Option 1: Aiven (Recommended)

1. Buka [Aiven Console](https://console.aiven.io/)
2. Buat service MySQL baru (Free tier: 1GB storage)
3. Tunggu service aktif (~5 menit)
4. Copy connection details (Host, Port, User, Password)
5. Connect dengan MySQL client dan import `schema.sql`

### Option 2: TiDB Cloud

1. Buka [TiDB Cloud](https://tidbcloud.com/)
2. Buat cluster baru (Free tier: Serverless)
3. Copy connection string
4. Import `schema.sql` via MySQL client

### Import Database Schema:

```bash
# Via MySQL CLI
mysql -h <DB_HOST> -P <DB_PORT> -u <DB_USER> -p<DB_PASSWORD> <DB_NAME> < schema.sql

# Atau via phpMyAdmin / MySQL Workbench
# Copy-paste isi schema.sql dan execute
```

## 📁 Struktur File

```
backend/
├── config/
│   └── db.js          # Database connection pool
├── middleware/
│   └── auth.js        # JWT authentication middleware
├── routes/
│   ├── auth.js        # Authentication routes
│   ├── barang.js      # Barang (items) routes
│   ├── kategori.js    # Kategori routes
│   └── transaksi.js   # Transaksi routes
├── .env.example       # Environment variables template
├── .gitignore
├── package.json
├── schema.sql         # Database schema
├── server.js          # Main entry point
└── README.md
```

## 🔧 Development Lokal

### 1. Install Dependencies:
```bash
cd backend
npm install
```

### 2. Setup Environment:
```bash
# Copy .env.example menjadi .env
cp .env.example .env

# Edit .env dengan kredensial database lokal Anda
```

### 3. Buat Database:
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE db_inventaris;

# Import schema
USE db_inventaris;
SOURCE schema.sql;
```

### 4. Jalankan Server:
```bash
# Development (dengan auto-reload)
npm run dev

# Production
npm start
```

Server akan berjalan di `http://localhost:3000`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Registrasi user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Barang (Items)
- `GET /api/barang` - Get all items
- `GET /api/barang/:id` - Get item by ID
- `GET /api/barang/search?q=keyword` - Search items
- `POST /api/barang` - Create new item
- `PUT /api/barang/:id` - Update item
- `DELETE /api/barang/:id` - Delete item

### Kategori (Categories)
- `GET /api/kategori` - Get all categories
- `POST /api/kategori` - Create category

### Transaksi (Transactions)
- `GET /api/transaksi/masuk` - Get all incoming transactions
- `POST /api/transaksi/masuk` - Create incoming transaction
- `GET /api/transaksi/keluar` - Get all outgoing transactions
- `POST /api/transaksi/keluar` - Create outgoing transaction
- `GET /api/transaksi/stats` - Get transaction statistics

## 🔐 Security

- Passwords di-hash menggunakan bcrypt
- Authentication menggunakan JWT (JSON Web Tokens)
- CORS dikonfigurasi untuk frontend URL yang spesifik
- SQL injection protection via parameterized queries (mysql2)

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` atau `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | MySQL host | `mysql-xxx.aivencloud.com` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_USER` | MySQL username | `avnadmin` |
| `DB_PASSWORD` | MySQL password | `your-password` |
| `DB_NAME` | Database name | `db_inventaris` |
| `JWT_SECRET` | JWT secret key | `random-secret-key-here` |
| `FRONTEND_URL` | Frontend URL untuk CORS | `https://your-app.vercel.app` |

## 🐛 Troubleshooting

### Database connection failed
- Pastikan kredensial database di `.env` benar
- Cek apakah IP Render sudah di-whitelist di database (Aiven/TiDB biasanya allow all)
- Test koneksi dengan MySQL client terlebih dahulu

### CORS errors
- Pastikan `FRONTEND_URL` di environment Render sesuai dengan URL Vercel
- Update backend CORS settings jika perlu

### Server not responding
- Render free tier sleep setelah 15 menit. Cold start pertama ~30 detik
- Check logs di Render dashboard

## 📦 Dependencies

- `express` - Web framework
- `mysql2` - MySQL client dengan Promise support
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT authentication
- `cors` - CORS middleware
- `dotenv` - Environment variables loader
- `cookie-parser` - Cookie parsing middleware
