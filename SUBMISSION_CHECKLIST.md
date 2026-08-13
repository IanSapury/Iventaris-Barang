# ✅ CHECKLIST PENGUMPULAN TUGAS

## 📦 1. FOLDER SOURCE CODE (ZIP)

### Yang HARUS di-include:
```
sistem-inventaris.zip
├── config/
├── middleware/
├── public/
│   ├── css/
│   ├── js/
│   ├── *.html
├── routes/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
├── schema.sql
├── server.js
├── generate-password.js
└── update-passwords.js
```

### Yang JANGAN di-include:
- ❌ node_modules/ (terlalu besar)
- ❌ .env (berisi credentials)
- ❌ .DS_Store atau file system lain

### Cara membuat ZIP:
```bash
# Exclude node_modules
cd sistem-inventaris
# Windows: Right-click folder → Send to → Compressed (zipped) folder
# Atau gunakan command:
tar -czf sistem-inventaris.zip --exclude=node_modules --exclude=.env .
```

**Ukuran ideal: < 5 MB**

---

## 🗄️ 2. DATABASE

### File yang dikumpulkan:

**A. schema.sql** (sudah ada)
- Berisi CREATE DATABASE
- CREATE TABLE semua tabel
- INSERT data dummy
- Lengkap dengan foreign keys

**B. db_inventaris_export.sql** (Export database saat ini)

Cara export database:

**Via MySQL Command:**
```bash
mysqldump -u root -p db_inventaris > db_inventaris_export.sql
```

**Via phpMyAdmin:**
1. Pilih database db_inventaris
2. Klik tab "Export"
3. Pilih "Custom" export method
4. Centang "Add DROP TABLE"
5. Format: SQL
6. Download file

**Via MySQL Workbench:**
1. Data Export
2. Pilih db_inventaris
3. Export to Self-Contained File
4. Include CREATE SCHEMA

**C. ERD Diagram**

