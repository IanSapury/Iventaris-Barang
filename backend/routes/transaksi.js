// ============================================================
// routes/transaksi.js
// API untuk transaksi masuk dan keluar barang
// ============================================================

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const ok  = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });
const err = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });

// ============================================================
// TRANSAKSI MASUK
// ============================================================

/**
 * GET /api/transaksi/masuk
 * Ambil semua transaksi masuk dengan detail
 */
router.get('/masuk', authenticateToken, async (req, res, next) => {
  try {
    const [transaksi] = await pool.query(`
      SELECT 
        tm.*,
        u.nama_lengkap as user_nama
      FROM transaksi_masuk tm
      LEFT JOIN users u ON tm.user_id = u.id
      ORDER BY tm.tanggal DESC
    `);

    // Ambil detail untuk setiap transaksi
    for (let t of transaksi) {
      const [detail] = await pool.query(`
        SELECT 
          dtm.*,
          b.kode_barang,
          b.nama_barang,
          b.satuan
        FROM detail_transaksi_masuk dtm
        JOIN barang b ON dtm.barang_id = b.id
        WHERE dtm.transaksi_masuk_id = ?
      `, [t.id]);
      t.detail = detail;
    }

    ok(res, transaksi);
  } catch (e) { next(e); }
});

/**
 * GET /api/transaksi/masuk/:id
 * Ambil satu transaksi masuk dengan detail
 */
router.get('/masuk/:id', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        tm.*,
        u.nama_lengkap as user_nama
      FROM transaksi_masuk tm
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE tm.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return err(res, 'Transaksi tidak ditemukan', 404);
    }

    const transaksi = rows[0];

    // Ambil detail
    const [detail] = await pool.query(`
      SELECT 
        dtm.*,
        b.kode_barang,
        b.nama_barang,
        b.satuan
      FROM detail_transaksi_masuk dtm
      JOIN barang b ON dtm.barang_id = b.id
      WHERE dtm.transaksi_masuk_id = ?
    `, [transaksi.id]);

    transaksi.detail = detail;

    ok(res, transaksi);
  } catch (e) { next(e); }
});

/**
 * POST /api/transaksi/masuk
 * Tambah transaksi masuk baru
 * Body: {
 *   nomor_transaksi, tanggal, supplier, keterangan,
 *   items: [{ barang_id, jumlah, harga_beli }]
 * }
 */
router.post('/masuk', authenticateToken, requireAdmin, async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { nomor_transaksi, tanggal, supplier, keterangan, items } = req.body;

    // Validasi
    if (!nomor_transaksi || !items || items.length === 0) {
      await connection.rollback();
      return err(res, 'Nomor transaksi dan items wajib diisi');
    }

    // Cek duplikasi nomor transaksi
    const [existing] = await connection.query(
      'SELECT id FROM transaksi_masuk WHERE nomor_transaksi = ?',
      [nomor_transaksi]
    );
    if (existing.length > 0) {
      await connection.rollback();
      return err(res, `Nomor transaksi ${nomor_transaksi} sudah ada`);
    }

    // Hitung total item
    const total_item = items.reduce((sum, item) => sum + Number(item.jumlah), 0);

    // Format tanggal untuk MySQL
    const mysqlDate = tanggal ? new Date(tanggal).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert transaksi masuk
    const [resultTransaksi] = await connection.query(
      `INSERT INTO transaksi_masuk 
       (nomor_transaksi, tanggal, supplier, keterangan, user_id, total_item)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        nomor_transaksi,
        mysqlDate,
        supplier || null,
        keterangan || null,
        req.user.id,
        total_item
      ]
    );

    const transaksiId = resultTransaksi.insertId;

    // Insert detail dan update stok
    for (let item of items) {
      const { barang_id, jumlah, harga_beli } = item;
      const subtotal = Number(jumlah) * Number(harga_beli);

      // Insert detail
      await connection.query(
        `INSERT INTO detail_transaksi_masuk 
         (transaksi_masuk_id, barang_id, jumlah, harga_beli, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [transaksiId, barang_id, jumlah, harga_beli, subtotal]
      );

      // Update stok barang
      await connection.query(
        'UPDATE barang SET stok = stok + ? WHERE id = ?',
        [jumlah, barang_id]
      );
    }

    await connection.commit();

    // Ambil data lengkap yang baru dibuat
    const [newTransaksi] = await pool.query(`
      SELECT 
        tm.*,
        u.nama_lengkap as user_nama
      FROM transaksi_masuk tm
      LEFT JOIN users u ON tm.user_id = u.id
      WHERE tm.id = ?
    `, [transaksiId]);

    const [detail] = await pool.query(`
      SELECT 
        dtm.*,
        b.kode_barang,
        b.nama_barang,
        b.satuan
      FROM detail_transaksi_masuk dtm
      JOIN barang b ON dtm.barang_id = b.id
      WHERE dtm.transaksi_masuk_id = ?
    `, [transaksiId]);

    newTransaksi[0].detail = detail;

    ok(res, newTransaksi[0], 201);

  } catch (e) {
    await connection.rollback();
    next(e);
  } finally {
    connection.release();
  }
});

