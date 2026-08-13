// ============================================================
// transaksi-masuk.js
// History & Create Transaksi Masuk (Admin Only)
// ============================================================

if (!Auth.requireAdmin()) {
  throw new Error('Access denied');
}

// ===== GLOBAL STATE =====
let allTransaksi = [];
let filteredTransaksi = [];
let allBarang = [];
let items = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadBarang();
  loadTransaksi();
});

// ===== UI INITIALIZATION =====
function initUI() {
  const user = Auth.getUser();
  document.getElementById('user-name').textContent = user.nama_lengkap;

  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) Auth.logout();
  });

  document.getElementById('btn-add-transaksi').addEventListener('click', showAddModal);
  document.getElementById('btn-add-item').addEventListener('click', addItem);
  document.getElementById('btn-save').addEventListener('click', saveTransaksi);

  document.getElementById('search-transaksi').addEventListener('input',
    Utils.debounce(filterTransaksi, 300)
  );

  ['btn-filter-today', 'btn-filter-month', 'btn-filter-all'].forEach(id => {
    document.getElementById(id).addEventListener('click', function() {
      document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      filterTransaksi();
    });
  });

  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });
}

// ===== LOAD DATA =====
async function loadBarang() {
  try {
    const result = await API.barang.getAll();
    if (result.success) {
      allBarang = result.data;
      renderBarangOptions();
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

function renderBarangOptions() {
  const select = document.getElementById('f-barang');
  select.innerHTML = '<option value="">Pilih Barang</option>';
  allBarang.forEach(b => {
    select.innerHTML += `<option value="${b.id}">${b.kode_barang} - ${b.nama_barang}</option>`;
  });
}

async function loadTransaksi() {
  try {
    const result = await API.transaksi.getMasuk();
    if (result.success) {
      allTransaksi = result.data;
      filteredTransaksi = allTransaksi;
      filterTransaksi();
      updateStats();
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal memuat data', 'error');
  }
}

function updateStats() {
  const now = new Date();
  const thisMonth = allTransaksi.filter(t => {
    const d = new Date(t.tanggal);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  document.getElementById('stat-total').textContent = allTransaksi.length;
  document.getElementById('stat-items').textContent = 
    allTransaksi.reduce((sum, t) => sum + Number(t.total_item), 0);
  document.getElementById('stat-month').textContent = thisMonth.length;
}

function filterTransaksi() {
  const search = document.getElementById('search-transaksi').value.toLowerCase();
  const filterActive = document.querySelector('.btn-filter.active').id;
  const now = new Date();

  filteredTransaksi = allTransaksi.filter(t => {
    const matchSearch = !search ||
      t.nomor_transaksi.toLowerCase().includes(search) ||
      t.supplier?.toLowerCase().includes(search);

    const date = new Date(t.tanggal);
    let matchDate = true;

    if (filterActive === 'btn-filter-today') {
      matchDate = date.toDateString() === now.toDateString();
    } else if (filterActive === 'btn-filter-month') {
      matchDate = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }

    return matchSearch && matchDate;
  });

  renderTransaksi();
}

function renderTransaksi() {
  const tbody = document.getElementById('tbody-transaksi');
  const infoCount = document.getElementById('info-count');

  if (filteredTransaksi.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5">
          <i class="bi bi-inbox display-4 text-muted d-block mb-3" style="opacity: 0.3"></i>
          <p class="text-muted mb-0">Tidak ada transaksi</p>
        </td>
      </tr>
    `;
    infoCount.textContent = '0 transaksi';
    return;
  }

  tbody.innerHTML = filteredTransaksi.map((t, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><code class="text-primary">${Utils.escapeHtml(t.nomor_transaksi)}</code></td>
      <td>${Utils.formatDateTime(t.tanggal)}</td>
      <td>${Utils.escapeHtml(t.supplier || '-')}</td>
      <td><span class="badge bg-info">${t.total_item}</span></td>
      <td><small class="text-muted">${Utils.escapeHtml(t.user_nama || '-')}</small></td>
      <td class="text-center">
        <button class="btn btn-sm btn-outline-primary" onclick="showDetail(${t.id})">
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
    const result = await API.transaksi.getMasukById(id);
    if (result.success) {
      const t = result.data;
      document.getElementById('modal-detail-body').innerHTML = `
        <div class="detail-section">
          <div class="detail-section-title"><i class="bi bi-info-circle"></i> Informasi</div>
          <div class="detail-row">
            <span class="detail-label">No. Transaksi</span>
            <span class="detail-value"><code>${Utils.escapeHtml(t.nomor_transaksi)}</code></span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tanggal</span>
            <span class="detail-value">${Utils.formatDateTime(t.tanggal)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Supplier</span>
            <span class="detail-value">${Utils.escapeHtml(t.supplier || '-')}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Admin</span>
            <span class="detail-value">${Utils.escapeHtml(t.user_nama)}</span>
          </div>
        </div>

        <div class="detail-section">
          <div class="detail-section-title"><i class="bi bi-list-ul"></i> Detail Item</div>
          <table class="detail-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Kode</th>
                <th>Nama Barang</th>
                <th>Qty</th>
                <th>Harga Beli</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${t.detail.map((item, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><code>${Utils.escapeHtml(item.kode_barang)}</code></td>
                  <td>${Utils.escapeHtml(item.nama_barang)}</td>
                  <td>${item.jumlah} ${Utils.escapeHtml(item.satuan)}</td>
                  <td>${Utils.formatRupiah(item.harga_beli)}</td>
                  <td><strong>${Utils.formatRupiah(item.subtotal)}</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      new bootstrap.Modal(document.getElementById('modal-detail')).show();
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast('Gagal memuat detail', 'error');
  }
}

// ===== ADD MODAL =====
async function showAddModal() {
  items = [];
  document.getElementById('form-transaksi').reset();
  
  // Generate nomor transaksi
  try {
    const result = await API.transaksi.generateNomor('masuk');
    if (result.success) {
      document.getElementById('f-nomor').value = result.data.nomor_transaksi;
    }
  } catch (error) {
    console.error('Error:', error);
  }

  // Set default tanggal
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  document.getElementById('f-tanggal').value = now.toISOString().slice(0, 16);

  renderItems();
  new bootstrap.Modal(document.getElementById('modal-form')).show();
}

// ===== ADD ITEM =====
function addItem() {
  const barangId = document.getElementById('f-barang').value;
  const jumlah = parseInt(document.getElementById('f-jumlah').value);
  const hargaBeli = parseFloat(document.getElementById('f-harga-beli').value);

  if (!barangId || !jumlah || !hargaBeli) {
    Utils.showToast('Lengkapi semua field', 'warning');
    return;
  }

  const barang = allBarang.find(b => b.id == barangId);
  if (!barang) return;

  items.push({
    barang_id: barang.id,
    nama_barang: barang.nama_barang,
    jumlah: jumlah,
    harga_beli: hargaBeli,
    subtotal: jumlah * hargaBeli
  });

  document.getElementById('f-barang').value = '';
  document.getElementById('f-jumlah').value = '';
  document.getElementById('f-harga-beli').value = '';

  renderItems();
}

function renderItems() {
  const tbody = document.getElementById('tbody-items');
  
  if (items.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">Belum ada item</td></tr>';
    return;
  }

  tbody.innerHTML = items.map((item, i) => `
    <tr>
      <td>${Utils.escapeHtml(item.nama_barang)}</td>
      <td>${item.jumlah}</td>
      <td>${Utils.formatRupiah(item.harga_beli)}</td>
      <td><strong>${Utils.formatRupiah(item.subtotal)}</strong></td>
      <td>
        <button type="button" class="btn btn-sm btn-danger" onclick="removeItem(${i})">
          <i class="bi bi-x"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function removeItem(index) {
  items.splice(index, 1);
  renderItems();
}

// ===== SAVE TRANSAKSI =====
async function saveTransaksi() {
  if (items.length === 0) {
    Utils.showToast('Tambahkan minimal 1 item', 'warning');
    return;
  }

  const data = {
    nomor_transaksi: document.getElementById('f-nomor').value,
    tanggal: document.getElementById('f-tanggal').value,
    supplier: document.getElementById('f-supplier').value || null,
    keterangan: document.getElementById('f-keterangan').value || null,
    items: items
  };

  const btnSave = document.getElementById('btn-save');
  btnSave.disabled = true;
  btnSave.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';

  try {
    const result = await API.transaksi.createMasuk(data);
    if (result.success) {
      Utils.showToast('Transaksi berhasil disimpan', 'success');
      bootstrap.Modal.getInstance(document.getElementById('modal-form')).hide();
      loadTransaksi();
    }
  } catch (error) {
    console.error('Error:', error);
    Utils.showToast(error.message || 'Gagal menyimpan transaksi', 'error');
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = '<i class="bi bi-check-circle me-2"></i>Simpan Transaksi';
  }
}

// Make functions global
window.showDetail = showDetail;
window.removeItem = removeItem;
