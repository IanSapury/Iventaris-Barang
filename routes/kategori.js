// ============================================================
// routes/kategori.js
// RESTful API untuk resource "kategori"
// Digunakan frontend untuk mengisi dropdown kategori pada form
// PROTECTED: Hanya bisa diakses setelah login
// ============================================================

const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const ok  = (res, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, data });
const err = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message });

// GET /api/kategori — ambil semua kategori (PUBLIC)
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategori ORDER BY nama ASC');
    ok(res, rows);
  } catch (e) { next(e); }
});

// GET /api/kategori/:id — ambil satu kategori (PUBLIC)
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM kategori WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return err(res, `Kategori dengan id ${req.params.id} tidak ditemukan`, 404);
    ok(res, rows[0]);
  } catch (e) { next(e); }
});

// POST /api/kategori — tambah kategori baru (ADMIN ONLY)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { nama, keterangan } = req.body;
    if (!nama) return err(res, 'Field nama wajib diisi');

    const [dup] = await pool.query('SELECT id FROM kategori WHERE nama = ?', [nama]);
    if (dup.length > 0) return err(res, `Kategori "${nama}" sudah ada`);

    const [result] = await pool.query(
      'INSERT INTO kategori (nama, keterangan) VALUES (?, ?)',
      [nama, keterangan || null]
    );
    const [newRow] = await pool.query('SELECT * FROM kategori WHERE id = ?', [result.insertId]);
    ok(res, newRow[0], 201);
  } catch (e) { next(e); }
});

module.exports = router;
