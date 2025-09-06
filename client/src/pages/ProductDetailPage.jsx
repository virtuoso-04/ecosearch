import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  Share2,
  CheckCircle, 
  AlertCircle,
  Package
} from 'lucide-react';
import { productsApi } from '../utils/api';
import { getConditionColor, getCategoryLabel } from '../constants/categories';
import cartService from '../services/cartService';
import { handleImageError, getImageUrl } from '../utils/imageUtils';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [notification, setNotification] = useState(null);
  
  // Mock data for seller
  const sellerData = {
    name: "EcoSeller",
    rating: 4.8,
    totalSales: 45,
    memberSince: "January 2024",
    responseTime: "Within 24 hours"
  };

  // Mock product data to use if API fails
  const mockProduct = {
    id: parseInt(id),
    title: "Premium Eco-Friendly Product",
    price: 299.99,
    original_price: 399.99,
    category: "electronics",
    condition: "excellent",
    location: "San Francisco, CA",
    description: "This is a premium eco-friendly product in excellent condition. It features sustainable materials and has been gently used. Perfect for environmentally conscious buyers who want quality without impacting the planet.",
    image_url: "https://via.placeholder.com/600x400?text=EcoProduct",
    images: [
      "https://via.placeholder.com/600x400?text=EcoProduct+Main",
      "https://via.placeholder.com/600x400?text=EcoProduct+Side",
      "https://via.placeholder.com/600x400?text=EcoProduct+Back"
    ],
    seller: {
      id: 101,
      name: "EcoSeller",
      rating: 4.8
    },
    createdAt: "2025-08-15T14:30:00Z",
    features: [
      "Sustainable materials",
      "Energy efficient",
      "Refurbished with care",
      "Original packaging included",
      "30-day guarantee"
    ]
  };
  
  useEffect(() => {
    fetchProductDetails();
  }, [id]);
  
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // In a real app, we'd call the API
      // const response = await productsApi.getProduct(id);
      // setProduct(response.data.product);
      
      // For now, use mock data
      console.log('Using mock product data');
      setTimeout(() => {
        setProduct(mockProduct);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to fetch product details:', error);
      setError('Failed to load product details. Please try again.');
      setLoading(false);
    }
  };
  
  const handleAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      // Add to cart using our service
      cartService.addItem(product, 1);
      
      setNotification({
        type: 'success',
        message: `${product.title} added to cart`,
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
      });
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  const handleToggleFavorite = () => {
    // In a real app, we would call an API to toggle favorite
    setProduct({
      ...product,
      isFavorite: !product.isFavorite
    });
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            to="/products" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-lg">
          <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-6">This product may have been removed or is no longer available.</p>
          <Link 
            to="/products" 
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Browse Other Products
          </Link>
        </div>
      </div>
    );
  }
  
  // Calculate discount percentage if original price exists
  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100) 
    : 0;
  
  // Ensure we have an array of images
  const images = product.images || [product.image_url];
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            to="/products" 
            className="inline-flex items-center text-green-600 hover:text-green-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden mb-4">
              <img 
                src={getImageUrl(images[activeImage])} 
                alt={product.title} 
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </div>
            
            {/* Image Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-square bg-white border-2 rounded-md overflow-hidden ${
                      index === activeImage 
                        ? 'border-green-500' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`${product.title} - Image ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <span 
              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getConditionColor(product.condition)}`}
            >
              {product.condition.replace('_', ' ')}
            </span>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>
            
            <div className="flex items-baseline mb-6">
              <span className="text-3xl font-bold text-green-600">
                ${product.price}
              </span>
              
              {product.original_price && (
                <>
                  <span className="ml-2 text-lg text-gray-500 line-through">
                    ${product.original_price}
                  </span>
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-700 rounded-md text-sm font-medium">
                    {discountPercentage}% off
                  </span>
                </>
              )}
            </div>
            
            {/* Location and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mb-6">
              {product.location && (
                <div className="flex items-center mr-6 mb-2 sm:mb-0">
                  <MapPin className="h-4 w-4 mr-1" />
                  {product.location}
                </div>
              )}
              
              <div className="flex items-center">
                <span>Listed {new Date(product.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="col-span-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Adding to Cart...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>
              
              <button 
                onClick={handleToggleFavorite}
                className="border border-gray-300 hover:border-gray-400 text-gray-700 py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                <Heart className={`h-5 w-5 ${product.isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                <span>Save</span>
              </button>
            </div>
            
            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
            
            {/* Features List */}
            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Features</h2>
                <ul className="space-y-1">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Category */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Category</p>
                  <p className="font-medium">{getCategoryLabel(product.category)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Condition</p>
                  <p className="font-medium capitalize">{product.condition.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
            
            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg mr-3">
                  {product.seller.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{product.seller.name}</h3>
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                    <span className="font-medium">{sellerData.rating}</span>
                    <span className="mx-1 text-gray-500">•</span>
                    <span className="text-gray-500">{sellerData.totalSales} sales</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Member since</p>
                  <p className="font-medium">{sellerData.memberSince}</p>
                </div>
                <div>
                  <p className="text-gray-500">Response time</p>
                  <p className="font-medium">{sellerData.responseTime}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products - We would implement this in a real app */}
        
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

export default ProductDetailPage;
