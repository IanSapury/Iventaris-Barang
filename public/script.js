// ============================================================
// script.js — Sistem Inventaris Barang
// Semua interaksi backend menggunakan fetch() async/await
// tanpa reload halaman (SPA-like behaviour)
// ============================================================

'use strict';

// ============================================================
// KONFIGURASI
// ============================================================
const API_BASE = '/api';          // Base URL API
const LOW_STOCK_THRESHOLD = 10;  // Batas stok rendah

// ============================================================
// STATE
// ============================================================
let allBarang   = [];   // cache semua data dari server
let editMode    = false;
let searchTimer = null;

// ============================================================
// UTILITIES
// ============================================================

/** Format angka ke Rupiah: 1500000 → "Rp 1.500.000" */
function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

/** Escape karakter HTML untuk mencegah XSS */
function escHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Tampilkan toast notifikasi (success / error / info) */
function showToast(message, type = 'success') {
  const toastEl = document.getElementById('toast');
  const msgEl   = document.getElementById('toast-msg');

  // Reset class tipe sebelumnya
  toastEl.classList.remove('toast-success', 'toast-error', 'toast-info');
  toastEl.classList.add(`toast-${type}`);
  msgEl.textContent = message;

  const bsToast = bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 3500 });
  bsToast.show();
}

/** Dapatkan badge HTML stok berdasarkan jumlah */
function stokBadge(stok) {
  const n = Number(stok);
  if (n === 0) return `<span class="stok-badge stok-empty">${n}</span>`;
  if (n <= LOW_STOCK_THRESHOLD) return `<span class="stok-badge stok-low">${n}</span>`;
  return `<span class="stok-badge stok-ok">${n}</span>`;
}

// ============================================================
// API CALLS — semua komunikasi ke backend di sini
// ============================================================

