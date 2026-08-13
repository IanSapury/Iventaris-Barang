// ============================================================
// routes/auth.js
// Route untuk authentication (login, logout, check session)
// ============================================================

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// ============================================================
// POST /api/auth/login
// Login user (admin atau kasir)
// ============================================================
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username dan password wajib diisi.' 
      });
    }

    // Cari user di database
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ? AND status = ?',
      [username, 'aktif']
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah.' 
      });
    }

    const user = rows[0];

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username atau password salah.' 
      });
    }

    // Buat JWT token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '8h' } // Token berlaku 8 jam
    );

    // Set cookie (httpOnly untuk keamanan)
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 jam
      sameSite: 'strict'
    });

    // Response sukses
    res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          nama_lengkap: user.nama_lengkap,
          role: user.role
        }
      }
    });

  } catch (error) {
    next(error);
  }
});

// ============================================================
// POST /api/auth/logout
// Logout user (hapus token)
// ============================================================
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({
    success: true,
    message: 'Logout berhasil'
  });
});

// ============================================================
// GET /api/auth/me
// Cek session user yang sedang login
// ============================================================
router.get('/me', authenticateToken, async (req, res, next) => {
  try {
    // Ambil data user terbaru dari database
    const [rows] = await db.query(
      'SELECT id, username, nama_lengkap, role, status FROM users WHERE id = ?',
      [req.user.id]
    );

    if (rows.length === 0 || rows[0].status !== 'aktif') {
      return res.status(401).json({ 
        success: false, 
        message: 'User tidak ditemukan atau tidak aktif.' 
      });
    }

    res.json({
      success: true,
      data: rows[0]
    });

  } catch (error) {
    next(error);
  }
});

// ============================================================
// POST /api/auth/register (HANYA UNTUK ADMIN)
// Register user baru - akan diproteksi di frontend
// ============================================================
router.post('/register', async (req, res, next) => {
  try {
    const { username, password, nama_lengkap, role } = req.body;

    // Validasi input
    if (!username || !password || !nama_lengkap || !role) {
      return res.status(400).json({ 
        success: false, 
        message: 'Semua field wajib diisi.' 
      });
    }

    if (!['admin', 'kasir'].includes(role)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Role harus admin atau kasir.' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert ke database
    const [result] = await db.query(
      'INSERT INTO users (username, password, nama_lengkap, role, status) VALUES (?, ?, ?, ?, ?)',
      [username, hashedPassword, nama_lengkap, role, 'aktif']
    );

    res.status(201).json({
      success: true,
      message: 'User berhasil didaftarkan',
      data: {
        id: result.insertId,
        username,
        nama_lengkap,
        role
      }
    });

  } catch (error) {
    // Handle duplicate username
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ 
        success: false, 
        message: 'Username sudah digunakan.' 
      });
    }
    next(error);
  }
});

module.exports = router;
