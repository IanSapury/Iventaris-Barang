# 📦 Sistem Inventaris Barang

Aplikasi CRUD Sistem Inventaris Barang dengan fitur Point of Sale (POS) menggunakan Node.js, Express, MySQL, dan Vanilla JavaScript.

## 🏗️ Arsitektur (Monorepo)

Project ini menggunakan **monorepo structure** dengan pemisahan frontend dan backend untuk deployment terpisah:

```
sistem-inventaris/
├── frontend/          # Static files (HTML, CSS, JS) → Deploy ke Vercel
│   ├── public/
│   │   ├── css/
│   │   ├── js/
│   │   └── *.html
│   ├── vercel.json
│   └── README.md
│
├── backend/           # Node.js + Express API → Deploy ke Render
│   ├── config/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   ├── schema.sql
│   └── README.md
│
└── README.md          # This file
```

## 🚀 Deployment Stack (FREE!)

| Component | Platform | Tier | Keterangan |
|-----------|----------|------|------------|
| **Frontend** | [Vercel](https://vercel.com) | Free | Static site hosting |
| **Backend** | [Render](https://render.com) | Free | Node.js hosting (sleep after 15min) |
| **Database** | [Aiven](https://aiven.io) / [TiDB Cloud](https://tidbcloud.com) | Free | MySQL cloud (1GB) |

## ⚡ Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/IanSapury/sistem-inventaris.git
cd sistem-inventaris
```

### 2. Setup Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan kredensial database Anda
npm run dev
```

Backend akan berjalan di `http://localhost:3000`

### 3. Setup Frontend

```bash
cd frontend/public
# Gunakan live server atau:
python -m http.server 8000
# Atau
npx http-server -p 8000
```

Frontend akan berjalan di `http://localhost:8000`

**Penting**: Update `frontend/public/js/config.js` untuk development:
```javascript
API_BASE_URL: 'http://localhost:3000/api'
```

## 📚 Dokumentasi Deployment

Untuk deployment ke production (Vercel + Render + Cloud MySQL), silakan baca:

- **[Frontend Deployment Guide](./frontend/README.md)** - Deploy ke Vercel
- **[Backend Deployment Guide](./backend/README.md)** - Deploy ke Render & Setup Database MySQL Cloud

## ✨ Fitur

### 🔐 Authentication & Authorization
- Login sistem dengan JWT tokens
- Multi-role: **Admin** (full access) dan **Kasir** (POS only)
- Session management dengan cookie

### 👨‍💼 Admin Features
- **Dashboard Analytics**
  - Real-time statistics (pendapatan, stok, transaksi)
  - Charts analytics (Chart.js)
  - Monitoring stok rendah
  
- **Manajemen Barang**
  - CRUD barang lengkap
  - Filter & search real-time
  - Kategori produk
  - Tracking stok otomatis

- **Transaksi Masuk & Keluar**
  - Pencatatan transaksi masuk/keluar
  - Auto-update stok
  - History lengkap

### 🛒 Kasir Features
- **Point of Sale (POS)**
  - Interface modern & user-friendly
  - Shopping cart real-time
  - Auto-calculate & validasi stok
  - Generate nomor transaksi otomatis

## 🛠️ Tech Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Bootstrap 5 (UI Framework)
- Chart.js (Data visualization)

### Backend
- Node.js + Express.js
- MySQL (Database)
- JWT (Authentication)
- bcrypt (Password hashing)

### Libraries
- `express` - Web framework
- `mysql2` - MySQL client
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `jsonwebtoken` - JWT authentication
- `cookie-parser` - Cookie parsing

## 👥 Default Users

Schema SQL sudah menyediakan user default:

### Admin
- **Username**: `admin`
- **Password**: `password123`
- **Access**: Full (Dashboard, CRUD, History, Reports)

### Kasir
- **Username**: `kasir1` / `kasir2`
- **Password**: `password123`
- **Access**: POS Only

## 🔐 Security

- ✅ Password hashing dengan bcrypt
- ✅ JWT-based authentication
- ✅ CORS configuration
- ✅ SQL injection protection (parameterized queries)
- ✅ Environment variables untuk kredensial sensitif
- ✅ HTTP-only cookies
- ✅ Role-based access control (RBAC)

## 📱 User Guide

### Login
1. Buka URL frontend Anda
2. Masukkan username & password
3. Sistem akan auto-redirect:
   - **Admin** → Dashboard
   - **Kasir** → POS

### Admin - Dashboard
- Lihat statistik real-time
- Monitor stok rendah
- Analisis penjualan dengan charts

### Kasir - Point of Sale
1. Pilih produk dari grid
2. Produk masuk ke cart otomatis
3. Adjust quantity jika perlu
4. Checkout dan proses pembayaran

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Barang
- `GET /api/barang` - Get all products
- `GET /api/barang/search?q=keyword` - Search products
- `POST /api/barang` - Create product
- `PUT /api/barang/:id` - Update product
- `DELETE /api/barang/:id` - Delete product

### Kategori
- `GET /api/kategori` - Get all categories
- `POST /api/kategori` - Create category

### Transaksi
- `GET /api/transaksi/masuk` - Get incoming transactions
- `POST /api/transaksi/masuk` - Create incoming transaction
- `GET /api/transaksi/keluar` - Get outgoing transactions
- `POST /api/transaksi/keluar` - Create outgoing transaction
- `GET /api/transaksi/stats` - Get dashboard statistics

## 🐛 Troubleshooting

### Development Lokal

**Database Connection Error:**
```bash
# Check MySQL service & verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
```

**Port Already in Use:**
```bash
# Change port in .env
PORT=3001
```

### Production (Render/Vercel)

**CORS Error:**
- Pastikan `FRONTEND_URL` di Render environment variables sesuai dengan URL Vercel Anda
- Format: `https://your-app.vercel.app` (tanpa trailing slash)

**Backend Not Responding (Render Free Tier):**
- Service sleep setelah 15 menit tidak ada request
- Cold start pertama memakan waktu ~30 detik
- Gunakan [UptimeRobot](https://uptimerobot.com/) untuk ping berkala

**Database Connection Failed (Cloud MySQL):**
- Pastikan kredensial database di Render environment benar
- Aiven/TiDB biasanya allow all IPs, tapi cek whitelist jika perlu
- Test koneksi dengan MySQL client terlebih dahulu

## 📈 Future Enhancements

- [ ] Export laporan ke Excel/PDF
- [ ] Barcode scanner integration
- [ ] Email notifications
- [ ] Advanced reporting & analytics
- [ ] Mobile app (React Native)
- [ ] Multi-warehouse support

## 👨‍💻 Author

**Ian Sapury**
- GitHub: [@IanSapury](https://github.com/IanSapury)

## 📄 License

MIT License - Silakan gunakan untuk keperluan apapun

## 🤝 Contributing

Pull requests are welcome! Untuk perubahan besar, mohon buat issue terlebih dahulu.

## 📞 Support

Jika ada pertanyaan atau issue:
1. Baca [Frontend README](./frontend/README.md) untuk deployment Vercel
2. Baca [Backend README](./backend/README.md) untuk deployment Render
3. Buat [GitHub Issue](https://github.com/IanSapury/sistem-inventaris/issues) jika masih ada masalah

---

**Happy Coding! 🚀**

*Sistem ini didesain untuk UMKM dengan fokus pada kemudahan deployment dan efisiensi operasional.*