/** GET /api/barang — ambil semua data */
async function fetchAllBarang() {
  const res  = await fetch(`${API_BASE}/barang`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** GET /api/barang/search?q=keyword */
async function searchBarang(keyword) {
  const res  = await fetch(`${API_BASE}/barang/search?q=${encodeURIComponent(keyword)}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** GET /api/barang/:id */
async function fetchBarangById(id) {
  const res  = await fetch(`${API_BASE}/barang/${id}`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** POST /api/barang — tambah data baru */
async function createBarang(payload) {
  const res  = await fetch(`${API_BASE}/barang`, {
    method : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** PUT /api/barang/:id — update data */
async function updateBarang(id, payload) {
  const res  = await fetch(`${API_BASE}/barang/${id}`, {
    method : 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body   : JSON.stringify(payload),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** DELETE /api/barang/:id — hapus data */
async function deleteBarang(id) {
  const res  = await fetch(`${API_BASE}/barang/${id}`, { method: 'DELETE' });
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

/** GET /api/kategori — untuk dropdown form */
async function fetchKategori() {
  const res  = await fetch(`${API_BASE}/kategori`);
  const json = await res.json();
  if (!json.success) throw new Error(json.message);
  return json.data;
}

// ============================================================
// RENDER TABEL
// ============================================================

/** Render baris-baris tabel dari array data */
function renderTabel(data) {
  const tbody     = document.getElementById('tbody-barang');
  const wrapper   = document.getElementById('table-wrapper');
  const emptyEl   = document.getElementById('table-empty');
  const countEl   = document.getElementById('info-count');

  tbody.innerHTML = '';

  if (data.length === 0) {
    wrapper.classList.add('d-none');
    emptyEl.classList.remove('d-none');
    countEl.textContent = '0 data ditemukan';
    return;
  }

  wrapper.classList.remove('d-none');
  emptyEl.classList.add('d-none');
  countEl.textContent = `${data.length} data`;

  data.forEach((b, i) => {
    const tr = document.createElement('tr');
    tr.id = `row-${b.id}`;
    tr.innerHTML = `
      <td class="ps-3 text-muted small">${i + 1}</td>
      <td><span class="kode-barang">${escHtml(b.kode_barang)}</span></td>
      <td>
        <div class="fw-medium">${escHtml(b.nama_barang)}</div>
        ${b.keterangan ? `<div class="text-muted" style="font-size:0.75rem">${escHtml(b.keterangan.substring(0, 60))}${b.keterangan.length > 60 ? '…' : ''}</div>` : ''}
      </td>
      <td><span class="kat-badge">${escHtml(b.nama_kategori)}</span></td>
      <td class="text-end">${stokBadge(b.stok)} <span class="text-muted small">${escHtml(b.satuan)}</span></td>
      <td class="text-end harga-cell">${formatRupiah(b.harga)}</td>
      <td class="text-center">
        <button class="btn btn-outline-info btn-aksi" onclick="showDetail(${b.id})" title="Lihat Detail">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-outline-warning btn-aksi" onclick="editBarang(${b.id})" title="Edit">
          <i class="bi bi-pencil"></i>
        </button>
        <button class="btn btn-outline-danger btn-aksi" onclick="hapusBarang(${b.id}, '${escHtml(b.nama_barang)}')" title="Hapus">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/** Update stat cards berdasarkan data terbaru */
function updateStats(data) {
  document.getElementById('stat-total').textContent = data.length;
  document.getElementById('stat-stok').textContent  =
    data.reduce((sum, b) => sum + Number(b.stok), 0).toLocaleString('id-ID');
  document.getElementById('stat-low').textContent   =
    data.filter(b => Number(b.stok) <= LOW_STOCK_THRESHOLD && Number(b.stok) > 0).length;

  // hitung kategori unik
  const uniqueKat = new Set(data.map(b => b.kategori_id));
  document.getElementById('stat-kat').textContent   = uniqueKat.size;
}

// ============================================================
// LOAD DATA UTAMA
// ============================================================

/** Muat ulang seluruh data barang dari server dan render ulang */
async function loadBarang() {
  const loadEl  = document.getElementById('table-loading');
  const wrapper = document.getElementById('table-wrapper');
  const emptyEl = document.getElementById('table-empty');

  // Tampilkan loading, sembunyikan tabel
  loadEl.classList.remove('d-none');
  wrapper.classList.add('d-none');
  emptyEl.classList.add('d-none');

  try {
    allBarang = await fetchAllBarang();
    renderTabel(allBarang);
    updateStats(allBarang);
  } catch (e) {
    showToast(`Gagal memuat data: ${e.message}`, 'error');
  } finally {
    loadEl.classList.add('d-none');
  }
}

/** Muat dropdown kategori pada form */
async function loadKategori() {
  try {
    const daftar = await fetchKategori();
    const sel    = document.getElementById('f-kat');

    // Kosongkan semua kecuali placeholder
    sel.innerHTML = '<option value="">— Pilih Kategori —</option>';

    daftar.forEach(k => {
      const opt = document.createElement('option');
      opt.value       = k.id;
      opt.textContent = k.nama;
      sel.appendChild(opt);
    });
  } catch (e) {
    showToast(`Gagal memuat kategori: ${e.message}`, 'error');
  }
}

// ============================================================
// FORM: TAMBAH & EDIT
// ============================================================

/** Kumpulkan nilai dari form, kembalikan objek payload */
function getFormValues() {
  return {
    kode_barang : document.getElementById('f-kode').value.trim(),
    nama_barang : document.getElementById('f-nama').value.trim(),
    kategori_id : document.getElementById('f-kat').value,
    stok        : document.getElementById('f-stok').value,
    harga       : document.getElementById('f-harga').value,
    satuan      : document.getElementById('f-satuan').value,
    keterangan  : document.getElementById('f-ket').value.trim() || null,
  };
}

/** Validasi form di sisi klien (sebelum kirim ke server) */
function validateForm() {
  const form = document.getElementById('form-barang');
  form.classList.add('was-validated');

  // Cek harga secara manual karena input-group tidak terdeteksi Bootstrap
  const harga    = document.getElementById('f-harga').value;
  const feedEl   = document.getElementById('harga-feedback');
  if (!harga || Number(harga) < 0) {
    document.getElementById('f-harga').classList.add('is-invalid');
    feedEl.textContent = 'Harga wajib diisi (min 0).';
    feedEl.style.setProperty('display', 'block', 'important');
    return false;
  } else {
    document.getElementById('f-harga').classList.remove('is-invalid');
    feedEl.style.setProperty('display', 'none', 'important');
  }

  return form.checkValidity();
}

/** Reset form ke kondisi awal (mode tambah) */
function resetForm() {
  document.getElementById('form-barang').reset();
  document.getElementById('form-barang').classList.remove('was-validated');
  document.getElementById('f-id').value = '';
  document.getElementById('f-harga').classList.remove('is-invalid');
  document.getElementById('harga-feedback').style.setProperty('display', 'none', 'important');

  document.getElementById('form-title').innerHTML =
    '<i class="bi bi-plus-circle me-2 text-primary"></i>Tambah Barang';
  document.getElementById('btn-submit-text').textContent = 'Tambah Barang';
  document.getElementById('btn-submit').querySelector('i').className = 'bi bi-plus-lg me-1';
  document.getElementById('btn-cancel').classList.add('d-none');

  document.body.classList.remove('edit-mode');
  editMode = false;
}

/** Isi form dengan data barang untuk mode edit */
async function editBarang(id) {
  try {
    const b = await fetchBarangById(id);

    document.getElementById('f-id').value            = b.id;
    document.getElementById('f-kode').value           = b.kode_barang;
    document.getElementById('f-nama').value           = b.nama_barang;
    document.getElementById('f-kat').value            = b.kategori_id;
    document.getElementById('f-stok').value           = b.stok;
    document.getElementById('f-harga').value          = b.harga;
    document.getElementById('f-satuan').value         = b.satuan;
    document.getElementById('f-ket').value            = b.keterangan || '';

    document.getElementById('form-title').innerHTML =
      '<i class="bi bi-pencil-square me-2 text-warning"></i>Edit Barang';
    document.getElementById('btn-submit-text').textContent = 'Simpan Perubahan';
    document.getElementById('btn-submit').querySelector('i').className = 'bi bi-check-lg me-1';
    document.getElementById('btn-cancel').classList.remove('d-none');

    document.body.classList.add('edit-mode');
    editMode = true;

    // Scroll ke form pada mobile
    document.getElementById('form-barang').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (e) {
    showToast(`Gagal memuat data: ${e.message}`, 'error');
  }
}

/** Batalkan mode edit, kembali ke mode tambah */
function cancelEdit() {
  resetForm();
}

// ============================================================
// SUBMIT FORM (Create / Update)
// ============================================================
document.getElementById('form-barang').addEventListener('submit', async function (e) {
  e.preventDefault();

  if (!validateForm()) return;

  const payload = getFormValues();
  const id      = document.getElementById('f-id').value;
  const btnEl   = document.getElementById('btn-submit');

  // Disable tombol & tampilkan spinner saat proses
  btnEl.disabled = true;
  const originalHTML = btnEl.innerHTML;
  btnEl.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span> Menyimpan...';

  try {
    let savedData;

    if (editMode && id) {
      // ── UPDATE ──
      savedData = await updateBarang(id, payload);
      showToast(`✅ Barang "${savedData.nama_barang}" berhasil diperbarui`);
    } else {
      // ── CREATE ──
      savedData = await createBarang(payload);
      showToast(`✅ Barang "${savedData.nama_barang}" berhasil ditambahkan`, 'success');
    }

    // Reload data dan reset form
    await loadBarang();
    resetForm();

    // Highlight baris yang baru/diedit
    setTimeout(() => {
      const row = document.getElementById(`row-${savedData.id}`);
      if (row) {
        row.classList.add('row-flash');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        setTimeout(() => row.classList.remove('row-flash'), 1300);
      }
    }, 150);

  } catch (e) {
    showToast(`❌ ${e.message}`, 'error');
  } finally {
    btnEl.disabled = false;
    btnEl.innerHTML = originalHTML;
  }
});

// ============================================================
// HAPUS DATA
// ============================================================

/** Hapus barang setelah konfirmasi pengguna */
async function hapusBarang(id, nama) {
  // Konfirmasi sebelum hapus
  if (!confirm(`Apakah Anda yakin ingin menghapus barang:\n"${nama}"?\n\nData yang dihapus tidak dapat dikembalikan.`)) {
    return;
  }

  try {
    const deleted = await deleteBarang(id);
    showToast(`🗑️ Barang "${deleted.nama_barang}" berhasil dihapus`, 'info');
    await loadBarang();

    // Jika sedang edit barang yang dihapus, reset form
    if (editMode && document.getElementById('f-id').value == id) {
      resetForm();
    }
  } catch (e) {
    showToast(`❌ ${e.message}`, 'error');
  }
}

// ============================================================
// DETAIL MODAL
// ============================================================

/** Tampilkan modal detail barang */
async function showDetail(id) {
  const bodyEl = document.getElementById('modal-detail-body');
  bodyEl.innerHTML = `
    <div class="text-center py-3 text-muted">
      <div class="spinner-border spinner-border-sm me-2"></div> Memuat...
    </div>`;

  const modal = new bootstrap.Modal(document.getElementById('modal-detail'));
  modal.show();

  try {
    const b = await fetchBarangById(id);

    bodyEl.innerHTML = `
      <div class="row g-3">
        <div class="col-6">
          <div class="detail-label">Kode Barang</div>
          <div class="detail-value"><span class="kode-barang">${escHtml(b.kode_barang)}</span></div>
        </div>
        <div class="col-6">
          <div class="detail-label">Kategori</div>
          <div class="detail-value"><span class="kat-badge">${escHtml(b.nama_kategori)}</span></div>
        </div>
        <div class="col-12">
          <div class="detail-label">Nama Barang</div>
          <div class="detail-value fw-semibold fs-6">${escHtml(b.nama_barang)}</div>
        </div>
        <div class="col-4">
          <div class="detail-label">Stok</div>
          <div class="detail-value">${stokBadge(b.stok)}</div>
        </div>
        <div class="col-4">
          <div class="detail-label">Satuan</div>
          <div class="detail-value">${escHtml(b.satuan)}</div>
        </div>
        <div class="col-4">
          <div class="detail-label">Harga</div>
          <div class="detail-value fw-medium">${formatRupiah(b.harga)}</div>
        </div>
        <div class="col-12">
          <div class="detail-label">Keterangan</div>
          <div class="detail-value text-muted">${escHtml(b.keterangan) || '<em>Tidak ada keterangan</em>'}</div>
        </div>
        <div class="col-6">
          <div class="detail-label">Dibuat</div>
          <div class="detail-value small text-muted">${new Date(b.created_at).toLocaleString('id-ID')}</div>
        </div>
        <div class="col-6">
          <div class="detail-label">Terakhir Diperbarui</div>
          <div class="detail-value small text-muted">${new Date(b.updated_at).toLocaleString('id-ID')}</div>
        </div>
      </div>`;
  } catch (e) {
    bodyEl.innerHTML = `<div class="alert alert-danger mb-0">Gagal memuat detail: ${escHtml(e.message)}</div>`;
  }
}

// ============================================================
// SEARCH — real-time dengan debounce 300ms
// ============================================================
document.getElementById('search-input').addEventListener('input', function () {
  clearTimeout(searchTimer);
  const q = this.value.trim();

  searchTimer = setTimeout(async () => {
    if (q === '') {
      // Tidak ada keyword → tampilkan semua dari cache
      renderTabel(allBarang);
      document.getElementById('info-count').textContent = `${allBarang.length} data`;
      return;
    }

    try {
      const results = await searchBarang(q);
      renderTabel(results);
      document.getElementById('info-count').textContent =
        results.length > 0
          ? `${results.length} dari ${allBarang.length} data`
          : 'Tidak ada hasil';
    } catch (e) {
      showToast(`Pencarian gagal: ${e.message}`, 'error');
    }
  }, 300);
});

/** Tombol X di search bar */
document.getElementById('btn-clear-search').addEventListener('click', function () {
  document.getElementById('search-input').value = '';
  renderTabel(allBarang);
  document.getElementById('info-count').textContent = `${allBarang.length} data`;
  document.getElementById('search-input').focus();
});

// ============================================================
// INISIALISASI — jalankan saat DOM siap
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  loadKategori();   // isi dropdown kategori
  loadBarang();     // muat data tabel
});
