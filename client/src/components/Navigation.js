import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Button } from './ui';

function Navigation() {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/products', label: 'Marketplace', icon: '🏪' },
    { path: '/my-listings', label: 'My Listings', icon: '📦' },
    { path: '/cart', label: 'Cart', icon: '🛒' },
    { path: '/purchases', label: 'Purchases', icon: '📋' },
    { path: '/dashboard', label: 'Profile', icon: '👤' },
  ];

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/products" className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors">
            EcoFinds
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-green-100 text-green-700 shadow-sm'
                    : 'text-gray-600 hover:text-green-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              as={Link}
              to="/add-product"
              size="sm"
              className="font-medium"
            >
              + Add Product
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-white">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-3 px-2 rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-green-100 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium text-center leading-tight">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
        
        {/* Mobile Add Product Button */}
        <div className="p-3 border-t border-gray-100">
          <Button
            as={Link}
            to="/add-product"
            className="w-full"
            size="sm"
          >
            + Add New Product
          </Button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
