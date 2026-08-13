// ============================================================
// middleware/auth.js
// Middleware untuk authentication dan authorization
// ============================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'inventaris-secret-key-2026';

/**
 * Middleware: Verifikasi JWT token dari cookie atau header
 */
function authenticateToken(req, res, next) {
  // Ambil token dari cookie atau Authorization header
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Akses ditolak. Silakan login terlebih dahulu.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, username, nama_lengkap, role }
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      message: 'Token tidak valid atau sudah kadaluarsa.' 
    });
  }
}

/**
 * Middleware: Hanya admin yang bisa akses
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Akses ditolak. Hanya admin yang diizinkan.' 
    });
  }
  next();
}

/**
 * Middleware: Admin atau Kasir bisa akses
 */
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Silakan login terlebih dahulu.' 
    });
  }
  next();
}

module.exports = {
  authenticateToken,
  requireAdmin,
  requireAuth,
  JWT_SECRET
};
