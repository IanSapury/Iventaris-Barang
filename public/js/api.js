// ============================================================
// api.js
// Utility functions untuk API calls
// ============================================================

const API = {
  baseURL: '/api',

  /**
   * Generic fetch with auth header
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Auth.getToken()}`
    };

    const config = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers
      }
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      // Handle unauthorized
      if (response.status === 401 || response.status === 403) {
        Auth.logout();
        throw new Error('Sesi berakhir, silakan login kembali');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * GET request
   */
  async get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  /**
   * POST request
   */
  async post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  /**
   * PUT request
   */
  async put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  },

  /**
   * PATCH request
   */
  async patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  // ========== BARANG ==========
  barang: {
    getAll: () => API.get('/barang'),
    getById: (id) => API.get(`/barang/${id}`),
    search: (keyword) => API.get(`/barang/search?q=${encodeURIComponent(keyword)}`),
    create: (data) => API.post('/barang', data),
    update: (id, data) => API.put(`/barang/${id}`, data),
    delete: (id) => API.delete(`/barang/${id}`)
  },

  // ========== KATEGORI ==========
  kategori: {
    getAll: () => API.get('/kategori'),
    getById: (id) => API.get(`/kategori/${id}`),
    create: (data) => API.post('/kategori', data)
  },

  // ========== TRANSAKSI ==========
  transaksi: {
    getMasuk: () => API.get('/transaksi/masuk'),
    getMasukById: (id) => API.get(`/transaksi/masuk/${id}`),
    createMasuk: (data) => API.post('/transaksi/masuk', data),
    
    getKeluar: () => API.get('/transaksi/keluar'),
    getKeluarById: (id) => API.get(`/transaksi/keluar/${id}`),
    createKeluar: (data) => API.post('/transaksi/keluar', data),
    
    getStats: () => API.get('/transaksi/stats'),
    generateNomor: (tipe) => API.get(`/transaksi/generate-nomor/${tipe}`)
  }
};

// Export for use in other scripts
window.API = API;
