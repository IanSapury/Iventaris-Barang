// ============================================================
// config/db.js
// Koneksi database MySQL menggunakan connection pool (mysql2/promise)
// Support Railway environment variables dan fallback ke local .env
// ============================================================

const mysql = require('mysql2/promise');
require('dotenv').config();

// Railway MySQL environment variables (prioritas tertinggi)
// Fallback ke custom env, lalu ke default local
const dbConfig = {
  host    : process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port    : process.env.MYSQLPORT || process.env.DB_PORT || 3306,
  user    : process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'db_inventaris',
  // Jumlah maksimum koneksi dalam pool
  connectionLimit: 10,
  // Tunggu koneksi tersedia jika pool penuh (tidak langsung error)
  waitForConnections: true,
  // Panjang antrian permintaan koneksi (0 = tidak terbatas)
  queueLimit: 0,
  // Timezone server MySQL
  timezone: '+07:00',
};

// Log database config (without password)
console.log('📊 Database Config:', {
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  database: dbConfig.database,
  password: dbConfig.password ? '***' : '(empty)'
});

// Buat connection pool
const pool = mysql.createPool(dbConfig);

// Test koneksi saat modul pertama kali di-load
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log(`✅ Database terhubung: ${dbConfig.database}@${dbConfig.host}:${dbConfig.port}`);
    conn.release(); // kembalikan koneksi ke pool
  } catch (err) {
    console.error('❌ Gagal terhubung ke database:', err.message);
    console.error('💡 Pastikan database credentials sudah benar di environment variables');
    // Jangan exit di production, biarkan Railway retry
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
})();

module.exports = pool;
