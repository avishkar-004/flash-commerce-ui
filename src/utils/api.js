
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

// Buyer API functions
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
