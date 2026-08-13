// ============================================================
// utils.js
// Utility functions untuk UI dan formatting
// ============================================================

const Utils = {
  /**
   * Format number to Rupiah currency
   */
  formatRupiah(amount) {
    return 'Rp ' + Number(amount).toLocaleString('id-ID');
  },

  /**
   * Format date to Indonesian format
   */
  formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  },

  /**
   * Format datetime to Indonesian format
   */
  formatDateTime(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  /**
   * Show toast notification
   */
  showToast(message, type = 'success') {
    // Create toast element if not exists
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(toastContainer);
    }

    // Create toast
    const toast = document.createElement('div');
    const bgColors = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };
    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill'
    };

    toast.style.cssText = `
      background: ${bgColors[type] || bgColors.info};
      color: white;
      padding: 16px 20px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 300px;
      max-width: 400px;
      display: flex;
      align-items: center;
      gap: 12px;
      animation: slideIn 0.3s ease-out;
      font-size: 14px;
      font-weight: 500;
    `;

    toast.innerHTML = `
      <i class="bi ${icons[type] || icons.info}" style="font-size: 20px;"></i>
      <span style="flex: 1;">${this.escapeHtml(message)}</span>
      <button onclick="this.parentElement.remove()" style="
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        font-size: 20px;
        opacity: 0.8;
        transition: opacity 0.2s;
      " onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.8'">
        <i class="bi bi-x"></i>
      </button>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 4 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  /**
   * Show loading spinner
   */
  showLoading(target = document.body) {
    const loading = document.createElement('div');
    loading.id = 'loading-overlay';
    loading.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    loading.innerHTML = `
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    `;
    target.style.position = 'relative';
    target.appendChild(loading);
  },

  /**
   * Hide loading spinner
   */
  hideLoading() {
    const loading = document.getElementById('loading-overlay');
    if (loading) loading.remove();
  },

  /**
   * Confirm dialog
   */
  async confirm(message, title = 'Konfirmasi') {
    return window.confirm(message);
  },

  /**
   * Debounce function
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Get stock badge HTML
   */
  getStockBadge(stok, threshold = 10) {
    const n = Number(stok);
    let className, label;
    
    if (n === 0) {
      className = 'bg-danger';
      label = 'Habis';
    } else if (n <= threshold) {
      className = 'bg-warning';
      label = 'Rendah';
    } else {
      className = 'bg-success';
      label = 'Tersedia';
    }

    return `<span class="badge ${className}">${n} ${label}</span>`;
  },

  /**
   * Copy to clipboard
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      this.showToast('Berhasil disalin ke clipboard', 'success');
    } catch (error) {
      console.error('Copy failed:', error);
      this.showToast('Gagal menyalin', 'error');
    }
  }
};

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateX(0);
    }
    to {
      opacity: 0;
      transform: translateX(100px);
    }
  }
`;
document.head.appendChild(style);

// Export for use in other scripts
window.Utils = Utils;
