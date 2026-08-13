// ============================================================
// pos.js
// Point of Sale Logic untuk Kasir
// ============================================================

// Protect page - admin dan kasir bisa akses
if (!Auth.requireLogin()) {
  throw new Error('Access denied');
}

// ===== GLOBAL STATE =====
let allProducts = [];
let filteredProducts = [];
let cart = [];
let categories = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initUI();
  loadCategories();
  loadProducts();
  startClock();
});

// ===== UI INITIALIZATION =====
function initUI() {
  const user = Auth.getUser();
  document.getElementById('kasir-name').textContent = user.nama_lengkap;

  // Logout
  document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('Yakin ingin logout?')) {
      Auth.logout();
    }
  });

  // Search
  const searchInput = document.getElementById('search-product');
  searchInput.addEventListener('input', Utils.debounce(() => {
    filterProducts();
  }, 300));

  // Clear search
  document.getElementById('btn-clear-search').addEventListener('click', () => {
    searchInput.value = '';
    filterProducts();
  });

  // Cart actions
  document.getElementById('btn-clear-cart').addEventListener('click', clearCart);
  document.getElementById('btn-checkout').addEventListener('click', showCheckoutModal);

  // Checkout modal
  const bayarInput = document.getElementById('bayar-amount');
  bayarInput.addEventListener('input', calculateKembalian);

  document.getElementById('btn-process-payment').addEventListener('click', processPayment);

  // Print struk
  document.getElementById('btn-print-struk').addEventListener('click', printStruk);
}

// ===== CLOCK =====
function startClock() {
  function updateClock() {
    const now = new Date();
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    document.getElementById('datetime').textContent = 
      now.toLocaleString('id-ID', options);
  }
  updateClock();
  setInterval(updateClock, 1000);
}

// ===== LOAD CATEGORIES =====
async function loadCategories() {
  try {
    const result = await API.kategori.getAll();
    if (result.success) {
      categories = result.data;
      renderCategoryFilter();
    }
  } catch (error) {
    console.error('Error loading categories:', error);
  }
}

function renderCategoryFilter() {
  const container = document.getElementById('category-filter');
  const buttons = categories.map(kat => 
    `<button class="filter-btn" data-kategori="${kat.id}">${Utils.escapeHtml(kat.nama)}</button>`
  ).join('');
  
  container.innerHTML = `
    <button class="filter-btn active" data-kategori="all">Semua</button>
    ${buttons}
  `;

  // Add click handlers
  container.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filterProducts();
    });
  });
}

// ===== LOAD PRODUCTS =====
async function loadProducts() {
  try {
    const result = await API.barang.getAll();
    if (result.success) {
      allProducts = result.data;
      filteredProducts = allProducts;
      renderProducts();
    }
  } catch (error) {
    console.error('Error loading products:', error);
    Utils.showToast('Gagal memuat produk', 'error');
  }
}

function filterProducts() {
  const searchTerm = document.getElementById('search-product').value.toLowerCase();
  const selectedKat = document.querySelector('.filter-btn.active')?.dataset.kategori;

  filteredProducts = allProducts.filter(product => {
    const matchSearch = !searchTerm || 
      product.kode_barang.toLowerCase().includes(searchTerm) ||
      product.nama_barang.toLowerCase().includes(searchTerm);
    
    const matchCategory = selectedKat === 'all' || 
      product.kategori_id == selectedKat;

    return matchSearch && matchCategory;
  });

  renderProducts();
}

function renderProducts() {
  const grid = document.getElementById('product-grid');

  if (filteredProducts.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="bi bi-inbox"></i>
        <p>Produk tidak ditemukan</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredProducts.map(product => {
    const stockClass = product.stok === 0 ? 'stock-empty' : 
                       product.stok < 10 ? 'stock-low' : 'stock-available';
    const stockLabel = product.stok === 0 ? 'Habis' : 
                       product.stok < 10 ? `Tersisa ${product.stok}` : 
                       `Stok ${product.stok}`;

    return `
      <div class="product-card" onclick="addToCart(${product.id})" 
           style="${product.stok === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}">
        <div class="product-icon">
          <i class="bi bi-box-seam"></i>
        </div>
        <div class="product-code">${Utils.escapeHtml(product.kode_barang)}</div>
        <div class="product-name">${Utils.escapeHtml(product.nama_barang)}</div>
        <div class="product-price">${Utils.formatRupiah(product.harga)}</div>
        <div class="product-stock ${stockClass}">${stockLabel}</div>
      </div>
    `;
  }).join('');
}

// ===== CART MANAGEMENT =====
function addToCart(productId) {
  const product = allProducts.find(p => p.id === productId);
  
  if (!product) return;
  if (product.stok === 0) {
    Utils.showToast('Stok produk habis', 'error');
    return;
  }

  // Check if product already in cart
  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    if (existingItem.qty >= product.stok) {
      Utils.showToast('Jumlah melebihi stok tersedia', 'warning');
      return;
    }
    existingItem.qty++;
  } else {
    cart.push({
      id: product.id,
      kode_barang: product.kode_barang,
      nama_barang: product.nama_barang,
      harga: product.harga,
      stok_tersedia: product.stok,
      qty: 1
    });
  }

  renderCart();
  Utils.showToast('Produk ditambahkan ke keranjang', 'success');
}

function updateCartItemQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if (!item) return;

  const newQty = item.qty + delta;

  if (newQty <= 0) {
    removeFromCart(productId);
    return;
  }

  if (newQty > item.stok_tersedia) {
    Utils.showToast('Jumlah melebihi stok tersedia', 'warning');
    return;
  }

  item.qty = newQty;
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  renderCart();
  Utils.showToast('Produk dihapus dari keranjang', 'info');
}

function clearCart() {
  if (cart.length === 0) return;
  
  if (confirm('Hapus semua item di keranjang?')) {
    cart = [];
    renderCart();
    Utils.showToast('Keranjang dikosongkan', 'info');
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const btnCheckout = document.getElementById('btn-checkout');

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="empty-cart">
        <i class="bi bi-cart-x"></i>
        <p>Keranjang masih kosong</p>
        <small>Pilih produk untuk memulai transaksi</small>
      </div>
    `;
    btnCheckout.disabled = true;
    updateCartSummary();
    return;
  }

  container.innerHTML = cart.map(item => {
    const subtotal = item.qty * item.harga;
    return `
      <div class="cart-item">
        <div class="cart-item-header">
          <div class="cart-item-name">${Utils.escapeHtml(item.nama_barang)}</div>
          <button class="btn-remove" onclick="removeFromCart(${item.id})">
            <i class="bi bi-x-lg"></i>
          </button>
        </div>
        <div class="cart-item-price">
          ${Utils.formatRupiah(item.harga)} × ${item.qty}
        </div>
        <div class="cart-item-controls">
          <div class="qty-controls">
            <button class="qty-btn" onclick="updateCartItemQty(${item.id}, -1)">
              <i class="bi bi-dash"></i>
            </button>
            <span class="qty-value">${item.qty}</span>
            <button class="qty-btn" onclick="updateCartItemQty(${item.id}, 1)" 
                    ${item.qty >= item.stok_tersedia ? 'disabled' : ''}>
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <div class="cart-item-subtotal">${Utils.formatRupiah(subtotal)}</div>
        </div>
      </div>
    `;
  }).join('');

  btnCheckout.disabled = false;
  updateCartSummary();
}

function updateCartSummary() {
  const total = cart.reduce((sum, item) => sum + (item.qty * item.harga), 0);
  document.getElementById('subtotal').textContent = Utils.formatRupiah(total);
  document.getElementById('total').textContent = Utils.formatRupiah(total);
}

// ===== CHECKOUT =====
function showCheckoutModal() {
  if (cart.length === 0) return;

  const total = cart.reduce((sum, item) => sum + (item.qty * item.harga), 0);
  document.getElementById('checkout-total').textContent = Utils.formatRupiah(total);
  document.getElementById('pelanggan-name').value = '';
  document.getElementById('bayar-amount').value = '';
  document.getElementById('kembalian-box').style.display = 'none';
  document.getElementById('alert-bayar').classList.add('d-none');

  const modal = new bootstrap.Modal(document.getElementById('modal-checkout'));
  modal.show();
}

function calculateKembalian() {
  const total = cart.reduce((sum, item) => sum + (item.qty * item.harga), 0);
  const bayar = parseFloat(document.getElementById('bayar-amount').value) || 0;
  const kembalian = bayar - total;

  const kembalianBox = document.getElementById('kembalian-box');
  const alertBox = document.getElementById('alert-bayar');
  const alertText = document.getElementById('alert-bayar-text');

  if (bayar === 0) {
    kembalianBox.style.display = 'none';
    alertBox.classList.add('d-none');
    return;
  }

  if (kembalian < 0) {
    kembalianBox.style.display = 'none';
    alertBox.classList.remove('d-none');
    alertText.textContent = 'Jumlah bayar kurang dari total belanja';
  } else {
    alertBox.classList.add('d-none');
    kembalianBox.style.display = 'block';
    document.getElementById('kembalian-value').textContent = Utils.formatRupiah(kembalian);
  }
}

async function processPayment() {
  const total = cart.reduce((sum, item) => sum + (item.qty * item.harga), 0);
  const bayar = parseFloat(document.getElementById('bayar-amount').value) || 0;
  const pelanggan = document.getElementById('pelanggan-name').value.trim() || 'Walk-in Customer';

  // Validation
  if (bayar === 0) {
    Utils.showToast('Masukkan jumlah bayar', 'error');
    return;
  }

  if (bayar < total) {
    Utils.showToast('Jumlah bayar kurang dari total belanja', 'error');
    return;
  }

  const btnProcess = document.getElementById('btn-process-payment');
  btnProcess.disabled = true;
  btnProcess.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Memproses...';

  try {
    // Generate nomor transaksi
    const nomorResult = await API.transaksi.generateNomor('keluar');
    const nomorTransaksi = nomorResult.data.nomor_transaksi;

    // Prepare transaction data
    const transactionData = {
      nomor_transaksi: nomorTransaksi,
      tanggal: new Date().toISOString(),
      pelanggan: pelanggan,
      bayar: bayar,
      items: cart.map(item => ({
        barang_id: item.id,
        jumlah: item.qty,
        harga_jual: item.harga
      }))
    };

    // Submit transaction
    const result = await API.transaksi.createKeluar(transactionData);

    if (result.success) {
      // Hide checkout modal
      bootstrap.Modal.getInstance(document.getElementById('modal-checkout')).hide();

      // Show struk
      showStrukModal(result.data);

      // Clear cart
      cart = [];
      renderCart();

      Utils.showToast('Transaksi berhasil!', 'success');
    } else {
      throw new Error(result.message);
    }

  } catch (error) {
    console.error('Payment error:', error);
    Utils.showToast(error.message || 'Transaksi gagal', 'error');
  } finally {
    btnProcess.disabled = false;
    btnProcess.innerHTML = '<i class="bi bi-check-circle me-2"></i>Proses Pembayaran';
  }
}

// ===== STRUK =====
function showStrukModal(transaksi) {
  const strukContainer = document.getElementById('struk-container');
  
  strukContainer.innerHTML = `
    <div class="struk-header">
      <h3>SISTEM INVENTARIS UMKM</h3>
      <p>Struk Pembelian</p>
    </div>

    <div class="struk-info">
      <div>
        <span>No. Transaksi</span>
        <span>${Utils.escapeHtml(transaksi.nomor_transaksi)}</span>
      </div>
      <div>
        <span>Tanggal</span>
        <span>${Utils.formatDateTime(transaksi.tanggal)}</span>
      </div>
      <div>
        <span>Kasir</span>
        <span>${Utils.escapeHtml(transaksi.user_nama)}</span>
      </div>
      <div>
        <span>Pelanggan</span>
        <span>${Utils.escapeHtml(transaksi.pelanggan)}</span>
      </div>
    </div>

    <div class="struk-items">
      ${transaksi.detail.map(item => `
        <div class="struk-item">
          <div class="struk-item-name">${Utils.escapeHtml(item.nama_barang)}</div>
          <div class="struk-item-detail">
            <span>${item.jumlah} × ${Utils.formatRupiah(item.harga_jual)}</span>
            <span>${Utils.formatRupiah(item.subtotal)}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <div class="struk-total">
      <div>
        <span>Total</span>
        <span>${Utils.formatRupiah(transaksi.total_harga)}</span>
      </div>
      <div>
        <span>Bayar</span>
        <span>${Utils.formatRupiah(transaksi.bayar)}</span>
      </div>
      <div>
        <span>Kembalian</span>
        <span>${Utils.formatRupiah(transaksi.kembalian)}</span>
      </div>
      <div class="total">
        <span>TOTAL BAYAR</span>
        <span>${Utils.formatRupiah(transaksi.total_harga)}</span>
      </div>
    </div>

    <div class="struk-footer">
      <p>Terima kasih atas kunjungan Anda</p>
      <p>Barang yang sudah dibeli tidak dapat dikembalikan</p>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('modal-struk'));
  modal.show();
}

function printStruk() {
  const strukContent = document.getElementById('struk-container').innerHTML;
  
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <html>
    <head>
      <title>Print Struk</title>
      <style>
        body {
          font-family: 'Courier New', monospace;
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      ${strukContent}
      <script>
        window.onload = function() {
          window.print();
          window.onafterprint = function() {
            window.close();
          };
        };
      </script>
    </body>
    </html>
  `);
  printWindow.document.close();
}

// Make functions global for onclick handlers
window.addToCart = addToCart;
window.updateCartItemQty = updateCartItemQty;
window.removeFromCart = removeFromCart;
