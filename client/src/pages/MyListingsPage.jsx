// HACKATHON MOD: My Listings page for managing user's product listings
// - Display user's products with edit/delete functionality
// - Basic ownership checks with auth integration
// - Quick actions for sold status and item management

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, CheckCircle, AlertCircle, Plus, Package } from 'lucide-react';
import { productsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { getConditionColor, getCategoryLabel } from '../constants/categories';

const MyListingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchMyProducts();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const response = await productsApi.getUserProducts(user.id);
      setProducts(response.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(productId);
      await productsApi.deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Failed to delete product:', error);
      setError('Failed to delete listing');
    } finally {
      setDeleting(null);
    }
  };

  const handleMarkSold = async (productId) => {
    try {
      await productsApi.markAsSold(productId);
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, status: 'sold' } : p
      ));
    } catch (error) {
      console.error('Failed to mark as sold:', error);
      setError('Failed to update listing status');
    }
  };

  // HACKATHON MOD: TODO implement auth check - currently allows for demo
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h1>
          <p className="text-gray-600 mb-6">You need to be signed in to view your listings.</p>
          <Link
            to="/login"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your listings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
            <p className="text-gray-600 mt-2">
              Manage your products • {products.length} listing{products.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link
            to="/create-product"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Create Listing</span>
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">No listings yet</h2>
              <p className="text-gray-600 mb-6">Start selling your items to the EcoFinds community</p>
              <Link
                to="/create-product"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Listing</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                {/* Image */}
                <div className="aspect-square relative">
                  <img
                    src={product.image_url || '/placeholder-image.svg'}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-image.svg';
                    }}
                  />
                  
                  {/* Status Badge */}
                  {product.status === 'sold' && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Sold
                    </div>
                  )}
                  {product.status === 'reserved' && (
                    <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Reserved
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">{product.title}</h3>
                    <span className="text-xl font-bold text-green-600">${product.price}</span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="text-gray-900">{getCategoryLabel(product.category)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Condition:</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getConditionColor(product.condition)}`}>
                        {product.condition.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Views:</span>
                      <span className="text-gray-900">{product.view_count || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Created:</span>
                      <span className="text-gray-900">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product.id}`}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center space-x-1"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View</span>
                      </Link>
                      
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center space-x-1"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </Link>
                    </div>

                    <div className="flex space-x-2">
                      {product.status === 'active' && (
                        <button
                          onClick={() => handleMarkSold(product.id)}
                          className="flex-1 bg-green-100 hover:bg-green-200 text-green-700 px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-1"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Mark Sold</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deleting === product.id}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center space-x-1"
                      >
                        {deleting === product.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tips */}
        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">💡 Tips for successful selling</h3>
          <ul className="text-green-800 space-y-1 text-sm">
            <li>• Keep your listings active and respond to messages quickly</li>
            <li>• Update your listing status when items are sold or reserved</li>
            <li>• High-quality photos get more views and faster sales</li>
            <li>• Honest descriptions build trust with buyers</li>
            <li>• HACKATHON MOD: Edit/delete functions working - auth checks to be implemented</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyListingsPage;
