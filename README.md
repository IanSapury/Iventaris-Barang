# 📦 Sistem Inventaris Gudang UMKM

Sistem manajemen inventaris modern dengan multi-role (Admin & Kasir), dashboard analytics, Point of Sale (POS), dan tracking transaksi lengkap.

## ✨ Fitur Utama

### 🔐 Authentication & Authorization
- Login sistem dengan JWT tokens
- Multi-role: **Admin** (full access) dan **Kasir** (POS only)
- Session management dengan cookie
- Auto-redirect berdasarkan role

### 👨‍💼 Admin Features
- **Dashboard Analytics**
  - Real-time statistics (pendapatan, stok, transaksi)
  - Line chart transaksi 7 hari terakhir
  - Bar chart top 5 produk terlaris
  - Monitoring stok rendah
  - History transaksi terakhir

- **Manajemen Barang**
  - CRUD barang lengkap
  - Filter & search real-time
  - Kategori produk
  - Tracking stok otomatis

- **Transaksi Masuk**
  - Pencatatan barang masuk ke gudang
  - Auto-update stok
  - Detail supplier & item

- **Transaksi Keluar (History)**
  - Lihat semua riwayat penjualan
  - Filter by date range
  - Detail pembayaran lengkap
  - Print invoice

### 🛒 Kasir Features
- **Point of Sale (POS)**
  - Interface modern & user-friendly
  - Product grid dengan search & filter
  - Shopping cart real-time
  - Auto-calculate subtotal & kembalian
  - Validasi stok otomatis
  - Generate & print struk digital
  - Auto-generate nomor transaksi

## 🎨 UI/UX Design

