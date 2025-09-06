import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Star, Package, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PreviousPurchasesPage = () => {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Mock purchases data
  const mockPurchases = [
    {
      id: 1,
      product: {
        id: 101,
        title: "iPhone 12 Pro - Excellent Condition",
        price: 599,
        image_url: "https://via.placeholder.com/300x300?text=iPhone+12+Pro",
        category: "electronics",
        condition: "excellent"
      },
      date: "2025-09-01T10:15:30Z",
      seller: {
        id: 201,
        name: "TechGuru123",
        rating: 4.8
      },
      status: "delivered",
      deliveredDate: "2025-09-05T14:20:00Z"
    },
    {
      id: 2,
      product: {
        id: 102,
        title: "Vintage Leather Jacket - Classic Style",
        price: 89,
        image_url: "https://via.placeholder.com/300x300?text=Leather+Jacket",
        category: "clothing",
        condition: "good"
      },
      date: "2025-08-20T08:45:00Z",
      seller: {
        id: 202,
        name: "VintageCollector",
        rating: 4.6
      },
      status: "delivered",
      deliveredDate: "2025-08-25T11:10:00Z"
    },
    {
      id: 3,
      product: {
        id: 103,
        title: "Modern Office Chair - Ergonomic",
        price: 159,
        image_url: "https://via.placeholder.com/300x300?text=Office+Chair",
        category: "furniture",
        condition: "like_new"
      },
      date: "2025-07-15T16:30:00Z",
      seller: {
        id: 203,
        name: "OfficeDeals",
        rating: 4.9
      },
      status: "delivered",
      deliveredDate: "2025-07-20T09:15:00Z"
    },
    {
      id: 4,
      product: {
        id: 104,
        title: "Bamboo Yoga Mat - Eco-friendly",
        price: 45,
        image_url: "https://via.placeholder.com/300x300?text=Yoga+Mat",
        category: "health_beauty",
        condition: "like_new"
      },
      date: "2025-07-05T14:20:00Z",
      seller: {
        id: 204,
        name: "ZenYogi",
        rating: 4.9
      },
      status: "delivered",
      deliveredDate: "2025-07-08T10:45:00Z"
    }
  ];
  
  useEffect(() => {
    // In a real app, we would fetch the user's purchase history from API
    // For now, we'll simulate an API call with mock data
    const fetchPurchaseHistory = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          setPurchases(mockPurchases);
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Failed to fetch purchase history:', error);
        setLoading(false);
      }
    };
    
    fetchPurchaseHistory();
  }, []);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your purchase history...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (purchases.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Purchases</h1>
            <p className="text-gray-600">Your sustainable shopping journey</p>
          </div>
          
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Purchases Yet</h2>
            <p className="text-gray-600 mb-8">Start your sustainable shopping journey today!</p>
            <Link
              to="/products"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <span>Browse Products</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Previous Purchases</h1>
          <p className="text-gray-600">Your sustainable shopping journey</p>
        </div>
        
        {/* Impact Summary */}
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">🌱</span>
            <h2 className="text-xl font-bold text-green-900">Your Impact</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Items Purchased</p>
              <p className="text-2xl font-bold text-green-600">{purchases.length}</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">CO₂ Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {(purchases.length * 5.2).toFixed(1)} kg
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-500">Water Saved</p>
              <p className="text-2xl font-bold text-green-600">
                {(purchases.length * 1250).toLocaleString()} L
              </p>
            </div>
          </div>
        </div>
        
        {/* Purchase History List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Purchase History</h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {purchases.map(purchase => (
              <div key={purchase.id} className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Product Image */}
                  <Link 
                    to={`/products/${purchase.product.id}`}
                    className="w-full md:w-32 h-32 flex-shrink-0"
                  >
                    <img
                      src={purchase.product.image_url || '/placeholder-image.svg'}
                      alt={purchase.product.title}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.svg';
                      }}
                    />
                  </Link>
                  
                  {/* Purchase Details */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <Link 
                        to={`/products/${purchase.product.id}`} 
                        className="text-lg font-semibold text-gray-900 hover:text-green-600"
                      >
                        {purchase.product.title}
                      </Link>
                      <span className="text-lg font-bold text-green-600">
                        ${purchase.product.price}
                      </span>
                    </div>
                    
                    <div className="flex items-center mb-3">
                      <span 
                        className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2"
                      >
                        {purchase.product.condition.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        Purchased on {formatDate(purchase.date)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-1" />
                        <span>Delivered on {formatDate(purchase.deliveredDate)}</span>
                      </div>
                    </div>
                    
                    {/* Seller Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium mr-2">
                          {purchase.seller.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{purchase.seller.name}</p>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="ml-1 text-xs text-gray-500">{purchase.seller.rating}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <Link
                          to={`/products/${purchase.product.id}`}
                          className="text-sm font-medium text-green-600 hover:text-green-700"
                        >
                          View Product Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviousPurchasesPage;
