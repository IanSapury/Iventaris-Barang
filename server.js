// ============================================================
// server.js
// Entry point aplikasi Sistem Inventaris Barang
// ============================================================

require('dotenv').config(); // muat variabel dari .env sebelum apapun

const express       = require('express');
const cors          = require('cors');
const path          = require('path');
const cookieParser  = require('cookie-parser');

const authRouter      = require('./routes/auth');
const barangRouter    = require('./routes/barang');
const kategoriRouter  = require('./routes/kategori');
const transaksiRouter = require('./routes/transaksi');

const app  = express();
const PORT = process.env.PORT || 3000;

// ============================================================
// Middleware global
// ============================================================
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true // Allow cookies
}));
app.use(express.json());          // parse body JSON
app.use(express.urlencoded({ extended: true })); // parse form URL-encoded
app.use(cookieParser());          // parse cookies

// Sajikan file statis dari folder public/ (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================
// Routing API
// ============================================================
app.use('/api/auth',      authRouter);
app.use('/api/barang',    barangRouter);
app.use('/api/kategori',  kategoriRouter);
app.use('/api/transaksi', transaksiRouter);

// Root redirect ke login
app.get('/', (req, res) => {
  res.redirect('/login.html');
});

// ============================================================
// Middleware 404 — route tidak ditemukan
// ============================================================
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} tidak ditemukan` });
});

// ============================================================
// Middleware error handler global
// Menangkap semua error yang di-next(e) dari route handler
// ============================================================
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error('❌ Server Error:', error);

  // Tangani error duplikat key MySQL (kode 1062)
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ success: false, message: 'Data duplikat: nilai unik sudah ada di database' });
  }

  // Tangani error foreign key constraint MySQL (kode 1452)
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({ success: false, message: 'Referensi foreign key tidak valid' });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Terjadi kesalahan pada server'
      : error.message,
  });
});

// ============================================================
// Jalankan server
// ============================================================
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`   Mode    : ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Database: ${process.env.DB_NAME}@${process.env.DB_HOST}:${process.env.DB_PORT}`);
});
