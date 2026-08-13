// ============================================================
// barang.js
// Manajemen Data Barang (Admin Only)
// ============================================================

// Protect page - hanya admin
if (!Auth.requireAdmin()) {
  throw new Error('Access denied');
}

// ===== GLOBAL STATE =====
let allBarang = [];
let filteredBarang = [];
let allKategori = [];
let editMode = false;
let currentId = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadKategori();
  loadBarang();
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

  // Add barang button
  document.getElementById('btn-add-barang').addEventListener('click', showAddModal);

  // Refresh button
  document.getElementById('btn-refresh').addEventListener('click', loadBarang);

  // Search
  document.getElementById('search-barang').addEventListener('input',
    Utils.debounce(filterBarang, 300)
  );

  // Filter kategori
  document.getElementById('filter-kategori').addEventListener('change', filterBarang);

  // Filter stok
  document.getElementById('filter-stok').addEventListener('change', filterBarang);

  // Save button
  document.getElementById('btn-save').addEventListener('click', saveBarang);

  // Mobile toggle
  document.getElementById('mobile-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('active');
  });
}

// ===== LOAD KATEGORI =====
async function loadKategori() {
  try {
    const result = await API.kategori.getAll();
    if (result.success) {
      allKategori = result.data;
      renderKategoriOptions();
    }
  } catch (error) {
    console.error('Error loading kategori:', error);
  }
}

function renderKategoriOptions() {
  const selects = ['f-kategori', 'filter-kategori'];
  
  selects.forEach(id => {
    const select = document.getElementById(id);
    const currentValue = select.value;
    
    if (id === 'filter-kategori') {
      select.innerHTML = '<option value="">Semua Kategori</option>';
    } else {
      select.innerHTML = '<option value="">Pilih Kategori</option>';
    }
    
    allKategori.forEach(kat => {
      const option = document.createElement('option');
      option.value = kat.id;
      option.textContent = kat.nama;
      select.appendChild(option);
    });
    
    if (currentValue) select.value = currentValue;
  });
}

// ===== LOAD BARANG =====
async function loadBarang() {
  try {
    const result = await API.barang.getAll();
    if (result.success) {
      allBarang = result.data;
      filteredBarang = allBarang;
      filterBarang();
    }
  } catch (error) {
    console.error('Error loading barang:', error);
    Utils.showToast('Gagal memuat data barang', 'error');
  }
}

// ===== FILTER BARANG =====
function filterBarang() {
  const searchTerm = document.getElementById('search-barang').value.toLowerCase();
  const kategoriFilter = document.getElementById('filter-kategori').value;
  const stokFilter = document.getElementById('filter-stok').value;

  filteredBarang = allBarang.filter(barang => {
    // Search filter
    const matchSearch = !searchTerm ||
      barang.kode_barang.toLowerCase().includes(searchTerm) ||
      barang.nama_barang.toLowerCase().includes(searchTerm) ||
      barang.nama_kategori.toLowerCase().includes(searchTerm);

    // Kategori filter
    const matchKategori = !kategoriFilter || barang.kategori_id == kategoriFilter;

    // Stok filter
    let matchStok = true;
    if (stokFilter === 'available') {
      matchStok = barang.stok > 10;
    } else if (stokFilter === 'low') {
      matchStok = barang.stok > 0 && barang.stok <= 10;
    } else if (stokFilter === 'empty') {
      matchStok = barang.stok === 0;
    }

    return matchSearch && matchKategori && matchStok;
  });

  renderBarang();
}

// ===== RENDER BARANG =====
function renderBarang() {
  const tbody = document.getElementById('tbody-barang');
  const infoCount = document.getElementById('info-count');

  if (filteredBarang.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-center py-5">
          <i class="bi bi-inbox display-4 text-muted d-block mb-3" style="opacity: 0.3"></i>
          <p class="text-muted mb-0">Tidak ada barang ditemukan</p>
        </td>
      </tr>
    `;
    infoCount.textContent = '0 barang';
    return;
  }

  tbody.innerHTML = filteredBarang.map((barang, index) => {
    const stokBadge = barang.stok === 0 ? 
      `<span class="badge bg-danger">${barang.stok}</span>` :
      barang.stok <= 10 ?
      `<span class="badge bg-warning text-dark">${barang.stok}</span>` :
      `<span class="badge bg-success">${barang.stok}</span>`;

    return `
      <tr>
        <td class="text-muted">${index + 1}</td>
        <td><code class="text-primary">${Utils.escapeHtml(barang.kode_barang)}</code></td>
        <td>
          <div class="fw-semibold">${Utils.escapeHtml(barang.nama_barang)}</div>
          ${barang.keterangan ? `<small class="text-muted">${Utils.escapeHtml(barang.keterangan.substring(0, 50))}${barang.keterangan.length > 50 ? '...' : ''}</small>` : ''}
        </td>
        <td><span class="badge bg-light text-dark">${Utils.escapeHtml(barang.nama_kategori)}</span></td>
        <td class="text-end">
          ${stokBadge} 
          <small class="text-muted">${Utils.escapeHtml(barang.satuan)}</small>
        </td>
        <td class="text-end"><strong>${Utils.formatRupiah(barang.harga)}</strong></td>
        <td class="text-center">
          <button class="btn btn-sm btn-outline-primary" onclick="editBarang(${barang.id})" title="Edit">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" onclick="hapusBarang(${barang.id}, '${Utils.escapeHtml(barang.nama_barang).replace(/'/g, "\\'")}' )" title="Hapus">
            <i class="bi bi-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  infoCount.textContent = `${filteredBarang.length} barang`;
}

