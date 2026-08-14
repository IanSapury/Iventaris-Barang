# 📦 Sistem Inventaris Barang

Aplikasi full-stack CRUD Sistem Inventaris dengan Point of Sale (POS) menggunakan Node.js, Express, MySQL, dan Vanilla JavaScript.

## ✨ Features

- 🔐 **Authentication & Authorization** (JWT-based)
  - Multi-role: Admin (full access) & Kasir (POS only)
- 📊 **Admin Dashboard**
  - Real-time analytics dengan Chart.js
  - Monitoring stok & transaksi
- 📦 **Manajemen Barang**
  - CRUD lengkap dengan search & filter
  - Kategori & tracking stok otomatis
- 📥 **Transaksi Masuk & Keluar**
  - Recording & history lengkap
  - Auto-update stok
- 🛒 **Point of Sale (POS)**
  - Interface modern untuk kasir
  - Shopping cart & auto-calculate
  - Stock validation & receipt generation

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- MySQL (with connection pool)
- JWT Authentication
- bcrypt Password Hashing

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Bootstrap 5 + Bootstrap Icons
- Chart.js for analytics

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js >= 18.x
- MySQL >= 5.7

### 1. Clone & Install
```bash
git clone https://github.com/IanSapury/sistem-inventaris.git
cd sistem-inventaris
cd backend
npm install
```

### 2. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Create database
CREATE DATABASE db_inventaris;
USE db_inventaris;

# Import schema
SOURCE schema.sql;
EXIT;
```

### 3. Configure Environment
```bash
cd backend
cp .env.example .env
# Edit .env dengan kredensial MySQL Anda
```

**Minimal `.env`**:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_inventaris
JWT_SECRET=your-secret-key
```

### 4. Run Application
```bash
cd backend
npm run dev
```

**Access**: `http://localhost:3000`

**Login**:
- Admin: `admin` / `password123`
- Kasir: `kasir1` / `password123`

📖 **Panduan lengkap**: [QUICK_START.md](./QUICK_START.md)

## 🚂 Deploy to Railway

Project ini sudah siap deploy ke Railway dengan struktur monorepo.

### Quick Deploy Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Railway Dashboard**
   - Login: https://railway.app/
   - New Project → Deploy from GitHub
   - Select: `IanSapury/sistem-inventaris`

3. **Add MySQL Database**
   - Add MySQL plugin
   - Import `backend/schema.sql`

4. **Done!** ✅
   - Railway auto-deploy dari root
   - URL: `https://your-app.up.railway.app`

📖 **Panduan deployment lengkap**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 📁 Project Structure

```
sistem-inventaris/
├── package.json          # Root entry point (Railway)
├── railway.toml          # Railway config
├── nixpacks.toml         # Nixpacks config
│
├── backend/              # API Server
│   ├── config/           # Database & config
│   ├── middleware/       # Auth middleware
│   ├── routes/           # API routes
│   ├── server.js         # Entry point
│   ├── schema.sql        # Database schema
│   └── package.json      # Backend dependencies
│
└── frontend/             # Static Files
    └── public/
        ├── css/          # Stylesheets
        ├── js/           # JavaScript
        └── *.html        # Pages
```

## 🔐 Default Users

Schema SQL sudah include user default:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Kasir | `kasir1` | `password123` |
| Kasir | `kasir2` | `password123` |

## 📚 Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Development lokal step-by-step
- **[RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)** - Deploy ke Railway
- **[backend/README.md](./backend/README.md)** - Backend documentation
- **[frontend/README.md](./frontend/README.md)** - Frontend documentation

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Barang (Items)
- `GET /api/barang` - Get all items
- `GET /api/barang/search?q=keyword` - Search items
- `POST /api/barang` - Create item
- `PUT /api/barang/:id` - Update item
- `DELETE /api/barang/:id` - Delete item

### Kategori (Categories)
- `GET /api/kategori` - Get all categories
- `POST /api/kategori` - Create category

### Transaksi (Transactions)
- `GET /api/transaksi/masuk` - Get incoming transactions
- `POST /api/transaksi/masuk` - Create incoming transaction
- `GET /api/transaksi/keluar` - Get outgoing transactions
- `POST /api/transaksi/keluar` - Create outgoing transaction
- `GET /api/transaksi/stats` - Get statistics

## 🔒 Security

- ✅ Password hashing dengan bcrypt
- ✅ JWT-based authentication
- ✅ SQL injection protection (parameterized queries)
- ✅ Environment variables untuk credentials
- ✅ Role-based access control (RBAC)

## 💰 Railway Pricing

Railway menyediakan **$5 credit gratis/bulan** yang cukup untuk:
- 1 web app (Node.js)
- 1 MySQL database
- Hobby/personal projects

Estimasi usage: ~$5/month untuk small projects.

## 🐛 Troubleshooting

### Local Development
- **Database connection error**: Check `.env` credentials
- **Port already in use**: Change `PORT` in `.env`
- **Frontend tidak muncul**: Check `backend/server.js` static path

### Railway Deployment
- **Build failed**: Check root `package.json` exists
- **Database error**: Verify MySQL plugin added
- **404 errors**: Check static files path in logs

📖 **Full troubleshooting**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

## 👨‍💻 Author

**Ian Sapury**
- GitHub: [@IanSapury](https://github.com/IanSapury)

## 📄 License

MIT License - Silakan gunakan untuk keperluan apapun

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, mohon buat issue terlebih dahulu.

## 📞 Support

Jika ada pertanyaan atau issue:
1. Baca dokumentasi ([QUICK_START.md](./QUICK_START.md) atau [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md))
2. Buat [GitHub Issue](https://github.com/IanSapury/sistem-inventaris/issues)

---

**Happy Coding! 🚀**

*Sistem ini ready untuk Railway deployment - push to GitHub and deploy in minutes!*
