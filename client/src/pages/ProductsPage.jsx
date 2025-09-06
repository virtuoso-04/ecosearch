// HACKATHON MOD: ProductsPage updated for Product Create integration
// - Enhanced to work with new product listings
// - Uses shared constants for consistency
// - Improved product display with better image handling

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Star, MapPin, Heart } from 'lucide-react';
import { productsApi } from '../utils/api';
import { getConditionColor, getCategoryLabel } from '../constants/categories';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    priceRange: '',
    sortBy: 'newest'
  });

  // Mock products for demo
  const mockProducts = [
    {
      id: 1,
      title: "iPhone 12 Pro - Excellent Condition",
      price: 599,
      originalPrice: 999,
      category: "Electronics",
      condition: "excellent",
      location: "San Francisco, CA",
      image: "https://via.placeholder.com/300x300?text=iPhone+12+Pro",
      seller: "TechGuru123",
      rating: 4.8,
      isFavorite: false,
      description: "Barely used iPhone 12 Pro in excellent condition. Comes with original box and charger."
    },
    {
      id: 2,
      title: "Vintage Leather Jacket - Classic Style",
      price: 89,
      originalPrice: 299,
      category: "Clothing",
      condition: "good",
      location: "New York, NY",
      image: "https://via.placeholder.com/300x300?text=Leather+Jacket",
      seller: "VintageCollector",
      rating: 4.6,
      isFavorite: true,
      description: "Authentic vintage leather jacket from the 90s. Some wear but still in great condition."
    },
    {
      id: 3,
      title: "Modern Office Chair - Ergonomic",
      price: 159,
      originalPrice: 349,
      category: "Furniture",
      condition: "like_new",
      location: "Austin, TX",
      image: "https://via.placeholder.com/300x300?text=Office+Chair",
      seller: "OfficeDeals",
      rating: 4.9,
      isFavorite: false,
      description: "Barely used ergonomic office chair. Perfect for home office setup."
    },
    // Add more mock products
    {
      id: 4,
      title: "Road Bike - Carbon Frame",
      price: 899,
      originalPrice: 1599,
      category: "Sports",
      condition: "excellent",
      location: "Portland, OR",
      image: "https://via.placeholder.com/300x300?text=Road+Bike",
      seller: "CyclingPro",
      rating: 5.0,
      isFavorite: false,
      description: "High-end carbon frame road bike. Well-maintained and race-ready."
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // HACKATHON MOD: Use real API instead of mock data
      const response = await productsApi.getProducts({
        page: 1,
        limit: 20
      });
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to empty array
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Clothing', 'Furniture', 'Sports', 'Books', 'Home & Garden'];
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];
  const priceRanges = ['Under $50', '$50-$100', '$100-$500', '$500-$1000', 'Over $1000'];

  const toggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };

  const getConditionColor = (condition) => {
    const colors = {
      'excellent': 'text-green-600 bg-green-100',
      'like_new': 'text-blue-600 bg-blue-100',
      'good': 'text-yellow-600 bg-yellow-100',
      'fair': 'text-orange-600 bg-orange-100',
      'poor': 'text-red-600 bg-red-100'
    };
    return colors[condition] || 'text-gray-600 bg-gray-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading sustainable products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Products</h1>
          <p className="text-gray-600">Discover sustainable second-hand items from our community</p>
        </div>

        {/* Filters and View Toggle */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filters */}
            <div className="flex flex-wrap gap-4">
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </select>

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Prices</option>
                {priceRanges.map(range => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>

              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-green-100 text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          : "space-y-4"
        }>
          {products.map(product => (
            <div 
              key={product.id} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex p-4' : 'overflow-hidden'
              }`}
            >
              {/* Product Image - HACKATHON MOD: Updated image handling */}
              <div className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0 mr-4' : 'aspect-square'}>
                <img
                  src={product.image_url || '/placeholder-image.svg'}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.svg';
                  }}
                />
              </div>

              {/* Product Info */}
              <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className={`p-1 rounded-full ${product.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                  >
                    <Heart className={`h-5 w-5 ${product.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(product.condition)}`}>
                    {product.condition.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location || 'Location not specified'}
                </div>

                {/* HACKATHON MOD: Updated seller display to handle new data structure */}
                <div className="flex items-center mb-3">
                  {product.seller && (
                    <>
                      <span className="text-sm text-gray-600">by {product.seller.name}</span>
                      <span className="mx-2 text-gray-300">•</span>
                    </>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    {product.original_price && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ${product.original_price}
                      </span>
                    )}
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors">
            Load More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
