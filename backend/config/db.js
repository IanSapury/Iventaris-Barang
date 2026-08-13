// ============================================================
// config/db.js
// Koneksi database MySQL menggunakan connection pool (mysql2/promise)
// Connection pool lebih efisien daripada single connection karena
// mengelola beberapa koneksi sekaligus dan reuse koneksi yang ada.
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Buat connection pool dengan kredensial dari .env
const pool = mysql.createPool({
  host    : process.env.DB_HOST     || 'localhost',
  port    : process.env.DB_PORT     || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'db_inventaris',
  // Jumlah maksimum koneksi dalam pool
  connectionLimit: 10,
  // Tunggu koneksi tersedia jika pool penuh (tidak langsung error)
  waitForConnections: true,
  // Panjang antrian permintaan koneksi (0 = tidak terbatas)
  queueLimit: 0,
  // Timezone server MySQL
  timezone: '+07:00',
});

// Test koneksi saat modul pertama kali di-load
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ Database terhubung: ${process.env.DB_NAME}@${process.env.DB_HOST}`);
    conn.release(); // kembalikan koneksi ke pool
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    process.exit(1); // hentikan server jika database tidak bisa diakses
  }
})();

module.exports = pool;
