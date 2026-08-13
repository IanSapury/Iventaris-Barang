// ============================================================
// dashboard.js
// Dashboard Admin Logic dengan Chart.js
// ============================================================

// Protect page - hanya admin yang bisa akses
if (!Auth.requireAdmin()) {
  throw new Error('Access denied');
}

// ===== GLOBAL VARIABLES =====
let chartTransaksi = null;
let chartProduk = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadDashboardData();
  startClock();
});

// ===== UI INITIALIZATION =====
function initUI() {
  // Set user name
  const user = Auth.getUser();
  document.getElementById('user-name').textContent = user.nama_lengkap;

  // Logout button
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) {
      Auth.logout();
    }
  });

  // Refresh button
  document.getElementById('btn-refresh').addEventListener('click', () => {
    loadDashboardData();
    Utils.showToast('Data berhasil direfresh', 'success');
  });

  // Mobile toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });

  // Close sidebar when clicking menu on mobile
  document.querySelectorAll('.menu-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        document.getElementById('sidebar').classList.remove('active');
      }
    });
  });
}

// ===== CLOCK =====
function startClock() {
  function updateClock() {
    const now = new Date();
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    document.getElementById('datetime').textContent = 
      now.toLocaleDateString('id-ID', options);
  }
  
  updateClock();
  setInterval(updateClock, 60000); // Update every minute
}

// ===== LOAD DASHBOARD DATA =====
async function loadDashboardData() {
  try {
    // Load stats, barang, dan transaksi keluar secara parallel
    const [statsResult, barangResult, transaksiResult] = await Promise.all([
      API.transaksi.getStats(),
      API.barang.getAll(),
      API.transaksi.getKeluar()
    ]);

    if (statsResult.success) {
      updateStats(statsResult.data, barangResult.data || []);
      renderChartTransaksi(statsResult.data.transaksi_per_hari || []);
      renderChartProduk(statsResult.data.barang_laris || []);
      renderStokRendah(statsResult.data.stok_rendah || []);
    }

    if (transaksiResult.success) {
      renderTransaksiTerakhir(transaksiResult.data || []);
    }

  } catch (error) {
    console.error('Error loading dashboard:', error);
    Utils.showToast('Gagal memuat data dashboard', 'error');
  }
}

// ===== UPDATE STATS CARDS =====
function updateStats(stats, barangData) {
  // Pendapatan hari ini
  document.getElementById('stat-pendapatan-hari').textContent = 
    Utils.formatRupiah(stats.hari_ini?.total_pendapatan || 0);
  document.getElementById('stat-transaksi-hari').textContent = 
    stats.hari_ini?.total_transaksi || 0;

  // Pendapatan bulan ini
  document.getElementById('stat-pendapatan-bulan').textContent = 
    Utils.formatRupiah(stats.bulan_ini?.total_pendapatan || 0);
  document.getElementById('stat-transaksi-bulan').textContent = 
    stats.bulan_ini?.total_transaksi || 0;

  // Total barang
  document.getElementById('stat-total-barang').textContent = 
    barangData.length;
  document.getElementById('stat-stok-rendah').textContent = 
    barangData.filter(b => b.stok < 10 && b.stok > 0).length;

  // Kategori
  const uniqueKat = new Set(barangData.map(b => b.kategori_id));
  document.getElementById('stat-kategori').textContent = uniqueKat.size;
  document.getElementById('stat-jenis').textContent = barangData.length;
}

// ===== CHART: TRANSAKSI 7 HARI TERAKHIR =====
function renderChartTransaksi(data) {
  const ctx = document.getElementById('chartTransaksi');
  
  // Destroy existing chart
  if (chartTransaksi) {
    chartTransaksi.destroy();
  }

  // Prepare data
  const labels = data.map(d => {
    const date = new Date(d.tanggal);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  });
  const values = data.map(d => d.total_pendapatan);

  // Create chart
  chartTransaksi = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pendapatan (Rp)',
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#3b82f6',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return 'Rp ' + context.parsed.y.toLocaleString('id-ID');
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return 'Rp ' + (value / 1000) + 'k';
            },
            color: '#64748b'
          },
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ===== CHART: TOP 5 PRODUK TERLARIS =====
function renderChartProduk(data) {
  const ctx = document.getElementById('chartProduk');
  
  // Destroy existing chart
  if (chartProduk) {
    chartProduk.destroy();
  }

  // Prepare data
  const labels = data.map(d => {
    const nama = d.nama_barang;
    return nama.length > 20 ? nama.substring(0, 20) + '...' : nama;
  });
  const values = data.map(d => d.total_terjual);

  const colors = [
    '#3b82f6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4'
  ];

  // Create chart
  chartProduk = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Terjual',
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#3b82f6',
          borderWidth: 1,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return context.parsed.y + ' unit';
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: '#64748b',
            stepSize: 1
          },
          grid: {
            color: '#f1f5f9',
            drawBorder: false
          }
        },
        x: {
          ticks: {
            color: '#64748b'
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ===== RENDER STOK RENDAH =====
function renderStokRendah(data) {
  const tbody = document.getElementById('tbody-stok-rendah');
  
  if (data.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          <i class="bi bi-check-circle text-success fs-3 d-block mb-2"></i>
          Tidak ada stok yang rendah
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td><code class="text-primary">${Utils.escapeHtml(item.kode_barang)}</code></td>
      <td>${Utils.escapeHtml(item.nama_barang)}</td>
      <td>
        <span class="badge bg-warning text-dark">
          ${item.stok} ${Utils.escapeHtml(item.satuan)}
        </span>
      </td>
      <td><span class="badge bg-light text-dark">${Utils.escapeHtml(item.kategori)}</span></td>
    </tr>
  `).join('');
}

// ===== RENDER TRANSAKSI TERAKHIR =====
function renderTransaksiTerakhir(data) {
  const tbody = document.getElementById('tbody-transaksi-terakhir');
  
  // Ambil 5 transaksi terakhir
  const latest = data.slice(0, 5);

  if (latest.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="text-center text-muted py-4">
          Belum ada transaksi
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = latest.map(item => `
    <tr>
      <td><code class="text-primary">${Utils.escapeHtml(item.nomor_transaksi)}</code></td>
      <td>${Utils.formatDateTime(item.tanggal)}</td>
      <td><strong>${Utils.formatRupiah(item.total_harga)}</strong></td>
      <td>${Utils.escapeHtml(item.user_nama || '-')}</td>
    </tr>
  `).join('');
}