// ===== SHOW ADD MODAL =====
function showAddModal() {
  editMode = false;
  currentId = null;
  
  document.getElementById('modal-title').innerHTML = '<i class="bi bi-plus-circle me-2"></i>Tambah Barang';
  document.getElementById('form-barang').reset();
  document.getElementById('f-id').value = '';
  
  const modal = new bootstrap.Modal(document.getElementById('modal-form'));
  modal.show();
}

// ===== EDIT BARANG =====
async function editBarang(id) {
  try {
    const result = await API.barang.getById(id);
    
    if (result.success) {
      const barang = result.data;
      editMode = true;
      currentId = id;
      
      document.getElementById('modal-title').innerHTML = '<i class="bi bi-pencil-square me-2"></i>Edit Barang';
      document.getElementById('f-id').value = barang.id;
      document.getElementById('f-kode').value = barang.kode_barang;
      document.getElementById('f-nama').value = barang.nama_barang;
      document.getElementById('f-kategori').value = barang.kategori_id;
      document.getElementById('f-stok').value = barang.stok;
      document.getElementById('f-satuan').value = barang.satuan;
      document.getElementById('f-harga').value = barang.harga;
      document.getElementById('f-keterangan').value = barang.keterangan || '';
      
      const modal = new bootstrap.Modal(document.getElementById('modal-form'));
      modal.show();
    }
  } catch (error) {
    console.error('Error loading barang:', error);
    Utils.showToast('Gagal memuat data barang', 'error');
  }
}

// ===== SAVE BARANG =====
async function saveBarang() {
  const form = document.getElementById('form-barang');
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }

  const data = {
    kode_barang: document.getElementById('f-kode').value.trim(),
    nama_barang: document.getElementById('f-nama').value.trim(),
    kategori_id: document.getElementById('f-kategori').value,
    stok: parseInt(document.getElementById('f-stok').value),
    satuan: document.getElementById('f-satuan').value,
    harga: parseFloat(document.getElementById('f-harga').value),
    keterangan: document.getElementById('f-keterangan').value.trim() || null
  };

  const btnSave = document.getElementById('btn-save');
  btnSave.disabled = true;
  btnSave.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Menyimpan...';

  try {
    let result;
    
    if (editMode && currentId) {
      result = await API.barang.update(currentId, data);
      Utils.showToast('Barang berhasil diperbarui', 'success');
    } else {
      result = await API.barang.create(data);
      Utils.showToast('Barang berhasil ditambahkan', 'success');
    }

    if (result.success) {
      bootstrap.Modal.getInstance(document.getElementById('modal-form')).hide();
      loadBarang();
    }
  } catch (error) {
    console.error('Error saving barang:', error);
    Utils.showToast(error.message || 'Gagal menyimpan barang', 'error');
  } finally {
    btnSave.disabled = false;
    btnSave.innerHTML = '<i class="bi bi-check-circle me-2"></i>Simpan';
  }
}

// ===== HAPUS BARANG =====
async function hapusBarang(id, nama) {
  if (!confirm(`Yakin ingin menghapus barang:\n"${nama}"?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
    return;
  }

  try {
    const result = await API.barang.delete(id);
    
    if (result.success) {
      Utils.showToast('Barang berhasil dihapus', 'info');
      loadBarang();
    }
  } catch (error) {
    console.error('Error deleting barang:', error);
    Utils.showToast(error.message || 'Gagal menghapus barang', 'error');
  }
}

// Make functions global
window.editBarang = editBarang;
window.hapusBarang = hapusBarang;
