// ============================================================
// auth.js
// Utility functions untuk authentication dan authorization
// ============================================================

const Auth = {
  /**
   * Get token from localStorage
   */
  getToken() {
    return localStorage.getItem('token');
  },

  /**
   * Get current user data
   */
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn() {
    return !!this.getToken();
  },

  /**
   * Check if user is admin
   */
  isAdmin() {
    const user = this.getUser();
    return user && user.role === 'admin';
  },

  /**
   * Check if user is kasir
   */
  isKasir() {
    const user = this.getUser();
    return user && user.role === 'kasir';
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login.html';
    }
  },

  /**
   * Verify token with server
   */
  async verifyToken() {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      });

      const result = await response.json();

      if (result.success) {
        // Update user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.data));
        return result.data;
      } else {
        // Token invalid, logout
        this.logout();
        return null;
      }
    } catch (error) {
      console.error('Verify token error:', error);
      this.logout();
      return null;
    }
  },

  /**
   * Protect page - redirect if not logged in
   */
  requireLogin() {
    if (!this.isLoggedIn()) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  },

  /**
   * Require admin role - redirect if not admin
   */
  requireAdmin() {
    if (!this.requireLogin()) return false;
    
    if (!this.isAdmin()) {
      // Redirect kasir to POS
      window.location.href = '/pos.html';
      return false;
    }
    return true;
  },

  /**
   * Require kasir role - redirect if not kasir
   */
  requireKasir() {
    if (!this.requireLogin()) return false;
    
    if (!this.isKasir()) {
      // Redirect admin to dashboard
      window.location.href = '/dashboard.html';
      return false;
    }
    return true;
  },

  /**
   * Get authorization header
   */
  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    };
  }
};

// Export for use in other scripts
window.Auth = Auth;
