# Frontend - Sistem Inventaris Barang

Frontend aplikasi Sistem Inventaris menggunakan HTML, CSS, dan Vanilla JavaScript.

## 🚀 Deployment ke Vercel

### Langkah-langkah:

1. **Install Vercel CLI** (opsional, bisa juga via Web UI):
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy dari folder ini**:
   ```bash
   cd frontend
   vercel
   ```

4. **Atau deploy via GitHub**:
   - Push repository ke GitHub
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Klik "Import Project"
   - Pilih repository GitHub Anda
   - Set **Root Directory** ke: `frontend`
   - Klik "Deploy"

### Konfigurasi Setelah Deploy:

1. Setelah deploy, Anda akan mendapat URL seperti: `https://your-app.vercel.app`

2. **Update API URL di `public/js/config.js`**:
   ```javascript
   API_BASE_URL: 'https://your-backend-url.onrender.com/api'
   ```

3. Atau buat environment variable di Vercel (coming soon dengan build step).

## 📁 Struktur File

```
frontend/
├── public/
│   ├── css/           # Stylesheets
│   ├── js/            # JavaScript files
│   │   ├── config.js  # ⭐ Konfigurasi API URL
│   │   ├── api.js     # API wrapper functions
│   │   ├── auth.js    # Authentication utilities
│   │   └── ...
│   ├── *.html         # HTML pages
│   └── style.css
├── vercel.json        # Konfigurasi Vercel
└── README.md
```

## 🔧 Development Lokal

Gunakan live server atau VS Code Live Server extension untuk development:

```bash
# Dengan Python
cd public
python -m http.server 8000

# Atau dengan Node.js http-server
npx http-server public -p 8000
```

Buka browser ke `http://localhost:8000`

## 🔗 Koneksi ke Backend

Frontend terhubung ke backend API melalui konfigurasi di `public/js/config.js`.

**Development**: Pastikan backend berjalan di `http://localhost:3000`  
**Production**: Update `API_BASE_URL` ke URL Render backend Anda

## 📝 Catatan

- Tidak ada build process, semua file statis
- CORS sudah dihandle di backend
- Authentication menggunakan JWT token di localStorage
