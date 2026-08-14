# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan project secara lokal.

---

## 🎯 Prerequisites

- Node.js >= 18.x ([Download](https://nodejs.org/))
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
```

**Edit `backend/.env`**:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=db_inventaris

JWT_SECRET=your-secret-key-here
```

### 4. Run Application

```bash
# Dari folder backend
npm run dev
```

**Access**: `http://localhost:3000`

✅ Backend running!  
✅ Frontend served automatically!

---

## 👥 Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `password123` |
| Kasir | `kasir1` | `password123` |

---

## 🔧 Development Tips

### Watch Mode (Auto-reload)
```bash
cd backend
npm run dev
```

### Test API Directly
```bash
# Health check
curl http://localhost:3000/api

# Login test
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password123"}'
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL service running
# Windows: services.msc → MySQL → Start

# Verify credentials in .env
DB_PASSWORD=your_actual_password
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Frontend Not Loading
- Check console output for static files path
- Verify folder `frontend/public/` exists
- Check browser console (F12) for errors

---

## 📚 Next Steps

- ✅ Development lokal berjalan
- ✅ Test semua fitur (CRUD, POS, Dashboard)
- ✅ Ready untuk deploy ke Railway

📖 **Deploy ke Railway**: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

---

**Happy Coding! 🎉**
