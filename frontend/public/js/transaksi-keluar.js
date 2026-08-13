// ============================================================
// transaksi-keluar.js
// History Transaksi Keluar (Penjualan)
// ============================================================

// Protect page - hanya admin
if (!Auth.requireAdmin()) {
  throw new Error('Access denied');
}

// ===== GLOBAL STATE =====
let allTransaksi = [];
let filteredTransaksi = [];
let currentFilter = 'all';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadTransaksi();
});

// ===== UI INITIALIZATION =====
function initUI() {
  const user = Auth.getUser();
  document.getElementById('user-name').textContent = user.nama_lengkap;

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) {
      Auth.logout();
    }
  });

  // Refresh
  document.getElementById('btn-refresh').addEventListener('click', () => {
    loadTransaksi();
    Utils.showToast('Data berhasil direfresh', 'success');
  });

  // Mobile toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });

  // Search
  document.getElementById('search-transaksi').addEventListener('input', 
    Utils.debounce(filterTransaksi, 300)
  );

  // Filter buttons
  document.getElementById('btn-filter-today').addEventListener('click', () => {
    setFilter('today');
  });
  document.getElementById('btn-filter-week').addEventListener('click', () => {
    setFilter('week');
  });
  document.getElementById('btn-filter-month').addEventListener('click', () => {
    setFilter('month');
  });
  document.getElementById('btn-filter-all').addEventListener('click', () => {
    setFilter('all');
  });
}

// ===== LOAD TRANSAKSI =====
async function loadTransaksi() {
  try {
    const result = await API.transaksi.getKeluar();
    
    if (result.success) {
      allTransaksi = result.data;
      filteredTransaksi = allTransaksi;
      filterTransaksi();
      updateStats();
    }
  } catch (error) {
    console.error('Error loading transaksi:', error);
    Utils.showToast('Gagal memuat data transaksi', 'error');
  }
}

// ===== UPDATE STATS =====
function updateStats() {
  const totalPenjualan = allTransaksi.reduce((sum, t) => sum + Number(t.total_harga), 0);
  const totalItem = allTransaksi.reduce((sum, t) => sum + Number(t.total_item), 0);

  document.getElementById('stat-total-penjualan').textContent = Utils.formatRupiah(totalPenjualan);
  document.getElementById('stat-total-transaksi').textContent = allTransaksi.length;
  document.getElementById('stat-total-item').textContent = totalItem.toLocaleString('id-ID');
}

// ===== FILTER =====
function setFilter(filter) {
  currentFilter = filter;
  
  // Update active button
  document.querySelectorAll('.btn-filter').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`btn-filter-${filter}`).classList.add('active');

  filterTransaksi();
}