// ============================================================
// TRANSAKSI KELUAR (PENJUALAN)
// ============================================================

/**
 * GET /api/transaksi/keluar
 * Ambil semua transaksi keluar dengan detail
 */
router.get('/keluar', authenticateToken, async (req, res, next) => {
  try {
    const [transaksi] = await pool.query(`
      SELECT 
        tk.*,
        u.nama_lengkap as user_nama
      FROM transaksi_keluar tk
      LEFT JOIN users u ON tk.user_id = u.id
      ORDER BY tk.tanggal DESC
    `);

    // Ambil detail untuk setiap transaksi
    for (let t of transaksi) {
      const [detail] = await pool.query(`
        SELECT 
          dtk.*,
          b.kode_barang,
          b.nama_barang,
          b.satuan
        FROM detail_transaksi_keluar dtk
        JOIN barang b ON dtk.barang_id = b.id
        WHERE dtk.transaksi_keluar_id = ?
      `, [t.id]);
      t.detail = detail;
    }

    ok(res, transaksi);
  } catch (e) { next(e); }
});

/**
 * GET /api/transaksi/keluar/:id
 * Ambil satu transaksi keluar dengan detail
 */
router.get('/keluar/:id', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        tk.*,
        u.nama_lengkap as user_nama
      FROM transaksi_keluar tk
      LEFT JOIN users u ON tk.user_id = u.id
      WHERE tk.id = ?
    `, [req.params.id]);

    if (rows.length === 0) {
      return err(res, 'Transaksi tidak ditemukan', 404);
    }

    const transaksi = rows[0];

    // Ambil detail
    const [detail] = await pool.query(`
      SELECT 
        dtk.*,
        b.kode_barang,
        b.nama_barang,
        b.satuan
      FROM detail_transaksi_keluar dtk
      JOIN barang b ON dtk.barang_id = b.id
      WHERE dtk.transaksi_keluar_id = ?
    `, [transaksi.id]);

    transaksi.detail = detail;

    ok(res, transaksi);
  } catch (e) { next(e); }
});

/**
 * POST /api/transaksi/keluar
 * Tambah transaksi keluar/penjualan baru
 * Body: {
 *   nomor_transaksi, tanggal, pelanggan, keterangan, bayar,
 *   items: [{ barang_id, jumlah, harga_jual }]
 * }
 */
router.post('/keluar', authenticateToken, async (req, res, next) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const { nomor_transaksi, tanggal, pelanggan, keterangan, bayar, items } = req.body;

    // Validasi
    if (!nomor_transaksi || !items || items.length === 0) {
      await connection.rollback();
      return err(res, 'Nomor transaksi dan items wajib diisi');
    }

    // Cek duplikasi nomor transaksi
    const [existing] = await connection.query(
      'SELECT id FROM transaksi_keluar WHERE nomor_transaksi = ?',
      [nomor_transaksi]
    );
    if (existing.length > 0) {
      await connection.rollback();
      return err(res, `Nomor transaksi ${nomor_transaksi} sudah ada`);
    }

    // Validasi stok barang sebelum proses
    for (let item of items) {
      const [barang] = await connection.query(
        'SELECT stok FROM barang WHERE id = ?',
        [item.barang_id]
      );
      
      if (barang.length === 0) {
        await connection.rollback();
        return err(res, `Barang dengan id ${item.barang_id} tidak ditemukan`);
      }

      if (barang[0].stok < item.jumlah) {
        await connection.rollback();
        return err(res, `Stok barang tidak mencukupi. Stok tersedia: ${barang[0].stok}, diminta: ${item.jumlah}`);
      }
    }

    // Hitung total
    const total_item = items.reduce((sum, item) => sum + Number(item.jumlah), 0);
    const total_harga = items.reduce((sum, item) => 
      sum + (Number(item.jumlah) * Number(item.harga_jual)), 0
    );
    const kembalian = Number(bayar) - total_harga;

    // Format tanggal untuk MySQL
    const mysqlDate = tanggal ? new Date(tanggal).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Insert transaksi keluar
    const [resultTransaksi] = await connection.query(
      `INSERT INTO transaksi_keluar 
       (nomor_transaksi, tanggal, pelanggan, user_id, total_item, total_harga, bayar, kembalian, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nomor_transaksi,
        mysqlDate,
        pelanggan || null,
        req.user.id,
        total_item,
        total_harga,
        bayar,
        kembalian,
        keterangan || null
      ]
    );

    const transaksiId = resultTransaksi.insertId;

    // Insert detail dan update stok
    for (let item of items) {
      const { barang_id, jumlah, harga_jual } = item;
      const subtotal = Number(jumlah) * Number(harga_jual);

      // Insert detail
      await connection.query(
        `INSERT INTO detail_transaksi_keluar 
         (transaksi_keluar_id, barang_id, jumlah, harga_jual, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [transaksiId, barang_id, jumlah, harga_jual, subtotal]
      );

      // Update stok barang (kurangi)
      await connection.query(
        'UPDATE barang SET stok = stok - ? WHERE id = ?',
        [jumlah, barang_id]
      );
    }

    await connection.commit();

    // Ambil data lengkap yang baru dibuat
    const [newTransaksi] = await pool.query(`
      SELECT 
        tk.*,
        u.nama_lengkap as user_nama
      FROM transaksi_keluar tk
      LEFT JOIN users u ON tk.user_id = u.id
      WHERE tk.id = ?
    `, [transaksiId]);

    const [detail] = await pool.query(`
      SELECT 
        dtk.*,
        b.kode_barang,
        b.nama_barang,
        b.satuan
      FROM detail_transaksi_keluar dtk
      JOIN barang b ON dtk.barang_id = b.id
      WHERE dtk.transaksi_keluar_id = ?
    `, [transaksiId]);

    newTransaksi[0].detail = detail;

    ok(res, newTransaksi[0], 201);

  } catch (e) {
    await connection.rollback();
    next(e);
  } finally {
    connection.release();
  }
});

// ============================================================
// DASHBOARD STATISTICS
// ============================================================

/**
 * GET /api/transaksi/stats
 * Statistik untuk dashboard admin
 */
router.get('/stats', authenticateToken, async (req, res, next) => {
  try {
    // Total transaksi hari ini
    const [transaksiHariIni] = await pool.query(`
      SELECT 
        COUNT(*) as total_transaksi,
        COALESCE(SUM(total_harga), 0) as total_pendapatan
      FROM transaksi_keluar
      WHERE DATE(tanggal) = CURDATE()
    `);

    // Total transaksi bulan ini
    const [transaksiBulanIni] = await pool.query(`
      SELECT 
        COUNT(*) as total_transaksi,
        COALESCE(SUM(total_harga), 0) as total_pendapatan
      FROM transaksi_keluar
      WHERE MONTH(tanggal) = MONTH(CURDATE())
        AND YEAR(tanggal) = YEAR(CURDATE())
    `);

    // Barang paling laris (top 5)
    const [barangLaris] = await pool.query(`
      SELECT 
        b.nama_barang,
        b.kode_barang,
        SUM(dtk.jumlah) as total_terjual,
        SUM(dtk.subtotal) as total_pendapatan
      FROM detail_transaksi_keluar dtk
      JOIN barang b ON dtk.barang_id = b.id
      JOIN transaksi_keluar tk ON dtk.transaksi_keluar_id = tk.id
      WHERE MONTH(tk.tanggal) = MONTH(CURDATE())
        AND YEAR(tk.tanggal) = YEAR(CURDATE())
      GROUP BY b.id
      ORDER BY total_terjual DESC
      LIMIT 5
    `);

    // Transaksi per hari (7 hari terakhir)
    const [transaksiPerHari] = await pool.query(`
      SELECT 
        DATE(tanggal) as tanggal,
        COUNT(*) as jumlah_transaksi,
        COALESCE(SUM(total_harga), 0) as total_pendapatan
      FROM transaksi_keluar
      WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(tanggal)
      ORDER BY tanggal ASC
    `);

    // Stok rendah (< 10)
    const [stokRendah] = await pool.query(`
      SELECT 
        b.kode_barang,
        b.nama_barang,
        b.stok,
        b.satuan,
        k.nama as kategori
      FROM barang b
      JOIN kategori k ON b.kategori_id = k.id
      WHERE b.stok < 10 AND b.stok > 0
      ORDER BY b.stok ASC
      LIMIT 10
    `);

    ok(res, {
      hari_ini: transaksiHariIni[0],
      bulan_ini: transaksiBulanIni[0],
      barang_laris: barangLaris,
      transaksi_per_hari: transaksiPerHari,
      stok_rendah: stokRendah
    });

  } catch (e) { next(e); }
});

/**
 * GET /api/transaksi/generate-nomor/:tipe
 * Generate nomor transaksi otomatis
 * tipe: 'masuk' atau 'keluar'
 */
router.get('/generate-nomor/:tipe', authenticateToken, async (req, res, next) => {
  try {
    const { tipe } = req.params;
    
    if (!['masuk', 'keluar'].includes(tipe)) {
      return err(res, 'Tipe harus masuk atau keluar');
    }

    const prefix = tipe === 'masuk' ? 'MSK' : 'OUT';
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Cari nomor terakhir hari ini
    const table = tipe === 'masuk' ? 'transaksi_masuk' : 'transaksi_keluar';
    const [rows] = await pool.query(`
      SELECT nomor_transaksi 
      FROM ${table}
      WHERE nomor_transaksi LIKE ?
      ORDER BY nomor_transaksi DESC
      LIMIT 1
    `, [`${prefix}-${dateStr}-%`]);

    let urutan = 1;
    if (rows.length > 0) {
      const lastNo = rows[0].nomor_transaksi;
      const parts = lastNo.split('-');
      urutan = parseInt(parts[2]) + 1;
    }

    const nomorTransaksi = `${prefix}-${dateStr}-${String(urutan).padStart(3, '0')}`;

    ok(res, { nomor_transaksi: nomorTransaksi });

  } catch (e) { next(e); }
});

module.exports = router;
