// ============================================================
// config.js
// Konfigurasi API URL untuk frontend
// Support Railway deployment dengan relative path
// ============================================================

const CONFIG = {
  // Untuk Railway: gunakan relative path '/api'
  // Untuk development lokal dengan separate server: gunakan 'http://localhost:3000/api'
  API_BASE_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'  // Development: backend terpisah di port 3000
    : '/api'  // Production (Railway/Render): same origin, gunakan relative path
};

// Export untuk digunakan di script lain
window.CONFIG = CONFIG;
