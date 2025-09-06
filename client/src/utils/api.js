/**
 * API Utility Functions
 * Centralized API calls with authentication and error handling
 */

// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Get authentication token from localStorage
 */
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Base fetch wrapper with error handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error('Invalid response format');
  }

  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Authentication API calls
export const authApi = {
  login: (credentials) => 
    fetchWithAuth('/auth/login', {
      method: 'POST',
      body: credentials,
    }),

  register: (userData) => 
    fetchWithAuth('/auth/register', {
      method: 'POST',
      body: userData,
    }),

  demoLogin: () => 
    fetchWithAuth('/auth/demo-login', {
      method: 'POST',
    }),

  getProfile: () => 
    fetchWithAuth('/auth/profile'),

  updateProfile: (profileData) => 
    fetchWithAuth('/auth/profile', {
      method: 'PUT',
      body: profileData,
    }),

  changePassword: (passwordData) => 
    fetchWithAuth('/auth/change-password', {
      method: 'POST',
      body: passwordData,
    }),
};

// Products API calls
export const productsApi = {
  getProducts: (params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return fetchWithAuth(`/products${queryString ? `?${queryString}` : ''}`);
  },

  getProduct: (id) => 
    fetchWithAuth(`/products/${id}`),

  createProduct: (productData) => 
    fetchWithAuth('/products', {
      method: 'POST',
      body: productData,
    }),

  updateProduct: (id, productData) => 
    fetchWithAuth(`/products/${id}`, {
      method: 'PUT',
      body: productData,
    }),

  deleteProduct: (id) => 
    fetchWithAuth(`/products/${id}`, {
      method: 'DELETE',
    }),

  getUserProducts: (userId, params = {}) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    
    const queryString = searchParams.toString();
    return fetchWithAuth(`/products/user/${userId}${queryString ? `?${queryString}` : ''}`);
  },

  markAsSold: (id) => 
    fetchWithAuth(`/products/${id}/mark-sold`, {
      method: 'POST',
    }),
};

// Health check
export const healthApi = {
  check: () => fetchWithAuth('/health'),
};

// Demo API calls
export const demoApi = {
  reset: () => fetchWithAuth('/demo/reset'),
};

export default {
  authApi,
  productsApi,
  healthApi,
  demoApi,
};
