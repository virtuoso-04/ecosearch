// HACKATHON MOD: API utility functions updated for Product Create functionality
// - Added FormData support for image uploads with progress tracking
// - Enhanced product creation with multipart/form-data handling
// - Added fallback to JSON for non-image submissions

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
 * // HACKATHON MOD: Added FormData detection for proper content-type handling
 */
const fetchWithAuth = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  // HACKATHON MOD: Don't set Content-Type for FormData, let browser handle it
  if (config.body && !(config.body instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
    if (typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }
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

  // HACKATHON MOD: Enhanced createProduct to handle both FormData and JSON
  createProduct: (productData) => {
    if (productData instanceof FormData) {
      // Handle multipart/form-data for image uploads
      return fetchWithAuth('/products', {
        method: 'POST',
        body: productData, // FormData automatically sets correct Content-Type
      });
    } else {
      // Handle JSON fallback
      return fetchWithAuth('/products', {
        method: 'POST',
        body: productData,
      });
    }
  },

  // HACKATHON MOD: Enhanced createProduct with progress tracking for uploads
  createProductWithProgress: (productData, onProgress) => {
    return new Promise((resolve, reject) => {
      const token = getAuthToken();
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', () => {
        try {
          const data = JSON.parse(xhr.responseText);
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(data);
          } else {
            reject(new Error(data.message || `HTTP error! status: ${xhr.status}`));
          }
        } catch (error) {
          reject(new Error('Invalid response format'));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed'));
      });

      xhr.open('POST', `${API_BASE_URL}/products`);
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(productData);
    });
  },

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

// Cart API calls
export const cartApi = {
  getCart: () => 
    fetchWithAuth('/cart'),
    
  addToCart: (productId, quantity = 1) => 
    fetchWithAuth('/cart/add', {
      method: 'POST',
      body: { product_id: productId, quantity },
    }),
    
  updateQuantity: (cartItemId, quantity) => 
    fetchWithAuth(`/cart/${cartItemId}`, {
      method: 'PUT',
      body: { quantity },
    }),
    
  removeItem: (cartItemId) => 
    fetchWithAuth(`/cart/${cartItemId}`, {
      method: 'DELETE',
    }),
    
  clearCart: () => 
    fetchWithAuth('/cart/clear', {
      method: 'DELETE',
    }),
};

// Demo API calls
export const demoApi = {
  reset: () => fetchWithAuth('/demo/reset'),
};

export default {
  authApi,
  productsApi,
  healthApi,
  cartApi,
  demoApi,
};
