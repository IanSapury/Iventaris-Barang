// ============================================================
// laporan.js
// Export Laporan ke CSV (Admin Only)
// ============================================================

if (!Auth.requireAdmin()) {
  throw new Error('Access denied');
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  const user = Auth.getUser();
  document.getElementById('user-name').textContent = user.nama_lengkap;

  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) Auth.logout();
  });

  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });
});

// ===== EXPORT TO CSV =====
function exportToCSV(data, filename) {
  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// ===== LAPORAN STOK BARANG =====
async function exportLaporanStok() {
  try {
    Utils.showToast('Mengunduh laporan...', 'info');
    
    const result = await API.barang.getAll();
    
    if (result.success) {
      const data = [
        ['No', 'Kode Barang', 'Nama Barang', 'Kategori', 'Stok', 'Satuan', 'Harga', 'Status Stok']
      ];

      result.data.forEach((item, index) => {
        const status = item.stok === 0 ? 'Habis' : 
                      item.stok <= 10 ? 'Stok Rendah' : 'Tersedia';
        
        data.push([
          index + 1,
          item.kode_barang,
          `"${item.nama_barang}"`,
          item.nama_kategori,
          item.stok,
          item.satuan,
          item.harga,
          status
        ]);
      });

      const now = new Date();
      const filename = `Laporan_Stok_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
      
      exportToCSV(data, filename);
      Utils.showToast('Laporan berhasil diunduh', 'success');
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal mengunduh laporan', 'error');
  }
}

// ===== LAPORAN PENJUALAN =====
async function exportLaporanPenjualan() {
  try {
    Utils.showToast('Mengunduh laporan...', 'info');
    
    const result = await API.transaksi.getKeluar();
    
    if (result.success) {
      const data = [
        ['No', 'No. Transaksi', 'Tanggal', 'Pelanggan', 'Total Item', 'Total Harga', 'Bayar', 'Kembalian', 'Kasir']
      ];

      result.data.forEach((item, index) => {
        const tanggal = new Date(item.tanggal).toLocaleString('id-ID');
        
        data.push([
          index + 1,
          item.nomor_transaksi,
          tanggal,
          `"${item.pelanggan || 'Walk-in'}"`,
          item.total_item,
          item.total_harga,
          item.bayar,
          item.kembalian,
          `"${item.user_nama}"`
        ]);
      });

      const now = new Date();
      const filename = `Laporan_Penjualan_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
      
      exportToCSV(data, filename);
      Utils.showToast('Laporan berhasil diunduh', 'success');
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal mengunduh laporan', 'error');
  }
}

// ===== LAPORAN BARANG MASUK =====
async function exportLaporanBarangMasuk() {
  try {
    Utils.showToast('Mengunduh laporan...', 'info');
    
    const result = await API.transaksi.getMasuk();
    
    if (result.success) {
      const data = [
        ['No', 'No. Transaksi', 'Tanggal', 'Supplier', 'Total Item', 'Admin', 'Keterangan']
      ];

      result.data.forEach((item, index) => {
        const tanggal = new Date(item.tanggal).toLocaleString('id-ID');
        
        data.push([
          index + 1,
          item.nomor_transaksi,
          tanggal,
          `"${item.supplier || '-'}"`,
          item.total_item,
          `"${item.user_nama}"`,
          `"${item.keterangan || '-'}"`
        ]);
      });

      const now = new Date();
      const filename = `Laporan_Barang_Masuk_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
      
      exportToCSV(data, filename);
      Utils.showToast('Laporan berhasil diunduh', 'success');
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal mengunduh laporan', 'error');
  }
}

// ===== LAPORAN STOK RENDAH =====
async function exportLaporanStokRendah() {
  try {
    Utils.showToast('Mengunduh laporan...', 'info');
    
    const result = await API.barang.getAll();
    
    if (result.success) {
      const stokRendah = result.data.filter(item => item.stok < 10 && item.stok > 0);
      
      const data = [
        ['No', 'Kode Barang', 'Nama Barang', 'Kategori', 'Stok', 'Satuan', 'Harga', 'Status']
      ];

      stokRendah.forEach((item, index) => {
        data.push([
          index + 1,
          item.kode_barang,
          `"${item.nama_barang}"`,
          item.nama_kategori,
          item.stok,
          item.satuan,
          item.harga,
          'Stok Rendah'
        ]);
      });

      if (stokRendah.length === 0) {
        Utils.showToast('Tidak ada barang dengan stok rendah', 'info');
        return;
      }

      const now = new Date();
      const filename = `Laporan_Stok_Rendah_${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}.csv`;
      
      exportToCSV(data, filename);
      Utils.showToast('Laporan berhasil diunduh', 'success');
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal mengunduh laporan', 'error');
  }
}

// Make functions global
window.exportLaporanStok = exportLaporanStok;
window.exportLaporanPenjualan = exportLaporanPenjualan;
window.exportLaporanBarangMasuk = exportLaporanBarangMasuk;
window.exportLaporanStokRendah = exportLaporanStokRendah;
