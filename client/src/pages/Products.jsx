// HACKATHON MOD: Products listing page updated for Product Create integration
// - Enhanced search with debouncing for better UX
// - Updated to work with new product creation flow
// - Added category filtering and real-time search

/**
 * Products Listing Page
 * Browse, search, and filter products
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { productsApi } from '../utils/api';
import { CATEGORIES, CONDITIONS, getCategoryLabel, getConditionColor } from '../constants/categories';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || ''); // HACKATHON MOD: Separate search term for debouncing
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sortBy: searchParams.get('sortBy') || 'created_at',
    sortOrder: searchParams.get('sortOrder') || 'DESC'
  });

  // HACKATHON MOD: Debounced search implementation
  const debounceTimeout = React.useRef(null);
  
  const debouncedSearch = useCallback((term) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    
    debounceTimeout.current = setTimeout(() => {
      setFilters(prev => ({ ...prev, search: term }));
    }, 300); // 300ms debounce
  }, []);

  useEffect(() => {
    debouncedSearch(searchTerm);
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      // HACKATHON MOD: Use real API with enhanced error handling
      const response = await productsApi.getProducts({
        page,
        limit: 12,
        ...filters
      });
      
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // HACKATHON MOD: Fallback to empty state instead of mock data
      setProducts([]);
      setPagination({ page: 1, pages: 1, total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  // HACKATHON MOD: Separate handler for search input (immediate UI update)
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      sortOrder: 'DESC'
    };
    setFilters(clearedFilters);
    setSearchTerm(''); // HACKATHON MOD: Also clear search term
    setSearchParams(new URLSearchParams());
  };

  // HACKATHON MOD: Updated categories to use constants
  const categories = [
    { value: '', label: 'All Categories' },
    ...CATEGORIES
  ];

  const conditions = [
    { value: '', label: 'All Conditions' },
    ...CONDITIONS
  ];

  const sortOptions = [
    { value: 'created_at:DESC', label: 'Newest First' },
    { value: 'created_at:ASC', label: 'Oldest First' },
    { value: 'price:ASC', label: 'Price: Low to High' },
    { value: 'price:DESC', label: 'Price: High to Low' },
    { value: 'title:ASC', label: 'Name: A to Z' },
    { value: 'title:DESC', label: 'Name: Z to A' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Browse Products
          </h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Search - HACKATHON MOD: Updated to use debounced search */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              
              {/* Category */}
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              
              {/* Condition */}
              <select
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {conditions.map(cond => (
                  <option key={cond.value} value={cond.value}>{cond.label}</option>
                ))}
              </select>
              
              {/* Sort */}
              <select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            {/* Price Range */}
            <div className="flex items-center gap-4 mb-4">
              <span className="text-sm font-medium text-gray-700">Price Range:</span>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded w-24 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={clearFilters}
                className="px-4 py-1 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Clear All
              </button>
            </div>
          </div>
          
          {/* Results Count */}
          {!loading && (
            <p className="text-gray-600 mb-4">
              Showing {products.length} of {pagination.total} products
            </p>
          )}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow animate-pulse">
                <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-6 rounded w-20 mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 mb-4">No products found</p>
            <button
              onClick={clearFilters}
              className="text-green-600 hover:text-green-700 underline"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={product.image_url || '/placeholder-image.svg'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.svg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">
                    {product.title}
                  </h3>
                  <p className="text-xl font-bold text-green-600 mb-1">
                    ${product.price}
                  </p>
                  {product.original_price && product.original_price > product.price && (
                    <p className="text-sm text-gray-500 mb-2">
                      <span className="line-through">${product.original_price}</span>
                      <span className="ml-2 text-red-500">
                        {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                      </span>
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className={`px-2 py-1 rounded-full text-xs ${getConditionColor(product.condition)}`}>
                      {product.condition.replace('_', ' ')}
                    </span>
                    <span>{product.location}</span>
                  </div>
                  {product.seller && (
                    <p className="text-xs text-gray-500 mt-2">by {product.seller.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              {pagination.page > 1 && (
                <button
                  onClick={() => fetchProducts(pagination.page - 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                >
                  Previous
                </button>
              )}
              
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => fetchProducts(i + 1)}
                  className={`px-4 py-2 border rounded ${
                    i + 1 === pagination.page
                      ? 'bg-green-600 text-white border-green-600'
                      : 'text-gray-600 hover:text-gray-800 border-gray-300'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              {pagination.page < pagination.pages && (
                <button
                  onClick={() => fetchProducts(pagination.page + 1)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
