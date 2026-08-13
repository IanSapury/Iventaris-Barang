# 📖 USER MANUAL - SISTEM INVENTARIS UMKM

## Daftar Isi
1. [Pendahuluan](#pendahuluan)
2. [Persyaratan Sistem](#persyaratan-sistem)
3. [Instalasi](#instalasi)
4. [Login](#login)
5. [Panduan Admin](#panduan-admin)
6. [Panduan Kasir](#panduan-kasir)
7. [FAQ & Troubleshooting](#faq--troubleshooting)

---

## 1. Pendahuluan

### 1.1 Tentang Sistem
Sistem Inventaris UMKM adalah aplikasi berbasis web untuk mengelola stok barang, transaksi masuk/keluar, dan penjualan. Sistem ini dirancang khusus untuk kebutuhan UMKM dengan interface yang mudah digunakan.

### 1.2 Fitur Utama
- ✅ Multi-user dengan role Admin dan Kasir
- ✅ Dashboard analytics real-time
- ✅ Manajemen barang lengkap (CRUD)
- ✅ Pencatatan barang masuk
- ✅ Point of Sale (POS) untuk kasir
- ✅ History transaksi
- ✅ Export laporan CSV
- ✅ Responsive (Desktop & Mobile)

### 1.3 User Role
**Admin:**
- Akses penuh ke semua fitur
- Dapat mengelola barang
- Dapat melihat semua transaksi
- Dapat export laporan

**Kasir:**
- Akses terbatas ke POS
- Dapat melakukan transaksi penjualan
- Dapat melihat history transaksi sendiri

---

## 2. Persyaratan Sistem

### 2.1 Minimum Requirements
- **Browser:** Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Screen Resolution:** 1366x768 atau lebih tinggi
- **Internet:** Koneksi stabil min. 1 Mbps
- **JavaScript:** Harus enabled

### 2.2 Recommended
- **Browser:** Chrome versi terbaru
- **Screen Resolution:** 1920x1080
- **Internet:** Koneksi 5 Mbps atau lebih
- **Device:** Desktop/Laptop untuk pengalaman optimal

---

## 3. Instalasi

### 3.1 Akses Online
Jika sistem sudah di-deploy:
```
URL: https://sistem-inventaris-umkm.herokuapp.com
```

Tidak perlu instalasi, cukup buka URL di browser.

### 3.2 Instalasi Lokal (Development)

**Langkah 1: Install Prerequisites**
- Node.js v14+ (Download: https://nodejs.org)
- MySQL v5.7+ (Download: https://dev.mysql.com/downloads/)

**Langkah 2: Download Source Code**
```bash
git clone https://github.com/[username]/sistem-inventaris-umkm.git
cd sistem-inventaris-umkm
```

**Langkah 3: Install Dependencies**
```bash
npm install
```

**Langkah 4: Setup Database**
```bash
mysql -u root -p
# Masukkan password MySQL
# Kemudian:
source schema.sql
exit
```

**Langkah 5: Konfigurasi Environment**
```bash
cp .env.example .env
```

Edit file `.env`:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=db_inventaris
PORT=3000
```

**Langkah 6: Jalankan Server**
```bash
npm start
```

**Langkah 7: Akses Aplikasi**
Buka browser: `http://localhost:3000`

---

## 4. Login

### 4.1 Halaman Login

![Login Page](screenshots/login.png)

**Langkah-langkah:**
1. Buka URL aplikasi
2. Masukkan username
3. Masukkan password
4. Klik tombol "Masuk"

### 4.2 Default Credentials

**Admin:**
```
Username: admin
Password: password123
```

**Kasir:**
```
Username: kasir1
Password: password123
```

### 4.3 Troubleshooting Login

**Error: "Username atau password salah"**
- Cek caps lock tidak aktif
- Pastikan username & password benar
- Jangan ada spasi di awal/akhir

**Error: "Akses ditolak"**
- Server mungkin tidak running
- Cek koneksi internet
- Contact administrator

**Auto-Redirect setelah Login:**
- Admin → Dashboard
- Kasir → POS

---

## 5. Panduan Admin

### 5.1 Dashboard

![Dashboard](screenshots/dashboard.png)

**Komponen Dashboard:**

**A. Statistics Cards**
- Pendapatan Hari Ini: Total penjualan hari ini
- Pendapatan Bulan Ini: Total penjualan bulan berjalan
- Total Barang: Jumlah item di inventory
- Kategori Produk: Jumlah kategori

**B. Charts**
- **Line Chart:** Tren transaksi 7 hari terakhir
- **Bar Chart:** Top 5 produk terlaris

**C. Tables**
- **Stok Rendah:** Barang dengan stok < 10
- **Transaksi Terakhir:** 5 transaksi penjualan terbaru

**Fitur:**
- Refresh otomatis setiap 5 menit
- Real-time clock
- Click chart untuk detail

---

### 5.2 Manajemen Barang

![Barang Page](screenshots/barang.png)

#### 5.2.1 Melihat Daftar Barang

**Fitur Filter:**
- **Search:** Cari berdasarkan kode/nama/kategori
- **Filter Kategori:** Pilih kategori spesifik
- **Filter Stok:** 
  - Semua Stok
  - Tersedia (> 10)
  - Stok Rendah (1-10)
  - Habis (0)

**Informasi pada Tabel:**
- Kode Barang
- Nama Barang
- Kategori
- Stok (dengan badge warna)
- Harga
- Aksi (Edit/Hapus)

#### 5.2.2 Tambah Barang Baru

![Tambah Barang](screenshots/tambah-barang.png)

**Langkah-langkah:**
1. Klik tombol "Tambah Barang" (kanan atas)
2. Isi form:
   - **Kode Barang:** Kode unik (contoh: BRG-001)
   - **Nama Barang:** Nama produk
   - **Kategori:** Pilih dari dropdown
   - **Stok:** Jumlah awal stok
   - **Satuan:** pcs/unit/kg/box/liter
   - **Harga:** Harga jual per satuan
   - **Keterangan:** Optional
3. Klik "Simpan"

**Validasi:**
- Kode barang tidak boleh duplikat
- Semua field wajib (kecuali keterangan)
- Stok & harga harus angka

**Tips:**
- Gunakan kode yang konsisten (BRG-XXX)
- Pastikan kategori sudah dibuat
- Harga dalam Rupiah tanpa titik/koma

#### 5.2.3 Edit Barang

**Langkah-langkah:**
1. Cari barang yang akan diedit
2. Klik icon pensil (Edit)
3. Ubah data yang diperlukan
4. Klik "Simpan"

**Yang bisa diubah:**
- Semua field kecuali stok (stok via transaksi)

#### 5.2.4 Hapus Barang

**Langkah-langkah:**
1. Klik icon trash (Hapus)
2. Konfirmasi penghapusan
3. Barang akan dihapus permanent

⚠️ **Perhatian:**
- Data yang dihapus tidak bisa dikembalikan
- Barang yang sudah ada di transaksi tidak bisa dihapus

---

### 5.3 Transaksi Barang Masuk

![Transaksi Masuk](screenshots/transaksi-masuk.png)

#### 5.3.1 Melihat History

**Fitur Filter:**
- Search: Nomor transaksi/supplier
- Filter tanggal: Hari Ini/Bulan Ini/Semua

**Informasi pada Tabel:**
- Nomor Transaksi (auto-generated)
- Tanggal & Waktu
- Supplier
- Total Item
- Admin yang input

#### 5.3.2 Input Barang Masuk

![Form Barang Masuk](screenshots/form-barang-masuk.png)

**Langkah-langkah:**
1. Klik "Tambah Transaksi Masuk"
2. Isi informasi header:
   - **No. Transaksi:** Auto-generated (MSK-YYYYMMDD-XXX)
   - **Tanggal:** Pilih tanggal/waktu
   - **Supplier:** Nama pemasok (optional)
   - **Keterangan:** Note tambahan (optional)

3. Tambah Items:
   - Pilih barang dari dropdown
   - Input jumlah
   - Input harga beli
   - Klik "Tambah"
   - Ulangi untuk item lain

4. Review items di tabel
5. Klik "Simpan Transaksi"

**Hasil:**
- Stok barang otomatis bertambah
- Transaksi tercatat di history

**Tips:**
- Input segera setelah barang diterima
- Simpan nota supplier untuk referensi
- Double check jumlah sebelum save

#### 5.3.3 Lihat Detail Transaksi

**Langkah-langkah:**
1. Klik icon mata pada transaksi
2. Modal detail akan muncul
3. Informasi lengkap ditampilkan:
   - Header transaksi
   - List items dengan harga
   - Total item

---

### 5.4 History Transaksi Keluar

![Transaksi Keluar](screenshots/transaksi-keluar.png)

#### 5.4.1 Melihat History Penjualan

**Fitur Filter:**
- Search: Nomor transaksi/pelanggan/kasir
- Filter tanggal: Hari Ini/Minggu Ini/Bulan Ini/Semua

**Statistik Ditampilkan:**
- Total Penjualan (Rupiah)
- Total Transaksi (jumlah)
- Total Item Terjual

**Informasi Tabel:**
- Nomor Transaksi
- Tanggal & Waktu
- Pelanggan
- Total Item
- Total Harga
- Kasir

#### 5.4.2 Lihat Detail Transaksi

![Detail Transaksi](screenshots/detail-transaksi.png)

**Informasi Detail:**
- Header: No. transaksi, tanggal, pelanggan, kasir
- Items: Daftar barang yang dibeli
- Pembayaran: Total, bayar, kembalian

**Aksi:**
- Print: Cetak ulang struk

---

### 5.5 Laporan

![Laporan](screenshots/laporan.png)

#### 5.5.1 Jenis Laporan

**A. Laporan Stok Barang**
- Daftar lengkap semua barang
- Informasi: Kode, nama, kategori, stok, harga
- Status stok (Habis/Rendah/Tersedia)

**B. Laporan Penjualan**
- Semua transaksi keluar
- Informasi: No. transaksi, tanggal, pelanggan, total, kasir

**C. Laporan Barang Masuk**
- History barang masuk
- Informasi: No. transaksi, tanggal, supplier, items

**D. Laporan Stok Rendah**
- Barang dengan stok < 10
- Untuk restock planning

#### 5.5.2 Export Laporan

**Langkah-langkah:**
1. Pilih jenis laporan
2. Klik tombol "Download Laporan [Jenis]"
3. File CSV akan terdownload
4. Buka dengan Excel/Google Sheets

**Format File:**
- Nama: Laporan_[Jenis]_YYYYMMDD.csv
- Encoding: UTF-8 (support Bahasa Indonesia)
- Delimiter: Comma (,)

**Tips:**
- Export secara berkala untuk backup
- Gunakan Excel untuk analisis lanjut
- Filter tanggal di halaman history sebelum export

---

### 5.6 Logout

**Cara Logout:**
1. Klik tombol "Logout" di sidebar (bawah)
2. Konfirmasi logout
3. Akan redirect ke halaman login

⚠️ **Keamanan:**
- Selalu logout setelah selesai
- Jangan tinggalkan komputer saat login
- Jangan share password

---

## 6. Panduan Kasir

### 6.1 Point of Sale (POS)

![POS Interface](screenshots/pos.png)

#### 6.1.1 Tampilan POS

**Layout:**
- **Kiri:** Product grid & search
- **Kanan:** Shopping cart & checkout

**Komponen:**
- User badge (nama kasir)
- Search bar
- Category filter
- Product cards
- Shopping cart
- Total & checkout button

#### 6.1.2 Pilih Produk

**Cara Memilih:**
1. **Scroll** atau **Search** produk
2. **Klik** card produk untuk add to cart
3. Produk otomatis masuk cart dengan qty 1

**Fitur Search:**
- Cari berdasarkan kode atau nama
- Real-time filtering
- Clear button untuk reset

**Filter Kategori:**
- Semua: Tampilkan semua produk
- Pilih kategori spesifik

**Informasi Product Card:**
- Icon produk
- Kode barang
- Nama produk
- Harga
- Status stok (badge warna)

#### 6.1.3 Kelola Cart

![Shopping Cart](screenshots/cart.png)

**Fitur Cart:**

**A. Adjust Quantity**
- **Plus (+):** Tambah qty
- **Minus (-):** Kurang qty
- **Remove (X):** Hapus dari cart

**B. Validasi Otomatis**
- Qty tidak bisa > stok tersedia
- Subtotal auto-calculate
- Total auto-update

**C. Clear Cart**
- Tombol "Bersihkan"
- Konfirmasi sebelum clear

**Tips:**
- Check stok sebelum add qty banyak
- Double check sebelum checkout

#### 6.1.4 Checkout & Pembayaran

![Checkout Modal](screenshots/checkout.png)

**Langkah Checkout:**

1. **Review Cart**
   - Pastikan items & qty benar
   - Total sudah sesuai

2. **Klik "Checkout"**

3. **Isi Form Pembayaran:**
   - **Nama Pelanggan:** Optional (default: Walk-in Customer)
   - **Jumlah Bayar:** Wajib diisi

4. **Auto-Calculate Kembalian**
   - Otomatis hitung saat input bayar
   - Muncul di box hijau

5. **Validasi:**
   - Bayar harus ≥ Total
   - Error jika bayar kurang

6. **Klik "Proses Pembayaran"**

7. **Transaksi Berhasil:**
   - Stok otomatis berkurang
   - Nomor transaksi auto-generated
   - Struk muncul

#### 6.1.5 Print Struk

![Struk](screenshots/struk.png)

**Informasi Struk:**
- Header toko
- Nomor transaksi
- Tanggal & waktu
- Kasir & pelanggan
- List items (qty × harga)
- Total, bayar, kembalian
- Footer (terima kasih)

**Aksi:**
- **Print:** Cetak struk (Ctrl+P)
- **Tutup:** Close modal

**Tips:**
- Pastikan printer ready
- Check preview sebelum print
- Simpan struk untuk customer

#### 6.1.6 History (Kasir)

**Akses:**
Kasir hanya bisa lihat transaksi sendiri

**Filter:**
- Hari ini
- Minggu ini
- Semua

---

## 7. FAQ & Troubleshooting

### 7.1 Frequently Asked Questions

**Q: Lupa password, bagaimana reset?**
A: Hubungi administrator untuk reset password. Admin bisa update di database.

**Q: Bisa akses dari HP?**
A: Ya, sistem responsive dan bisa diakses dari mobile browser.

**Q: Apakah data aman?**
A: Ya, password di-encrypt dengan bcrypt dan ada JWT authentication.

**Q: Berapa user yang bisa login bersamaan?**
A: Unlimited, sistem support multi-user concurrent.

**Q: Apakah ada backup otomatis?**
A: Admin perlu export database manual secara berkala.

**Q: Bisa custom laporan?**
A: Export CSV dan olah di Excel untuk custom report.

**Q: Stok salah, bagaimana koreksi?**
A: Admin bisa edit stok via transaksi masuk.

**Q: Bisa hapus transaksi yang salah?**
A: Tidak bisa hapus untuk audit trail. Buat transaksi koreksi.

**Q: Apakah bisa print barcode?**
A: Fitur belum tersedia di versi ini.

**Q: Limit maksimal barang?**
A: Tidak ada limit, tergantung kapasitas database.

---

### 7.2 Common Issues

#### Issue 1: "Gagal memuat data"

**Penyebab:**
- Koneksi internet terputus
- Server down

**Solusi:**
1. Check koneksi internet
2. Refresh page (F5)
3. Logout → Login lagi
4. Contact admin jika masih error

---

#### Issue 2: Login berhasil tapi redirect kosong

**Penyebab:**
- Cache browser
- Cookie blocked

**Solusi:**
1. Clear browser cache (Ctrl+Shift+Del)
2. Check cookie settings (allow)
3. Try incognito mode
4. Try different browser

---

#### Issue 3: Transaksi gagal "Stok tidak cukup"

**Penyebab:**
- Stok habis atau kurang
- Data belum refresh

**Solusi:**
1. Check stok di halaman barang
2. Refresh page
3. Input barang masuk dulu (admin)

---

#### Issue 4: Chart tidak muncul

**Penyebab:**
- JavaScript error
- Data kosong

**Solusi:**
1. Check console (F12)
2. Refresh page
3. Clear cache
4. Pastikan ada data transaksi

---

#### Issue 5: CSV tidak bisa dibuka di Excel

**Penyebab:**
- Encoding issue

**Solusi:**
1. Buka Excel
2. Data → From Text/CSV
3. Pilih file
4. Encoding: UTF-8
5. Delimiter: Comma

---

#### Issue 6: Print tidak berfungsi

**Penyebab:**
- Pop-up blocked
- Printer not ready

**Solusi:**
1. Allow pop-up di browser
2. Check printer connection
3. Try print preview first (Ctrl+P)

---

### 7.3 Error Messages

| Error | Arti | Solusi |
|-------|------|--------|
| "Username atau password salah" | Kredensial tidak valid | Check username & password |
| "Akses ditolak" | Tidak punya permission | Login dengan role yang benar |
| "Token tidak valid" | Session expired | Logout → Login lagi |
| "Kode barang sudah ada" | Duplikat kode | Gunakan kode yang berbeda |
| "Kategori tidak ditemukan" | Kategori belum dibuat | Buat kategori dulu |
| "Stok tidak mencukupi" | Stok habis | Input barang masuk |
| "Jumlah bayar kurang" | Bayar < Total | Input bayar yang cukup |
| "Nomor transaksi sudah ada" | Duplikat nomor | Refresh & generate ulang |
| "Gagal menyimpan" | Database error | Contact administrator |

---

### 7.4 Browser Compatibility

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Supported |
| Opera | Latest | ✅ Supported |
| IE 11 | Any | ❌ Not Supported |

---

### 7.5 Performance Tips

**Untuk Admin:**
- Export laporan saat jam sepi
- Limit search result dengan filter
- Clear browser cache berkala
- Close unused tabs

**Untuk Kasir:**
- Gunakan product code untuk search cepat
- Pre-load cart untuk pelanggan reguler
- Logout saat break

---

### 7.6 Security Best Practices

**DO:**
✅ Logout setelah selesai
✅ Gunakan password strong
✅ Jangan share account
✅ Lock screen saat tinggal
✅ Update password berkala

**DON'T:**
❌ Share password
❌ Login di komputer public
❌ Save password di browser shared
❌ Tinggalkan komputer tanpa lock
❌ Screenshot kredensial

---

### 7.7 Contact Support

**Technical Support:**
- Email: support@sistemInventaris.com
- Phone: 0812-3456-7890
- WhatsApp: 0812-3456-7890
- Jam Operasional: 08:00 - 17:00 WIB

**Emergency (Critical Bug):**
- Phone: 0812-3456-7890 (24/7)

**Feature Request:**
- Email: feature-request@sistemInventaris.com

---

### 7.8 System Updates

**Update Schedule:**
- Minor updates: Bulanan
- Major updates: 3 bulan sekali
- Security patches: As needed

**Update Process:**
- Notifikasi via email
- Downtime: < 1 jam
- Backup otomatis sebelum update

---

## Appendix

### A. Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl + K | Focus search |
| Ctrl + S | Save form |
| Esc | Close modal |
| F5 | Refresh page |
| Ctrl + P | Print |
| Alt + L | Logout |

### B. Glossary

- **CRUD:** Create, Read, Update, Delete
- **POS:** Point of Sale
- **JWT:** JSON Web Token
- **CSV:** Comma-Separated Values
- **API:** Application Programming Interface
- **Session:** User login period
- **Token:** Authentication credential

### C. System Limits

| Item | Limit |
|------|-------|
| Max items per transaction | Unlimited |
| Max product name length | 150 characters |
| Max product code length | 50 characters |
| Session timeout | 8 hours |
| Max file upload | 5 MB |
| Max concurrent users | Unlimited |

---

**Document Version:** 1.0  
**Last Updated:** 2024  
**Author:** Development Team  
**Contact:** support@sistemInventaris.com

---

END OF USER MANUAL
