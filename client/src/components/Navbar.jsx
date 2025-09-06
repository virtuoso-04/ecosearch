// HACKATHON MOD: Updated navbar to include Create Product link
// - Added navigation to /create-product route
// - Enhanced mobile menu with quick create access

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Plus } from 'lucide-react';
import cartService from '../services/cartService';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();
  
  useEffect(() => {
    // Update cart count when component mounts or location changes
    updateCartCount();
    
    // Set up an interval to check for cart updates
    const intervalId = setInterval(updateCartCount, 2000);
    
    return () => clearInterval(intervalId);
  }, [location]);
  
  const updateCartCount = () => {
    try {
      const cart = cartService.getCart();
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      setCartCount(count);
    } catch (error) {
      console.error('Error updating cart count:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <span className="text-xl font-bold text-gray-900">EcoFinds</span>
          </Link>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search sustainable products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link
              to="/products"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/products')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              Browse
            </Link>
            {/* HACKATHON MOD: Added Create Product quick link */}
            <Link
              to="/create-product"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/create-product')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Create</span>
            </Link>
            {/* HACKATHON MOD: Added My Listings link */}
            <Link
              to="/my-listings"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/my-listings')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <User className="h-4 w-4" />
              <span>My Items</span>
            </Link>
            <Link
              to="/cart"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                isActive('/cart')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden lg:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
            <Link
              to="/purchases"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/purchases')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden lg:inline">Purchases</span>
            </Link>
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Login
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search sustainable products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/products"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/products')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              Browse Products
            </Link>
            {/* HACKATHON MOD: Added mobile Create Product link */}
            <Link
              to="/create-product"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/create-product')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <Plus className="h-4 w-4" />
              <span>Create Listing</span>
            </Link>
            {/* HACKATHON MOD: Added mobile My Listings link */}
            <Link
              to="/my-listings"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/my-listings')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>My Listings</span>
            </Link>
            <Link
              to="/cart"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium relative ${
                isActive('/cart')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>Shopping Cart</span>
              {cartCount > 0 && (
                <span className="bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-1">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link
              to="/dashboard"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <User className="h-4 w-4" />
              <span>My Profile</span>
            </Link>
            <Link
              to="/purchases"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/purchases')
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-700 hover:text-green-600 hover:bg-gray-50'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Purchases</span>
            </Link>
            <div className="pt-2 border-t border-gray-200">
              <Link
                to="/login"
                className="block w-full text-center bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Login / Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