function filterTransaksi() {
  const searchTerm = document.getElementById('search-transaksi').value.toLowerCase();
  const now = new Date();

  filteredTransaksi = allTransaksi.filter(transaksi => {
    // Search filter
    const matchSearch = !searchTerm || 
      transaksi.nomor_transaksi.toLowerCase().includes(searchTerm) ||
      transaksi.pelanggan?.toLowerCase().includes(searchTerm) ||
      transaksi.user_nama?.toLowerCase().includes(searchTerm);

    // Date filter
    const transaksiDate = new Date(transaksi.tanggal);
    let matchDate = true;

    if (currentFilter === 'today') {
      matchDate = transaksiDate.toDateString() === now.toDateString();
    } else if (currentFilter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchDate = transaksiDate >= weekAgo;
    } else if (currentFilter === 'month') {
      matchDate = transaksiDate.getMonth() === now.getMonth() &&
                  transaksiDate.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchDate;
  });

  renderTransaksi();
}

// ===== RENDER TRANSAKSI =====
function renderTransaksi() {
  const tbody = document.getElementById('tbody-transaksi');
  const infoCount = document.getElementById('info-count');

  if (filteredTransaksi.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-center py-5">
          <i class="bi bi-inbox display-4 text-muted d-block mb-3" style="opacity: 0.3"></i>
          <p class="text-muted mb-0">Tidak ada transaksi ditemukan</p>
        </td>
      </tr>
    `;
    infoCount.textContent = '0 transaksi';
    return;
  }

  tbody.innerHTML = filteredTransaksi.map((transaksi, index) => `
    <tr>
      <td class="text-muted">${index + 1}</td>
      <td>
        <code class="text-primary fw-semibold">${Utils.escapeHtml(transaksi.nomor_transaksi)}</code>
      </td>
      <td>${Utils.formatDateTime(transaksi.tanggal)}</td>
      <td>${Utils.escapeHtml(transaksi.pelanggan || '-')}</td>
      <td>
        <span class="badge bg-info">${transaksi.total_item}</span>
      </td>
      <td class="text-end">
        <strong class="text-success">${Utils.formatRupiah(transaksi.total_harga)}</strong>
      </td>
      <td>
        <small class="text-muted">${Utils.escapeHtml(transaksi.user_nama || '-')}</small>
      </td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-primary" onclick="showDetail(${transaksi.id})" title="Detail">
          <i class="bi bi-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');

  infoCount.textContent = `${filteredTransaksi.length} transaksi`;
}

// ===== SHOW DETAIL =====
async function showDetail(id) {
  try {
    const result = await API.transaksi.getKeluarById(id);
    
    if (result.success) {
      const transaksi = result.data;
      renderDetailModal(transaksi);
    }
  } catch (error) {
    console.error('Error loading detail:', error);
    Utils.showToast('Gagal memuat detail transaksi', 'error');
  }
}

function renderDetailModal(transaksi) {
  const modalBody = document.getElementById('modal-detail-body');

  modalBody.innerHTML = `
    <!-- Informasi Transaksi -->
    <div class="detail-section">
      <div class="detail-section-title">
        <i class="bi bi-info-circle"></i>
        Informasi Transaksi
      </div>
      <div class="detail-row">
        <span class="detail-label">Nomor Transaksi</span>
        <span class="detail-value">
          <code class="text-primary">${Utils.escapeHtml(transaksi.nomor_transaksi)}</code>
        </span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Tanggal & Waktu</span>
        <span class="detail-value">${Utils.formatDateTime(transaksi.tanggal)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Pelanggan</span>
        <span class="detail-value">${Utils.escapeHtml(transaksi.pelanggan || '-')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Kasir</span>
        <span class="detail-value">${Utils.escapeHtml(transaksi.user_nama || '-')}</span>
      </div>
      ${transaksi.keterangan ? `
      <div class="detail-row">
        <span class="detail-label">Keterangan</span>
        <span class="detail-value">${Utils.escapeHtml(transaksi.keterangan)}</span>
      </div>
      ` : ''}
    </div>

    <!-- Detail Item -->
    <div class="detail-section">
      <div class="detail-section-title">
        <i class="bi bi-list-ul"></i>
        Detail Item (${transaksi.detail.length})
      </div>
      <table class="detail-items-table">
        <thead>
          <tr>
            <th style="width: 40px">#</th>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th class="text-center" style="width: 80px">Qty</th>
            <th class="text-end" style="width: 120px">Harga</th>
            <th class="text-end" style="width: 140px">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${transaksi.detail.map((item, index) => `
            <tr>
              <td class="text-muted">${index + 1}</td>
              <td><code>${Utils.escapeHtml(item.kode_barang)}</code></td>
              <td>${Utils.escapeHtml(item.nama_barang)}</td>
              <td class="text-center">
                <strong>${item.jumlah}</strong> ${Utils.escapeHtml(item.satuan)}
              </td>
              <td class="text-end">${Utils.formatRupiah(item.harga_jual)}</td>
              <td class="text-end"><strong>${Utils.formatRupiah(item.subtotal)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Total Pembayaran -->
    <div class="detail-total-section">
      <div class="detail-total-row">
        <span>Total Belanja</span>
        <strong>${Utils.formatRupiah(transaksi.total_harga)}</strong>
      </div>
      <div class="detail-total-row">
        <span>Jumlah Bayar</span>
        <strong>${Utils.formatRupiah(transaksi.bayar)}</strong>
      </div>
      <div class="detail-total-row">
        <span>Kembalian</span>
        <strong class="text-success">${Utils.formatRupiah(transaksi.kembalian)}</strong>
      </div>
      <div class="detail-total-row grand-total">
        <span>TOTAL BAYAR</span>
        <span>${Utils.formatRupiah(transaksi.total_harga)}</span>
      </div>
    </div>
  `;

  // Store transaksi data for print
  window.currentDetailTransaksi = transaksi;

  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('modal-detail'));
  modal.show();
}

// ===== PRINT DETAIL =====
document.getElementById('btn-print-detail').addEventListener('click', () => {
  if (!window.currentDetailTransaksi) return;

  const transaksi = window.currentDetailTransaksi;
  const printContent = `
    <html>
    <head>
      <title>Print Transaksi ${transaksi.nomor_transaksi}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        h2 {
          text-align: center;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .info-section {
          margin: 20px 0;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 5px 0;
          border-bottom: 1px solid #eee;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #f0f0f0;
        }
        .total-section {
          margin-top: 20px;
          text-align: right;
        }
        .grand-total {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 2px solid #333;
        }
      </style>
    </head>
    <body>
      <h2>Transaksi Keluar (Penjualan)</h2>
      <div class="info-section">
        <div class="info-row">
          <strong>No. Transaksi:</strong>
          <span>${Utils.escapeHtml(transaksi.nomor_transaksi)}</span>
        </div>
        <div class="info-row">
          <strong>Tanggal:</strong>
          <span>${Utils.formatDateTime(transaksi.tanggal)}</span>
        </div>
        <div class="info-row">
          <strong>Pelanggan:</strong>
          <span>${Utils.escapeHtml(transaksi.pelanggan || '-')}</span>
        </div>
        <div class="info-row">
          <strong>Kasir:</strong>
          <span>${Utils.escapeHtml(transaksi.user_nama || '-')}</span>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th style="width: 40px">#</th>
            <th>Kode</th>
            <th>Nama Barang</th>
            <th style="width: 80px">Qty</th>
            <th style="width: 120px">Harga</th>
            <th style="width: 140px">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${transaksi.detail.map((item, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${Utils.escapeHtml(item.kode_barang)}</td>
              <td>${Utils.escapeHtml(item.nama_barang)}</td>
              <td>${item.jumlah} ${Utils.escapeHtml(item.satuan)}</td>
              <td>${Utils.formatRupiah(item.harga_jual)}</td>
              <td><strong>${Utils.formatRupiah(item.subtotal)}</strong></td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="total-section">
        <div>Total: ${Utils.formatRupiah(transaksi.total_harga)}</div>
        <div>Bayar: ${Utils.formatRupiah(transaksi.bayar)}</div>
        <div>Kembalian: ${Utils.formatRupiah(transaksi.kembalian)}</div>
        <div class="grand-total">
          TOTAL BAYAR: ${Utils.formatRupiah(transaksi.total_harga)}
        </div>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(printContent);
  printWindow.document.close();
  printWindow.onload = function() {
    printWindow.print();
  };
});

// Make function global
window.showDetail = showDetail;
