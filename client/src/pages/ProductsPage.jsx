

import React, { useState, useEffect } from 'react';
import { Filter, Grid, List, Star, MapPin, Heart, ShoppingCart, CheckCircle } from 'lucide-react';
import { productsApi } from '../utils/api';
import { CATEGORIES, CONDITIONS, getConditionColor, getCategoryLabel } from '../constants/categories';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import cartService from '../services/cartService';
import { handleImageError, getImageUrl } from '../utils/imageUtils';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    condition: searchParams.get('condition') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || 'newest',
    search: searchParams.get('search') || ''
  });
  const [addingToCart, setAddingToCart] = useState({});
  const [notification, setNotification] = useState(null);

  const mockProducts = [
    {
      id: 1,
      title: "iPhone 12 Pro - Excellent Condition",
      price: 599,
      original_price: 999,
      category: "electronics",
      condition: "excellent",
      location: "San Francisco, CA",
      image_url: "https://via.placeholder.com/300x300?text=iPhone+12+Pro",
      seller: {
        id: 101,
        name: "TechGuru123"
      },
      rating: 4.8,
      isFavorite: false,
      description: "Barely used iPhone 12 Pro in excellent condition. Comes with original box and charger.",
      createdAt: "2025-08-15T14:30:00Z"
    },
    {
      id: 2,
      title: "Vintage Leather Jacket - Classic Style",
      price: 89,
      original_price: 299,
      category: "clothing",
      condition: "good",
      location: "New York, NY",
      image_url: "https://via.placeholder.com/300x300?text=Leather+Jacket",
      seller: {
        id: 102,
        name: "VintageCollector"
      },
      rating: 4.6,
      isFavorite: true,
      description: "Authentic vintage leather jacket from the 90s. Some wear but still in great condition.",
      createdAt: "2025-08-20T09:45:00Z"
    },
    {
      id: 3,
      title: "Modern Office Chair - Ergonomic",
      price: 159,
      original_price: 349,
      category: "furniture",
      condition: "like_new",
      location: "Austin, TX",
      image_url: "https://via.placeholder.com/300x300?text=Office+Chair",
      seller: {
        id: 103,
        name: "OfficeDeals"
      },
      rating: 4.9,
      isFavorite: false,
      description: "Barely used ergonomic office chair. Perfect for home office setup.",
      createdAt: "2025-08-25T11:20:00Z"
    },
    {
      id: 4,
      title: "Road Bike - Carbon Frame",
      price: 899,
      original_price: 1599,
      category: "sports",
      condition: "excellent",
      location: "Portland, OR",
      image_url: "https://via.placeholder.com/300x300?text=Road+Bike",
      seller: {
        id: 104,
        name: "CyclingPro"
      },
      rating: 5.0,
      isFavorite: false,
      description: "High-end carbon frame road bike. Well-maintained and race-ready.",
      createdAt: "2025-08-27T16:15:00Z"
    },
    {
      id: 5,
      title: "Organic Cotton Bedding Set - Queen Size",
      price: 79,
      original_price: 199,
      category: "home_garden",
      condition: "new",
      location: "Seattle, WA",
      image_url: "https://via.placeholder.com/300x300?text=Cotton+Bedding",
      seller: {
        id: 105,
        name: "EcoHomeGoods"
      },
      rating: 4.7,
      isFavorite: false,
      description: "100% organic cotton bedding set. Includes duvet cover, fitted sheet, and 2 pillowcases.",
      createdAt: "2025-09-01T10:10:00Z"
    },
    {
      id: 6,
      title: "Vintage Vinyl Records Collection - 70s Rock",
      price: 120,
      original_price: null,
      category: "other",
      condition: "good",
      location: "Chicago, IL",
      image_url: "https://via.placeholder.com/300x300?text=Vinyl+Records",
      seller: {
        id: 106,
        name: "MusicCollector"
      },
      rating: 4.8,
      isFavorite: false,
      description: "Collection of 15 classic rock vinyl records from the 70s. All in playable condition with minor sleeve wear.",
      createdAt: "2025-09-02T14:55:00Z"
    },
    {
      id: 7,
      title: "Bamboo Yoga Mat - Eco-friendly",
      price: 45,
      original_price: 89,
      category: "health_beauty",
      condition: "like_new",
      location: "Denver, CO",
      image_url: "https://via.placeholder.com/300x300?text=Yoga+Mat",
      seller: {
        id: 107,
        name: "ZenYogi"
      },
      rating: 4.9,
      isFavorite: true,
      description: "Sustainable bamboo yoga mat with natural rubber base. Non-slip and eco-friendly.",
      createdAt: "2025-09-03T08:30:00Z"
    },
    {
      id: 8,
      title: "Wooden Train Set - Educational Toy",
      price: 35,
      original_price: 65,
      category: "toys_games",
      condition: "good",
      location: "Minneapolis, MN",
      image_url: "https://via.placeholder.com/300x300?text=Train+Set",
      seller: {
        id: 108,
        name: "EcoToys"
      },
      rating: 4.5,
      isFavorite: false,
      description: "Wooden train set with 40 pieces. Made from sustainable wood with non-toxic paint.",
      createdAt: "2025-09-04T13:40:00Z"
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // For debugging - let's directly use mock data to ensure the page loads
      console.log('Using mock data instead of API');
      setProducts(mockProducts);
      
      /* 
      // This is the original API call code
      const response = await productsApi.getProducts({
        page: 1,
        limit: 20
      });
      
      if (response.data && response.data.products && response.data.products.length > 0) {
        setProducts(response.data.products);
      } else {
        console.log('No products from API, using mock data instead');
        setProducts(mockProducts);
      }
      */
    } catch (error) {
      console.error('Failed to fetch products:', error);
      // Fallback to mock products instead of empty array
      console.log('Error fetching from API, using mock data instead');
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Using categories and conditions from constants file
  const categories = CATEGORIES;
  const conditions = CONDITIONS;
  const priceRanges = ['Under $50', '$50-$100', '$100-$500', '$500-$1000', 'Over $1000'];

  const toggleFavorite = (productId) => {
    setProducts(products.map(product => 
      product.id === productId 
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    ));
  };
  
  // Add to cart functionality
  const handleAddToCart = async (product) => {
    try {
      setAddingToCart({ ...addingToCart, [product.id]: true });
      
      // Add to cart using our service
      cartService.addItem(product, 1);
      
      // For a real app with API integration:
      // try {
      //   await cartApi.addToCart(product.id, 1);
      // } catch (error) {
      //   console.error('API call failed, using local storage as fallback');
      // }
      
      // Show success notification
      setNotification({
        type: 'success',
        message: `${product.title} added to cart`,
        productId: product.id
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setNotification({
        type: 'error',
        message: 'Failed to add item to cart. Please try again.',
        productId: product.id
      });
    } finally {
      setAddingToCart({ ...addingToCart, [product.id]: false });
    }
  };

  // Using getConditionColor from imported constants
  
  // Load more products function
  const loadMoreProducts = async () => {
    // For demo purposes, we'll add 4 more mock products each time
    const nextPage = page + 1;
    
    // Generate 4 new products based on existing ones but with different IDs
    const newProducts = mockProducts.slice(0, 4).map((product, index) => ({
      ...product,
      id: 100 + (page * 4) + index,
      title: `${product.title} - New Arrival ${nextPage}`,
      createdAt: new Date().toISOString()
    }));
    
    setProducts([...products, ...newProducts]);
    setPage(nextPage);
    
    // Stop loading more after page 3 for demo
    if (nextPage >= 3) {
      setHasMore(false);
    }
  };

  // Filter and sort products based on selected filters
  const filteredSortedProducts = () => {
    let filtered = [...products];
    
    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(product => 
        product.category && product.category.toLowerCase() === filters.category.toLowerCase()
      );
    }
    
    // Apply condition filter
    if (filters.condition) {
      filtered = filtered.filter(product => 
        product.condition && product.condition.toLowerCase() === filters.condition.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      switch(filters.priceRange) {
        case 'Under $50':
          filtered = filtered.filter(product => product.price < 50);
          break;
        case '$50-$100':
          filtered = filtered.filter(product => product.price >= 50 && product.price <= 100);
          break;
        case '$100-$500':
          filtered = filtered.filter(product => product.price > 100 && product.price <= 500);
          break;
        case '$500-$1000':
          filtered = filtered.filter(product => product.price > 500 && product.price <= 1000);
          break;
        case 'Over $1000':
          filtered = filtered.filter(product => product.price > 1000);
          break;
        default:
          break;
      }
    }
    
    // Apply sorting
    switch(filters.sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    return filtered;
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
                  <option key={category.value} value={category.value}>{category.label}</option>
                ))}
              </select>

              <select
                value={filters.condition}
                onChange={(e) => setFilters({...filters, condition: e.target.value})}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition.value} value={condition.value}>{condition.label}</option>
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
          {filteredSortedProducts().map(product => (
            <div 
              key={product.id} 
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                viewMode === 'list' ? 'flex p-4' : 'overflow-hidden'
              }`}
            >
              {/* Product Image with Link - Updated with better image handling */}
              <Link to={`/products/${product.id}`} className={viewMode === 'list' ? 'w-32 h-32 flex-shrink-0 mr-4' : 'aspect-square'}>
                <img
                  src={getImageUrl(product.image_url)}
                  alt={product.title}
                  className="w-full h-full object-cover rounded-lg"
                  onError={handleImageError}
                />
              </Link>

              {/* Product Info */}
              <div className={viewMode === 'list' ? 'flex-1' : 'p-4'}>
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/products/${product.id}`} className="hover:text-green-700">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {product.title}
                    </h3>
                  </Link>
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
                  <div className="flex space-x-2">
                    <Link 
                      to={`/products/${product.id}`}
                      className="flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium border border-gray-300 hover:bg-gray-50"
                    >
                      Details
                    </Link>
                    <button 
                      onClick={() => handleAddToCart(product)}
                      disabled={addingToCart[product.id]}
                      className={`flex items-center justify-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        notification?.productId === product.id && notification?.type === 'success'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {addingToCart[product.id] ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Adding...</span>
                        </>
                      ) : notification?.productId === product.id && notification?.type === 'success' ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span>Add</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        {hasMore && filteredSortedProducts().length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => loadMoreProducts()}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
            >
              Load More Products
            </button>
          </div>
        )}
        
        {/* Cart Notification */}
        {notification && (
          <div className={`fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-lg flex items-center ${
            notification.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {notification.type === 'success' ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <div className="mt-1">
                    <Link to="/cart" className="text-sm underline mr-4">
                      View Cart
                    </Link>
                    <button 
                      onClick={() => setNotification(null)} 
                      className="text-sm"
                    >
                      Continue Shopping
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-5 h-5 mr-2">⚠️</div>
                <div>
                  <p className="font-medium">{notification.message}</p>
                  <button 
                    onClick={() => setNotification(null)} 
                    className="text-sm underline mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