### Color Palette
- **Primary**: Biru Langit Modern (#3b82f6 - #60a5fa)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Light Gray (#f1f5f9)

### Design Features
- ✅ Modern & Clean Interface
- ✅ Smooth Transitions & Animations
- ✅ Responsive Design (Desktop & Mobile)
- ✅ Consistent Color Scheme
- ✅ User-friendly Navigation
- ✅ Toast Notifications
- ✅ Loading States & Skeleton Screens

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MySQL** (Database)
- **bcrypt** (Password hashing)
- **JWT** (Authentication)
- **express-session** (Session management)

### Frontend
- **Vanilla JavaScript** (ES6+)
- **Bootstrap 5** (UI Framework)
- **Chart.js** (Data visualization)
- **Bootstrap Icons**
- CSS3 dengan custom styling

## 📋 Prerequisites

- Node.js >= 14.x
- MySQL >= 5.7
- npm atau yarn

## 🚀 Installation & Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd sistem-inventaris
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup

**Buat database MySQL:**
```bash
mysql -u root -p
```

**Import schema:**
```bash
mysql -u root -p < schema.sql
```

Schema akan membuat:
- Database `db_inventaris`
- Tabel: `users`, `kategori`, `barang`, `transaksi_masuk`, `transaksi_keluar`, dll.
- Data dummy untuk testing

### 4. Environment Configuration

Buat file `.env`:
```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=db_inventaris

JWT_SECRET=inventaris-secret-key-2026
```

### 5. Generate Password Hash (Opsional)

Jika ingin custom password untuk user:
```bash
node generate-password.js
```

Update password di database dengan hash yang di-generate.

### 6. Run Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server akan berjalan di `http://localhost:3000`

## 👥 Default Users

### Admin
- **Username**: `admin`
- **Password**: `password123`
- **Access**: Full (Dashboard, CRUD, History, Reports)

### Kasir 1
- **Username**: `kasir1`
- **Password**: `password123`
- **Access**: POS Only

### Kasir 2
- **Username**: `kasir2`
- **Password**: `password123`
- **Access**: POS Only

## 📱 User Guide

### Login
1. Buka `http://localhost:3000/login.html`
2. Masukkan username & password
3. Sistem akan auto-redirect:
   - **Admin** → Dashboard (`/dashboard.html`)
   - **Kasir** → POS (`/pos.html`)

### Admin - Dashboard
- Lihat statistik real-time
- Monitor stok rendah
- Analisis penjualan dengan charts
- Quick access ke semua fitur

### Admin - Manajemen Barang
1. Klik menu "Data Barang"
2. Gunakan search bar untuk cari produk
3. Klik "Tambah Barang" untuk input baru
4. Edit/Hapus produk (hanya admin)

### Kasir - Point of Sale
1. Pilih produk dari grid
2. Produk masuk ke cart otomatis
3. Adjust quantity jika perlu
4. Klik "Checkout"
5. Input jumlah bayar
6. Sistem hitung kembalian otomatis
7. "Proses Pembayaran"
8. Print struk (opsional)

### Admin - History Transaksi
1. Klik menu "Barang Keluar"
2. Filter by date (hari ini/minggu/bulan)
3. Search transaksi
4. Klik icon mata untuk detail
5. Print invoice jika perlu

## 📁 Project Structure

```
sistem-inventaris/
├── config/
│   └── db.js                 # Database connection
├── middleware/
│   └── auth.js               # Authentication middleware
├── routes/
│   ├── auth.js               # Login, logout, register
│   ├── barang.js             # CRUD barang
│   ├── kategori.js           # CRUD kategori
│   └── transaksi.js          # Transaksi masuk/keluar
├── public/
│   ├── css/
│   │   ├── dashboard.css     # Dashboard styles
│   │   ├── pos.css           # POS styles
│   │   └── transaksi.css     # Transaction styles
│   ├── js/
│   │   ├── auth.js           # Auth utilities
│   │   ├── api.js            # API wrapper
│   │   ├── utils.js          # Helper functions
│   │   ├── dashboard.js      # Dashboard logic
│   │   ├── pos.js            # POS logic
│   │   └── transaksi-keluar.js
│   ├── login.html            # Login page
│   ├── dashboard.html        # Admin dashboard
│   ├── pos.html              # Kasir POS
│   └── transaksi-keluar.html # Transaction history
├── .env                      # Environment variables
├── server.js                 # Express server
├── schema.sql                # Database schema
└── package.json              # Dependencies

```

## 🔒 Security Features

- ✅ Password hashing with bcrypt (salt rounds: 10)
- ✅ JWT token authentication
- ✅ HTTP-only cookies
- ✅ SQL injection prevention (prepared statements)
- ✅ XSS protection (input sanitization)
- ✅ CSRF protection dengan same-site cookies
- ✅ Role-based access control (RBAC)
- ✅ Session timeout (8 hours)

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/register` - Register user (admin only)

### Barang
- `GET /api/barang` - Get all products
- `GET /api/barang/search?q=keyword` - Search products
- `GET /api/barang/:id` - Get product by ID
- `POST /api/barang` - Create product (admin only)
- `PUT /api/barang/:id` - Update product (admin only)
- `DELETE /api/barang/:id` - Delete product (admin only)

### Kategori
- `GET /api/kategori` - Get all categories
- `POST /api/kategori` - Create category (admin only)

### Transaksi
- `GET /api/transaksi/masuk` - Get all incoming transactions
- `POST /api/transaksi/masuk` - Create incoming transaction (admin only)
- `GET /api/transaksi/keluar` - Get all outgoing transactions
- `POST /api/transaksi/keluar` - Create outgoing transaction (kasir & admin)
- `GET /api/transaksi/stats` - Get dashboard statistics
- `GET /api/transaksi/generate-nomor/:tipe` - Generate transaction number

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL service
# Windows:
services.msc → MySQL → Start

# Verify credentials in .env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_actual_password
```

### Port Already in Use
```bash
# Change port in .env
PORT=3001
```

### Login Failed
- Pastikan database sudah di-import
- Check password hash di tabel `users`
- Regenerate password hash jika perlu

### Stok Tidak Update
- Check console untuk error
- Verifikasi transaction di database
- Pastikan foreign key constraints aktif

## 📈 Future Enhancements

- [ ] Export laporan ke Excel/PDF
- [ ] Multi-warehouse support
- [ ] Barcode scanner integration
- [ ] Email notifications
- [ ] Advanced reporting & analytics
- [ ] Inventory forecasting
- [ ] Mobile app (React Native)
- [ ] Real-time notifications (WebSocket)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use for your projects

## 👨‍💻 Developer

Developed with ❤️ for UMKM Indonesia

---

**Note**: Sistem ini didesain khusus untuk UMKM dengan fokus pada kemudahan penggunaan dan efisiensi operasional.

Untuk bantuan atau pertanyaan, silakan buka issue di repository.
