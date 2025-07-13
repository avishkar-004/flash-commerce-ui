
// API Configuration and Utilities
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Get auth token based on user role
export const getAuthToken = (role = 'buyer') => {
  const tokenMap = {
    buyer: 'buyer_token',
    seller: 'seller_token',
    admin: 'admin_token'
  };
  return localStorage.getItem(tokenMap[role]);
};

// Get user data based on role
export const getUserData = (role = 'buyer') => {
  const userMap = {
    buyer: 'buyer_user',
    seller: 'seller_user', 
    admin: 'admin_user'
  };
  const userData = localStorage.getItem(userMap[role]);
  return userData ? JSON.parse(userData) : null;
};

// API request wrapper with auth headers
export const apiRequest = async (endpoint, options = {}, role = 'buyer') => {
  const token = getAuthToken(role);
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.clear();
        window.location.href = '/';
        throw new Error('Authentication expired');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Specialized API functions
export const buyerAPI = {
  getProfile: () => apiRequest('/api/profile', {}, 'buyer'),
  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/orders/my-orders?${query}`, {}, 'buyer');
  },
  getCart: () => apiRequest('/api/cart', {}, 'buyer'),
  addToCart: (data) => apiRequest('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'buyer'),
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/products/search?${query}`, {}, 'buyer');
  },
  createOrderFromCart: (data) => apiRequest('/api/buyer/orders/create-from-cart', {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'buyer'),
  getQuotations: (orderId) => apiRequest(`/api/orders/${orderId}/quotations`, {}, 'buyer'),
  acceptQuotation: (orderId, quotationId) => apiRequest(`/api/orders/${orderId}/accept-quotation`, {
    method: 'POST',
    body: JSON.stringify({ quotation_id: quotationId })
  }, 'buyer')
};

export const sellerAPI = {
  getProfile: () => apiRequest('/api/profile', {}, 'seller'),
  getAvailableOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/seller/orders/available?${query}`, {}, 'seller');
  },
  getMyQuotations: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/seller/quotations/my-quotations?${query}`, {}, 'seller');
  },
  createQuotation: (data) => apiRequest('/api/seller/quotations/create', {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'seller'),
  getAcceptedOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/seller/orders/accepted?${query}`, {}, 'seller');
  },
  getAnalytics: (period = 30) => apiRequest(`/api/seller/analytics/overview?period=${period}`, {}, 'seller')
};

export const adminAPI = {
  getProfile: () => apiRequest('/api/profile', {}, 'admin'),
  getBuyers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/users/buyers?${query}`, {}, 'admin');
  },
  getSellers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/admin/users/sellers?${query}`, {}, 'admin');
  },
  getAdmins: () => apiRequest('/api/admin/users/admins', {}, 'admin'),
  createAdmin: (data) => apiRequest('/api/admin/create-admin', {
    method: 'POST',
    body: JSON.stringify(data)
  }, 'admin'),
  suspendUser: (userId) => apiRequest(`/api/admin/users/${userId}/suspend`, {
    method: 'PUT'
  }, 'admin'),
  activateUser: (userId) => apiRequest(`/api/admin/users/${userId}/activate`, {
    method: 'PUT'
  }, 'admin'),
  removeUser: (userId) => apiRequest(`/api/admin/users/${userId}/remove`, {
    method: 'DELETE'
  }, 'admin')
};

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    accepted: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
    rejected: 'bg-gray-100 text-gray-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};
