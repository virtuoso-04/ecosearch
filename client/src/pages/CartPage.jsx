import React, { useState, useEffect } from 'react';
import { cartApi } from '../utils/api';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import cartService from '../services/cartService';
import { handleImageError, getImageUrl } from '../utils/imageUtils';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load cart data when component mounts
    loadCartData();
  }, []);
  
  const loadCartData = () => {
    setLoading(true);
    try {
      // Load from local storage using our service
      const storedCart = cartService.getCart();
      setCartItems(storedCart);
      
      // In a real app with API, you would do:
      // const response = await cartApi.getCart();
      // setCartItems(response.data.items);
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, newQuantity) => {
    try {
      // Update locally
      const updatedCart = cartService.updateQuantity(id, newQuantity);
      setCartItems(updatedCart);
      
      // In a real app with API:
      // await cartApi.updateQuantity(id, newQuantity);
      // loadCartData();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const removeItem = (id) => {
    try {
      // Remove locally
      const updatedCart = cartService.removeItem(id);
      setCartItems(updatedCart);
      
      // In a real app with API:
      // await cartApi.removeItem(id);
      // loadCartData();
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 9.99;
  const total = subtotal + shipping;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Discover sustainable products and start shopping!</p>
            <Link
              to="/products"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium inline-flex items-center space-x-2"
            >
              <span>Browse Products</span>
              <ArrowRight className="h-5 w-5" />
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Items</h2>
              </div>
              
              <div className="divide-y divide-gray-200">
                {cartItems.map(item => (
                  <div key={item.id} className="p-6 flex items-center space-x-4">
                    {/* Product Image */}
                    <img
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={handleImageError}
                    />
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-1">Sold by {item.seller}</p>
                      <span className="inline-block px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {item.condition}
                      </span>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full hover:bg-gray-100"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {/* Price */}
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${item.price}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="mt-1 text-red-600 hover:text-red-700 text-sm flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-lg font-semibold">${total.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => alert('Checkout functionality will be implemented soon!')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium mt-6 transition-colors"
              >
                Proceed to Checkout
              </button>
              
              <Link
                to="/products"
                className="block w-full text-center border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-medium mt-3 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>

            {/* Sustainability Impact */}
            <div className="bg-green-50 rounded-lg p-4 mt-6">
              <h3 className="font-semibold text-green-900 mb-2">🌱 Your Impact</h3>
              <p className="text-sm text-green-800">
                By buying second-hand, you're saving approximately <strong>12.5 kg of CO₂</strong> 
                and keeping these items out of landfills!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
