/**
 * Custom hooks for API operations with proper loading and error states
 */

import { useState, useEffect, useCallback } from 'react';
import apiService, { ApiError } from '../services/apiService';

// Generic hook for API calls
export function useApiCall(apiFunction, dependencies = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof ApiError ? err.message : 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, dependencies);

  return { data, loading, error, execute, refetch: execute };
}

// Products hooks
export function useProducts() {
  return useApiCall(() => apiService.getProducts(), [], true);
}

export function useProduct(id) {
  return useApiCall(() => apiService.getProduct(id), [id], !!id);
}

// Cart hooks
export function useCart() {
  return useApiCall(() => apiService.getCart(), [], true);
}

// User profile hook
export function useProfile() {
  return useApiCall(() => apiService.getProfile(), [], true);
}

// Purchases hook
export function usePurchases() {
  return useApiCall(() => apiService.getPurchases(), [], true);
}

// Search and filter hook
export function useProductSearch(products = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = !searchTerm || 
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !categoryFilter || 
      categoryFilter === 'All' || 
      product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  return {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    filteredProducts
  };
}

// Form validation hook
export function useFormValidation(initialValues, validationRules) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = useCallback((fieldName, value) => {
    const rule = validationRules[fieldName];
    if (!rule) return '';

    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${fieldName} is required`;
    }

    if (rule.minLength && value.length < rule.minLength) {
      return `${fieldName} must be at least ${rule.minLength} characters`;
    }

    if (rule.email && !/\S+@\S+\.\S+/.test(value)) {
      return 'Please enter a valid email';
    }

    if (rule.url && value && !/^https?:\/\/.+/.test(value)) {
      return 'Please enter a valid URL';
    }

    if (rule.min && parseFloat(value) < rule.min) {
      return `${fieldName} must be at least ${rule.min}`;
    }

    return '';
  }, [validationRules]);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validate, touched]);

  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validate(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  }, [validate, values]);

  const validateAll = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach(field => {
      const error = validate(field, values[field]);
      newErrors[field] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    setTouched(Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {}));

    return isValid;
  }, [validationRules, validate, values]);

  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validateAll,
    isValid: Object.values(errors).every(error => !error)
  };
}
