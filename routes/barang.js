// ============================================================
// routes/barang.js
// RESTful API untuk resource "barang"
// Semua query menggunakan prepared statements (parameterized)
// untuk mencegah SQL Injection.
// PROTECTED: Hanya bisa diakses setelah login
// ============================================================

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Helper: format response sukses
const ok  = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });

// Helper: format response error
const err = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });

// ============================================================
// GET /api/barang
// Ambil semua data barang beserta nama kategorinya (JOIN)
// PUBLIC - Kasir & Admin bisa akses
// ============================================================
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.id, b.kode_barang, b.nama_barang,
        b.kategori_id, k.nama AS nama_kategori,
        b.stok, b.harga, b.satuan, b.keterangan,
        b.created_at, b.updated_at
      FROM barang b
      JOIN kategori k ON b.kategori_id = k.id
      ORDER BY b.id DESC
    `);
    ok(res, rows);
  } catch (e) { next(e); }
});

// ============================================================
// GET /api/barang/search?q=keyword
// Cari barang berdasarkan kode, nama, atau nama kategori
// HARUS didefinisikan SEBELUM route /:id agar tidak bentrok
// PUBLIC - Kasir & Admin bisa akses
// ============================================================
router.get('/search', authenticateToken, async (req, res, next) => {
  try {
    const q = `%${req.query.q || ''}%`;
    const [rows] = await pool.query(`
      SELECT
        b.id, b.kode_barang, b.nama_barang,
        b.kategori_id, k.nama AS nama_kategori,
        b.stok, b.harga, b.satuan, b.keterangan,
        b.created_at, b.updated_at
      FROM barang b
      JOIN kategori k ON b.kategori_id = k.id
      WHERE b.kode_barang  LIKE ?
         OR b.nama_barang  LIKE ?
         OR k.nama         LIKE ?
         OR b.satuan       LIKE ?
      ORDER BY b.id DESC
    `, [q, q, q, q]);
    ok(res, rows);
  } catch (e) { next(e); }
});

// ============================================================
// GET /api/barang/:id
// Ambil satu data barang berdasarkan id
// PUBLIC - Kasir & Admin bisa akses
// ============================================================
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        b.id, b.kode_barang, b.nama_barang,
        b.kategori_id, k.nama AS nama_kategori,
        b.stok, b.harga, b.satuan, b.keterangan,
        b.created_at, b.updated_at
      FROM barang b
      JOIN kategori k ON b.kategori_id = k.id
      WHERE b.id = ?
    `, [req.params.id]);

    if (rows.length === 0)
      return err(res, `Barang dengan id ${req.params.id} tidak ditemukan`, 404);

    ok(res, rows[0]);
  } catch (e) { next(e); }
});

