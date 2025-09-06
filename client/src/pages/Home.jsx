/**
 * Home Page Component
 * Landing page with hero section, featured products, and search
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?featured=true&limit=6');
      const data = await response.json();
      if (data.success) {
        setFeaturedProducts(data.data.products);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find Sustainable Treasures
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Buy and sell pre-loved items to reduce waste and save money
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="flex-1 px-6 py-4 text-gray-900 text-lg rounded-l-full focus:outline-none focus:ring-2 focus:ring-green-300"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-r-full transition-colors duration-200"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[
              { name: 'Electronics', icon: '📱', path: '/products?category=electronics' },
              { name: 'Clothing', icon: '👕', path: '/products?category=clothing' },
              { name: 'Furniture', icon: '🪑', path: '/products?category=furniture' },
              { name: 'Sports', icon: '⚽', path: '/products?category=sports' },
              { name: 'Books', icon: '📚', path: '/products?category=books' },
              { name: 'Home & Garden', icon: '🏡', path: '/products?category=home_garden' },
              { name: 'Automotive', icon: '🚗', path: '/products?category=automotive' },
              { name: 'Health & Beauty', icon: '💄', path: '/products?category=health_beauty' },
              { name: 'Toys & Games', icon: '🎮', path: '/products?category=toys_games' },
              { name: 'Other', icon: '📦', path: '/products?category=other' }
            ].map((category) => (
              <Link
                key={category.name}
                to={category.path}
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow duration-200 border border-gray-200"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-800">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link
              to="/products"
              className="text-green-600 hover:text-green-700 font-semibold"
            >
              View All →
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-lg h-64 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden"
                >
                  <div className="aspect-w-16 aspect-h-12">
                    <img
                      src={product.image_url || '/placeholder-image.jpg'}
                      alt={product.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-800 mb-2 truncate">
                      {product.title}
                    </h3>
                    <p className="text-2xl font-bold text-green-600 mb-1">
                      ${product.price}
                    </p>
                    {product.original_price && product.original_price > product.price && (
                      <p className="text-sm text-gray-500">
                        <span className="line-through">${product.original_price}</span>
                        <span className="ml-2 text-red-500">
                          {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% off
                        </span>
                      </p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      {product.location}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Turn your unused items into cash and help the environment
          </p>
          <Link
            to="/sell"
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full transition-colors duration-200"
          >
            Start Selling Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
