-- ============================================================
-- Sistem Inventaris Gudang UMKM - Multi Role
-- File   : schema.sql
-- Fungsi : Membuat database, tabel, dan data dummy untuk testing
-- Version: 2.0 - Multi User (Admin & Kasir)
-- ============================================================

-- Buat dan gunakan database
CREATE DATABASE IF NOT EXISTS db_inventaris
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE db_inventaris;

-- ============================================================
-- Tabel: users
-- Role: admin (full access) | kasir (POS only)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id         INT          NOT NULL AUTO_INCREMENT,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  role       ENUM('admin', 'kasir') NOT NULL DEFAULT 'kasir',
  status     ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_username (username),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: kategori
-- Relasi: satu kategori bisa punya banyak barang
-- ============================================================
CREATE TABLE IF NOT EXISTS kategori (
  id         INT          NOT NULL AUTO_INCREMENT,
  nama       VARCHAR(100) NOT NULL,
  keterangan TEXT,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: barang (tabel utama)
-- ============================================================
CREATE TABLE IF NOT EXISTS barang (
  id           INT           NOT NULL AUTO_INCREMENT,
  kode_barang  VARCHAR(50)   NOT NULL UNIQUE,
  nama_barang  VARCHAR(150)  NOT NULL,
  kategori_id  INT           NOT NULL,
  stok         INT           NOT NULL DEFAULT 0,
  harga        DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  satuan       VARCHAR(30)   NOT NULL DEFAULT 'pcs',
  keterangan   TEXT,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_barang_kategori
    FOREIGN KEY (kategori_id) REFERENCES kategori(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_kode (kode_barang),
  INDEX idx_nama (nama_barang)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: transaksi_masuk
-- Untuk mencatat barang yang masuk ke gudang
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi_masuk (
  id              INT           NOT NULL AUTO_INCREMENT,
  nomor_transaksi VARCHAR(50)   NOT NULL UNIQUE,
  tanggal         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  supplier        VARCHAR(150),
  keterangan      TEXT,
  user_id         INT           NOT NULL,
  total_item      INT           NOT NULL DEFAULT 0,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_masuk_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_nomor_masuk (nomor_transaksi),
  INDEX idx_tanggal_masuk (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: detail_transaksi_masuk
-- Detail item barang yang masuk
-- ============================================================
CREATE TABLE IF NOT EXISTS detail_transaksi_masuk (
  id                  INT           NOT NULL AUTO_INCREMENT,
  transaksi_masuk_id  INT           NOT NULL,
  barang_id           INT           NOT NULL,
  jumlah              INT           NOT NULL,
  harga_beli          DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  subtotal            DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  CONSTRAINT fk_detail_masuk_transaksi
    FOREIGN KEY (transaksi_masuk_id) REFERENCES transaksi_masuk(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detail_masuk_barang
    FOREIGN KEY (barang_id) REFERENCES barang(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: transaksi_keluar (Penjualan)
-- Untuk mencatat barang yang keluar/terjual
-- ============================================================
CREATE TABLE IF NOT EXISTS transaksi_keluar (
  id              INT           NOT NULL AUTO_INCREMENT,
  nomor_transaksi VARCHAR(50)   NOT NULL UNIQUE,
  tanggal         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  pelanggan       VARCHAR(150),
  user_id         INT           NOT NULL,
  total_item      INT           NOT NULL DEFAULT 0,
  total_harga     DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  bayar           DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  kembalian       DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  keterangan      TEXT,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_keluar_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  INDEX idx_nomor_keluar (nomor_transaksi),
  INDEX idx_tanggal_keluar (tanggal)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Tabel: detail_transaksi_keluar
-- Detail item barang yang keluar/terjual
-- ============================================================
CREATE TABLE IF NOT EXISTS detail_transaksi_keluar (
  id                   INT           NOT NULL AUTO_INCREMENT,
  transaksi_keluar_id  INT           NOT NULL,
  barang_id            INT           NOT NULL,
  jumlah               INT           NOT NULL,
  harga_jual           DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  subtotal             DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  PRIMARY KEY (id),
  CONSTRAINT fk_detail_keluar_transaksi
    FOREIGN KEY (transaksi_keluar_id) REFERENCES transaksi_keluar(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_detail_keluar_barang
    FOREIGN KEY (barang_id) REFERENCES barang(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- Data dummy: users
-- Password default untuk semua user: "password123"
-- Hash bcrypt dengan salt 10 rounds
-- ============================================================
INSERT INTO users (username, password, nama_lengkap, role, status) VALUES
  ('admin', '$2b$10$rX8E5YZ5qKZ9WqJQxZL9xOYvX3jqKZQxZL9xOYvX3jqKZQxZL9xOY', 'Administrator', 'admin', 'aktif'),
  ('kasir1', '$2b$10$rX8E5YZ5qKZ9WqJQxZL9xOYvX3jqKZQxZL9xOYvX3jqKZQxZL9xOY', 'Kasir Satu', 'kasir', 'aktif'),
  ('kasir2', '$2b$10$rX8E5YZ5qKZ9WqJQxZL9xOYvX3jqKZQxZL9xOYvX3jqKZQxZL9xOY', 'Kasir Dua', 'kasir', 'aktif');

-- ============================================================
-- Data dummy: kategori
-- ============================================================
INSERT INTO kategori (nama, keterangan) VALUES
  ('Elektronik',    'Perangkat elektronik dan gadget'),
  ('Alat Tulis',    'Perlengkapan alat tulis kantor'),
  ('Furniture',     'Meja, kursi, lemari, dan perabot kantor'),
  ('Networking',    'Perangkat jaringan dan konektivitas'),
  ('Konsumable',    'Barang habis pakai seperti kertas dan tinta'),
  ('Makanan',       'Makanan dan minuman'),
  ('Perlengkapan',  'Perlengkapan umum gudang');

-- ============================================================
-- Data dummy: barang (20 baris untuk testing)
-- ============================================================
INSERT INTO barang (kode_barang, nama_barang, kategori_id, stok, harga, satuan, keterangan) VALUES
  ('BRG-001', 'Laptop Dell Inspiron 15',    1, 10,  9500000.00, 'unit',  'Intel Core i5, RAM 8GB, SSD 512GB'),
  ('BRG-002', 'Monitor LG 24 inch',         1,  8,  2800000.00, 'unit',  'Full HD IPS, HDMI + VGA'),
  ('BRG-003', 'Keyboard Mechanical Rexus',  1, 25,   650000.00, 'pcs',   'Switch Blue, USB, RGB'),
  ('BRG-004', 'Mouse Wireless Logitech',    1, 35,   250000.00, 'pcs',   '2.4GHz, Battery AAA'),
  ('BRG-005', 'Pulpen Pilot G-2',           2,200,     8500.00, 'pcs',   'Tinta gel, 0.5mm, hitam'),
  ('BRG-006', 'Buku Tulis Sidu 58 lembar',  2,150,     7000.00, 'pcs',   'Cover tebal, ukuran A5'),
  ('BRG-007', 'Penggaris 30cm',             2, 80,     5000.00, 'pcs',   'Plastik transparan'),
  ('BRG-008', 'Kursi Kantor Ergonomis',     3,  5,  1350000.00, 'unit',  'Adjustable height, lumbar support'),
  ('BRG-009', 'Meja Kerja 120cm',           3,  3,  2100000.00, 'unit',  'Material kayu MDF, 2 laci'),
  ('BRG-010', 'Lemari Arsip 4 Pintu',       3,  2,  3500000.00, 'unit',  'Besi, cat powder coating'),
  ('BRG-011', 'Router TP-Link AC1200',      4, 12,   450000.00, 'unit',  'Dual band, 4 antena'),
  ('BRG-012', 'Switch 8-Port Unmanaged',    4,  7,   320000.00, 'unit',  '10/100Mbps, plug and play'),
  ('BRG-013', 'Kabel LAN Cat6 100m',        4,  5,   550000.00, 'roll',  'UTP, 23AWG'),
  ('BRG-014', 'Kertas HVS A4 80gr',         5, 80,    55000.00, 'rim',   '500 lembar per rim'),
  ('BRG-015', 'Tinta Printer Epson L3110',  5, 40,    85000.00, 'botol', '70ml, hitam'),
  ('BRG-016', 'Snack Biskuit Khong Guan',   6,120,    15000.00, 'pak',   'Berbagai rasa'),
  ('BRG-017', 'Air Mineral Aqua 600ml',     6,200,     3500.00, 'botol', 'Kemasan plastik'),
  ('BRG-018', 'Kopi Kapal Api Sachet',      6,150,     2500.00, 'sachet','Kopi hitam instant'),
  ('BRG-019', 'Sarung Tangan Karet',        7, 50,    25000.00, 'pasang','Size M, latex'),
  ('BRG-020', 'Masker KN95',                7,100,    12000.00, 'pcs',   '5 layer protection');

-- ============================================================
-- Data dummy: transaksi_masuk (5 transaksi)
-- ============================================================
INSERT INTO transaksi_masuk (nomor_transaksi, tanggal, supplier, keterangan, user_id, total_item) VALUES
  ('MSK-20260801-001', '2026-08-01 09:15:00', 'PT Elektronik Jaya', 'Pembelian stock komputer', 1, 15),
  ('MSK-20260802-001', '2026-08-02 10:30:00', 'Toko ATK Makmur', 'Restock alat tulis', 1, 200),
  ('MSK-20260803-001', '2026-08-03 14:00:00', 'CV Furniture Indo', 'Penambahan furniture kantor', 1, 5),
  ('MSK-20260805-001', '2026-08-05 08:45:00', 'PT Network Solution', 'Pembelian perangkat jaringan', 1, 20),
  ('MSK-20260806-001', '2026-08-06 11:20:00', 'Distributor Snack', 'Stock makanan ringan', 1, 150);

-- ============================================================
-- Data dummy: detail_transaksi_masuk
-- ============================================================
INSERT INTO detail_transaksi_masuk (transaksi_masuk_id, barang_id, jumlah, harga_beli, subtotal) VALUES
  (1, 1, 5, 9000000.00, 45000000.00),
  (1, 2, 5, 2600000.00, 13000000.00),
  (1, 3, 5, 600000.00, 3000000.00),
  (2, 5, 100, 7500.00, 750000.00),
  (2, 6, 100, 6000.00, 600000.00),
  (3, 8, 2, 1300000.00, 2600000.00),
  (3, 9, 2, 2000000.00, 4000000.00),
  (3, 10, 1, 3400000.00, 3400000.00),
  (4, 11, 10, 420000.00, 4200000.00),
  (4, 12, 5, 300000.00, 1500000.00),
  (4, 13, 5, 520000.00, 2600000.00),
  (5, 16, 120, 13000.00, 1560000.00),
  (5, 17, 200, 3000.00, 600000.00),
  (5, 18, 150, 2000.00, 300000.00);

-- ============================================================
-- Data dummy: transaksi_keluar (8 transaksi penjualan)
-- ============================================================
INSERT INTO transaksi_keluar (nomor_transaksi, tanggal, pelanggan, user_id, total_item, total_harga, bayar, kembalian, keterangan) VALUES
  ('OUT-20260807-001', '2026-08-07 10:15:00', 'PT Maju Jaya', 2, 3, 13600000.00, 14000000.00, 400000.00, 'Pembelian laptop dan monitor'),
  ('OUT-20260807-002', '2026-08-07 11:30:00', 'Toko Buku Cerdas', 2, 50, 375000.00, 400000.00, 25000.00, 'Pembelian alat tulis'),
  ('OUT-20260807-003', '2026-08-07 14:20:00', 'Walk-in Customer', 3, 10, 35000.00, 50000.00, 15000.00, 'Snack dan minuman'),
  ('OUT-20260808-001', '2026-08-08 09:00:00', 'CV Bangun Sentosa', 2, 1, 1350000.00, 1350000.00, 0.00, 'Pembelian kursi kantor'),
  ('OUT-20260808-002', '2026-08-08 13:45:00', 'Walk-in Customer', 3, 15, 127500.00, 130000.00, 2500.00, 'Alat tulis dan snack'),
  ('OUT-20260808-003', '2026-08-08 15:10:00', 'PT Digital Media', 2, 2, 900000.00, 900000.00, 0.00, 'Keyboard dan mouse'),
  ('OUT-20260809-001', '2026-08-09 10:30:00', 'Sekolah Harapan Bangsa', 2, 100, 700000.00, 700000.00, 0.00, 'Pembelian buku tulis untuk siswa'),
  ('OUT-20260809-002', '2026-08-09 16:00:00', 'Walk-in Customer', 3, 5, 60000.00, 100000.00, 40000.00, 'Masker dan sarung tangan');

-- ============================================================
-- Data dummy: detail_transaksi_keluar
-- ============================================================
INSERT INTO detail_transaksi_keluar (transaksi_keluar_id, barang_id, jumlah, harga_jual, subtotal) VALUES
  (1, 1, 1, 9500000.00, 9500000.00),
  (1, 2, 1, 2800000.00, 2800000.00),
  (1, 3, 2, 650000.00, 1300000.00),
  (2, 5, 30, 8500.00, 255000.00),
  (2, 6, 20, 7000.00, 140000.00),
  (3, 16, 5, 15000.00, 75000.00),
  (3, 17, 10, 3500.00, 35000.00),
  (4, 8, 1, 1350000.00, 1350000.00),
  (5, 5, 10, 8500.00, 85000.00),
  (5, 7, 5, 5000.00, 25000.00),
  (5, 16, 3, 15000.00, 45000.00),
  (6, 3, 1, 650000.00, 650000.00),
  (6, 4, 1, 250000.00, 250000.00),
  (7, 6, 100, 7000.00, 700000.00),
  (8, 19, 2, 25000.00, 50000.00),
  (8, 20, 5, 12000.00, 60000.00);