// ============================================================
// POST /api/barang
// Tambah data barang baru
// Validasi: field wajib tidak boleh kosong, cek duplikasi kode
// PROTECTED - Hanya Admin
// ============================================================
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { kode_barang, nama_barang, kategori_id, stok, harga, satuan, keterangan } = req.body;

    // --- Validasi field wajib ---
    if (!kode_barang || !nama_barang || !kategori_id || stok === undefined || harga === undefined) {
      return err(res, 'Field kode_barang, nama_barang, kategori_id, stok, dan harga wajib diisi');
    }

    // --- Cek duplikasi kode_barang ---
    const [existing] = await pool.query(
      'SELECT id FROM barang WHERE kode_barang = ?', [kode_barang]
    );
    if (existing.length > 0)
      return err(res, `Kode barang "${kode_barang}" sudah terdaftar`);

    // --- Cek apakah kategori_id valid ---
    const [kat] = await pool.query('SELECT id FROM kategori WHERE id = ?', [kategori_id]);
    if (kat.length === 0)
      return err(res, `Kategori dengan id ${kategori_id} tidak ditemukan`, 404);

    // --- Insert data (parameterized query) ---
    const [result] = await pool.query(
      `INSERT INTO barang (kode_barang, nama_barang, kategori_id, stok, harga, satuan, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [kode_barang, nama_barang, kategori_id, stok, harga, satuan || 'pcs', keterangan || null]
    );

    // Ambil data lengkap yang baru saja di-insert
    const [newRow] = await pool.query(`
      SELECT b.*, k.nama AS nama_kategori
      FROM barang b JOIN kategori k ON b.kategori_id = k.id
      WHERE b.id = ?
    `, [result.insertId]);

    ok(res, newRow[0], 201);
  } catch (e) { next(e); }
});

// ============================================================
// PUT /api/barang/:id
// Update data barang berdasarkan id
// PROTECTED - Hanya Admin
// ============================================================
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { kode_barang, nama_barang, kategori_id, stok, harga, satuan, keterangan } = req.body;

    // --- Cek apakah data ada ---
    const [existing] = await pool.query('SELECT id FROM barang WHERE id = ?', [id]);
    if (existing.length === 0)
      return err(res, `Barang dengan id ${id} tidak ditemukan`, 404);

    // --- Validasi field wajib ---
    if (!kode_barang || !nama_barang || !kategori_id || stok === undefined || harga === undefined) {
      return err(res, 'Field kode_barang, nama_barang, kategori_id, stok, dan harga wajib diisi');
    }

    // --- Cek duplikasi kode_barang (kecuali milik diri sendiri) ---
    const [dupCheck] = await pool.query(
      'SELECT id FROM barang WHERE kode_barang = ? AND id != ?', [kode_barang, id]
    );
    if (dupCheck.length > 0)
      return err(res, `Kode barang "${kode_barang}" sudah digunakan oleh barang lain`);

    // --- Cek apakah kategori_id valid ---
    const [kat] = await pool.query('SELECT id FROM kategori WHERE id = ?', [kategori_id]);
    if (kat.length === 0)
      return err(res, `Kategori dengan id ${kategori_id} tidak ditemukan`, 404);

    // --- Update data (parameterized query) ---
    await pool.query(
      `UPDATE barang
       SET kode_barang = ?, nama_barang = ?, kategori_id = ?,
           stok = ?, harga = ?, satuan = ?, keterangan = ?
       WHERE id = ?`,
      [kode_barang, nama_barang, kategori_id, stok, harga, satuan || 'pcs', keterangan || null, id]
    );

    // Ambil data terbaru setelah update
    const [updated] = await pool.query(`
      SELECT b.*, k.nama AS nama_kategori
      FROM barang b JOIN kategori k ON b.kategori_id = k.id
      WHERE b.id = ?
    `, [id]);

    ok(res, updated[0]);
  } catch (e) { next(e); }
});

// ============================================================
// DELETE /api/barang/:id
// Hapus data barang berdasarkan id
// PROTECTED - Hanya Admin
// ============================================================
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;

    // --- Cek apakah data ada ---
    const [existing] = await pool.query(
      'SELECT id, nama_barang FROM barang WHERE id = ?', [id]
    );
    if (existing.length === 0)
      return err(res, `Barang dengan id ${id} tidak ditemukan`, 404);

    await pool.query('DELETE FROM barang WHERE id = ?', [id]);

    ok(res, { id: Number(id), nama_barang: existing[0].nama_barang });
  } catch (e) { next(e); }
});

// ============================================================
// PATCH /api/barang/:id/stok-masuk  (endpoint tambahan)
// Tambah stok barang berdasarkan id
// Body: { jumlah: <angka positif> }
// PROTECTED - Hanya Admin
// ============================================================
router.patch('/:id/stok-masuk', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { jumlah } = req.body;

    if (!jumlah || isNaN(jumlah) || Number(jumlah) <= 0)
      return err(res, 'Field jumlah harus berupa angka positif');

    const [existing] = await pool.query('SELECT id, stok FROM barang WHERE id = ?', [id]);
    if (existing.length === 0)
      return err(res, `Barang dengan id ${id} tidak ditemukan`, 404);

    await pool.query(
      'UPDATE barang SET stok = stok + ? WHERE id = ?',
      [Number(jumlah), id]
    );

    const [updated] = await pool.query(`
      SELECT b.*, k.nama AS nama_kategori
      FROM barang b JOIN kategori k ON b.kategori_id = k.id
      WHERE b.id = ?
    `, [id]);

    ok(res, updated[0]);
  } catch (e) { next(e); }
});

module.exports = router;