Buat ERD dengan:
- Draw.io (https://app.diagrams.net/)
- Lucidchart
- MySQL Workbench (Database → Reverse Engineer)

Export sebagai:
- PNG (high resolution)
- PDF (vector)

**Format ERD harus menunjukkan:**
- Semua tabel dengan fields
- Primary keys (PK)
- Foreign keys (FK)
- Relasi (1:1, 1:N, N:M)
- Cardinality

---

## 📄 3. LAPORAN

### Format Dokumen:
- **File**: Laporan_Inventaris_[NIM]_[Nama].pdf
- **Halaman**: 50-80 halaman
- **Ukuran**: A4
- **Font**: Times New Roman 12pt
- **Spacing**: 1.5

### Struktur Lengkap:

**Cover**
- Logo institusi
- Judul: "SISTEM INVENTARIS GUDANG UMKM BERBASIS WEB DENGAN FITUR MULTI-ROLE DAN POINT OF SALE"
- Nama lengkap
- NIM
- Program Studi
- Tahun

**Halaman Preliminari**
1. Lembar pengesahan (ditandatangani)
2. Abstrak (Indonesia)
3. Abstract (English)
4. Kata pengantar
5. Daftar isi
6. Daftar gambar
7. Daftar tabel
8. Daftar lampiran

**Isi**
- BAB I: Pendahuluan (8-10 hal)
- BAB II: Landasan Teori (15-20 hal)
- BAB III: Metodologi (10-12 hal)
- BAB IV: Hasil & Pembahasan (20-25 hal)
- BAB V: Pengujian (8-10 hal)
- BAB VI: Penutup (3-5 hal)

**Penutup**
- Daftar pustaka (min. 15 referensi)
- Lampiran (source code, screenshot, user manual)

### Tools untuk menulis:
- Microsoft Word (recommended)
- Google Docs
- LaTeX (untuk yang advanced)

### Template siap pakai:
Cari "template skripsi [nama universitas]" di Google

---

## 📸 4. DOKUMENTASI SCREENSHOT (PDF)

### File: Screenshot_Inventaris_[NIM].pdf

### Daftar Screenshot yang wajib ada:

**Authentication (2-3 screenshot)**
1. Login page - desktop view
2. Login page - mobile view
3. Login error (wrong password)

**Dashboard Admin (5-6 screenshot)**
4. Dashboard overview - desktop
5. Dashboard overview - mobile
6. Stat cards close-up
7. Line chart transaksi
8. Bar chart produk terlaris
9. Tabel stok rendah

**Manajemen Barang (5-6 screenshot)**
10. List barang dengan filter
11. Modal tambah barang
12. Modal edit barang
13. Konfirmasi hapus barang
14. Search functionality
15. Filter by kategori

**Transaksi Masuk (4-5 screenshot)**
16. Halaman history transaksi masuk
17. Form tambah transaksi masuk
18. Form dengan items
19. Detail transaksi modal

**Point of Sale - Kasir (6-7 screenshot)**
20. POS interface - desktop
21. POS interface - mobile
22. Product selection & cart
23. Checkout modal
24. Payment calculation
25. Receipt/struk
26. Empty cart state

**History Transaksi Keluar (4-5 screenshot)**
27. List transaksi keluar
28. Filter by date
29. Detail transaksi modal
30. Print preview

**Laporan (3-4 screenshot)**
31. Halaman laporan
32. CSV export process
33. Opened CSV in Excel

**Responsive & UX (3-4 screenshot)**
34. Mobile navigation
35. Toast notification
36. Loading state
37. Error handling

**Database (2-3 screenshot)**
38. MySQL/phpMyAdmin - tables
39. Sample data in table

**Total: 38+ screenshots minimum**

### Cara mengambil screenshot berkualitas:

**Windows:**
- Win + Shift + S (Snipping Tool)
- Crop yang rapi
- Full HD resolution

**Tools recommended:**
- Lightshot (https://app.prntscr.com/)
- ShareX (https://getsharex.com/)
- Greenshot

### Format screenshot dalam PDF:
```
Halaman 1: Cover "Dokumentasi Screenshot Sistem Inventaris"
Halaman 2: Daftar isi screenshot
Halaman 3-40: Screenshot dengan:
  - Nomor urut
  - Caption/judul
  - Keterangan singkat (2-3 kalimat)
```

### Compile ke PDF:
- Microsoft Word → Save as PDF
- Google Slides → Download as PDF
- Adobe Acrobat

---

## 🌐 5. WEBSITE PUBLISHED (URL)

### Opsi Hosting:

**A. Heroku (Recommended - Free tier)**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create sistem-inventaris-umkm

# Add MySQL addon (ClearDB)
heroku addons:create cleardb:ignite

# Get database URL
heroku config | grep CLEARDB_DATABASE_URL

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key

# Deploy
git push heroku main

# Open app
heroku open
```

**B. Railway (Easy & Free)**
1. Buat akun di https://railway.app
2. New Project → Deploy from GitHub
3. Add MySQL database
4. Set environment variables
5. Deploy otomatis

**C. Vercel (Frontend) + PlanetScale (Database)**
- Frontend: https://vercel.com
- Database: https://planetscale.com
- Gratis untuk personal project

**D. Render (All-in-one)**
- https://render.com
- Free tier untuk web service + PostgreSQL

### Checklist sebelum publish:
- [ ] Environment variables configured
- [ ] Database di-migrate
- [ ] HTTPS enabled (SSL)
- [ ] CORS configured untuk production
- [ ] Demo account created
- [ ] README dengan demo credentials

### Demo Account yang harus ada:
```
Admin:
Username: admin
Password: demo123

Kasir:
Username: kasir_demo
Password: demo123
```

### URL Format:
```
Production URL: https://sistem-inventaris-umkm.herokuapp.com
```

Simpan URL ini untuk dikumpulkan!

---

## 🔗 6. REPOSITORY GIT

### Setup GitHub Repository:

**1. Buat Repository Baru**
```bash
# Via GitHub.com
1. New Repository
2. Nama: sistem-inventaris-umkm
3. Description: "Sistem Inventaris Gudang UMKM dengan Multi-Role & POS"
4. Public
5. Add README
6. License: MIT
```

**2. Push Project ke GitHub**
```bash
cd sistem-inventaris

# Initialize git (jika belum)
git init

# Add remote
git remote add origin https://github.com/[username]/sistem-inventaris-umkm.git

# Add all files
git add .

# Commit
git commit -m "Initial commit: Complete inventory system with multi-role authentication"

# Push
git push -u origin main
```

**3. Update README.md**

Pastikan README berisi:
- Judul & deskripsi
- Features list
- Tech stack
- Installation guide
- Demo credentials
- Screenshots
- License

Contoh README yang baik:
```markdown
# 📦 Sistem Inventaris Gudang UMKM

> Aplikasi web manajemen inventaris dengan fitur multi-role authentication, dashboard analytics, dan Point of Sale (POS)

## ✨ Features

- 🔐 Multi-role authentication (Admin & Kasir)
- 📊 Dashboard with Chart.js analytics
- 📦 CRUD manajemen barang
- 📥 Transaksi barang masuk
- 🛒 Point of Sale (POS) interface
- 📈 Export laporan CSV
- 📱 Responsive design

## 🛠️ Tech Stack

- Backend: Node.js, Express.js
- Database: MySQL
- Frontend: Vanilla JS, Bootstrap 5, Chart.js
- Auth: JWT, bcrypt

## 🚀 Installation

\`\`\`bash
# Clone repository
git clone https://github.com/[username]/sistem-inventaris-umkm.git
cd sistem-inventaris-umkm

# Install dependencies
npm install

# Setup database
mysql -u root -p < schema.sql

# Configure .env
cp .env.example .env
# Edit .env dengan kredensial database

# Run server
npm start
\`\`\`

## 🔑 Demo Credentials

**Admin:**
- Username: admin
- Password: password123

**Kasir:**
- Username: kasir1
- Password: password123

## 📸 Screenshots

![Dashboard](screenshots/dashboard.png)
![POS](screenshots/pos.png)

## 📄 License

MIT License - feel free to use for educational purposes
```

**4. Add .gitignore**

Pastikan file ini ada:
```
node_modules/
.env
*.log
.DS_Store
```

**5. Clean Commit History**

Tips commit message yang baik:
```
✅ Good:
- "feat: Add JWT authentication"
- "fix: Resolve datetime format error"
- "docs: Update README with installation guide"

❌ Bad:
- "update"
- "fix bugs"
- "test"
```

**6. Add License**

Pilih MIT License (paling umum):
- GitHub → Add file → Create new file
- Filename: LICENSE
- Choose template: MIT License

**7. Final Check**

Repository harus memiliki:
- [ ] README.md yang informatif
- [ ] .gitignore configured
- [ ] LICENSE file
- [ ] Clean commit history (min. 10 commits)
- [ ] No sensitive data (passwords, API keys)
- [ ] Screenshot folder (optional)
- [ ] Demo URL di README

### Repository URL Format:
```
https://github.com/[username]/sistem-inventaris-umkm
```

---

## 📋 FINAL SUBMISSION CHECKLIST

Sebelum submit, pastikan semua file ready:

### ✅ File yang Dikumpulkan:

```
📁 Submission Package/
│
├── 📄 Laporan_Inventaris_[NIM]_[Nama].pdf (50-80 halaman)
├── 📦 sistem-inventaris-source-code.zip (< 5 MB, no node_modules)
├── 🗄️ Database/
│   ├── schema.sql
│   ├── db_inventaris_export.sql
│   └── ERD_Diagram.png/pdf
├── 📸 Screenshot_Inventaris_[NIM].pdf (38+ screenshots)
├── 🔗 Links.txt
│   ├── Production URL: https://...
│   └── GitHub Repo: https://github.com/...
└── 📖 User_Manual.pdf (Optional tapi nilai plus)
```

### ✅ Verifikasi Kualitas:

**Laporan:**
- [ ] Typo sudah dicek (Grammarly/languagetool)
- [ ] Semua gambar HD dan jelas
- [ ] Numbering konsisten
- [ ] Referensi lengkap (min. 15)
- [ ] Abstrak maksimal 250 kata

**Source Code:**
- [ ] Bisa di-run tanpa error
- [ ] README installation guide jelas
- [ ] No hardcoded password
- [ ] Code commented dengan baik

**Database:**
- [ ] Schema bisa di-import tanpa error
- [ ] Data dummy cukup untuk testing
- [ ] ERD sesuai dengan implementasi

**Screenshot:**
- [ ] Semua fitur terdokumentasi
- [ ] Resolusi tinggi (min. 1920x1080)
- [ ] Tidak blur atau pixelated
- [ ] Caption jelas

**Website:**
- [ ] URL aktif dan accessible
- [ ] Demo account berfungsi
- [ ] Tidak ada error di console
- [ ] HTTPS enabled

**Repository:**
- [ ] Public & accessible
- [ ] README informatif
- [ ] Commit history clean
- [ ] No sensitive data

---

## 🎯 TIPS MENDAPAT NILAI MAKSIMAL

1. **Kelengkapan Dokumen** (30%)
   - Semua file dikumpulkan
   - Format sesuai ketentuan
   - Tidak ada yang missing

2. **Kualitas Laporan** (25%)
   - Penulisan akademik yang baik
   - Penjelasan teknis yang detail
   - Referensi credible
   - Layout profesional

3. **Implementasi Sistem** (25%)
   - Semua fitur berfungsi
   - UI/UX baik
   - No critical bugs
   - Code quality

4. **Pengujian** (10%)
   - Test case comprehensive
   - Hasil pengujian documented
   - Bug tracking

5. **Dokumentasi** (10%)
   - Screenshot lengkap
   - User manual jelas
   - Code commented
   - README informatif

**BONUS POINTS:**
- Deploy website live (+5%)
- User manual PDF (+5%)
- Video demo (+5%)
- Unit testing code (+5%)

---

## 🚨 COMMON MISTAKES TO AVOID

❌ **JANGAN:**
1. Submit file corrupt atau tidak bisa dibuka
2. Include node_modules dalam ZIP (file terlalu besar)
3. Hardcode password di source code
4. Screenshot blur atau terlalu kecil
5. Laporan copy-paste dari internet (plagiarism)
6. URL website tidak aktif saat dikumpulkan
7. Database tidak bisa di-import
8. Typo banyak di laporan
9. Referensi < 15 atau tidak relevan
10. Tidak ada demo account

✅ **LAKUKAN:**
1. Test semua file sebelum submit
2. Backup di multiple locations (Google Drive, USB, Email)
3. Submit 1-2 hari sebelum deadline
4. Minta teman review sebelum submit
5. Dokumentasi lengkap dan rapi
6. Code clean dan commented
7. Demo account yang mudah diingat
8. URL pendek dan profesional
9. README informatif
10. Laporan proofread minimal 2x

---

## 📞 SUPPORT & HELP

Jika ada kendala:

**1. Technical Issues:**
- Stack Overflow: https://stackoverflow.com
- GitHub Issues: Cari repository similar
- Discord: Programmer Indonesia

**2. Writing Issues:**
- Grammarly: https://grammarly.com
- Hemingway Editor: http://hemingwayapp.com
- Ask ChatGPT untuk proofread

**3. Deployment Issues:**
- Heroku Docs: https://devcenter.heroku.com
- Railway Docs: https://docs.railway.app
- YouTube tutorials

**4. Database Issues:**
- MySQL Documentation
- phpMyAdmin forum
- Database Administrators Stack Exchange

---

## ⏰ TIMELINE RECOMMENDED

**2 Minggu Sebelum Deadline:**
- [ ] Finalisasi coding
- [ ] Fix all bugs
- [ ] Testing comprehensive

**1 Minggu Sebelum Deadline:**
- [ ] Deploy website
- [ ] Setup GitHub repository
- [ ] Ambil semua screenshot
- [ ] Mulai tulis laporan

**3 Hari Sebelum Deadline:**
- [ ] Finalisasi laporan
- [ ] Review & proofread
- [ ] Prepare all files

**1 Hari Sebelum Deadline:**
- [ ] Compile semua file
- [ ] Test semua file (bisa dibuka?)
- [ ] Backup ke cloud
- [ ] SUBMIT!

---

**Good luck! 🚀📚**

Remember: Kualitas > Kuantitas. Better to have a complete, well-documented project than a half-baked one with many features.
