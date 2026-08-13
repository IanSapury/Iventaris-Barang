// ============================================================
// config.js
// Konfigurasi API URL untuk frontend
// ============================================================

const CONFIG = {
  // Ubah URL ini sesuai environment:
  // - Development: 'http://localhost:3000/api'
  // - Production: 'https://your-backend-url.onrender.com/api'
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://your-backend-url.onrender.com/api' // Ganti dengan URL Render Anda nanti
};

// Export untuk digunakan di script lain
window.CONFIG = CONFIG;
