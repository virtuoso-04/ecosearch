import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Recycle, Users, Zap, ShoppingBag, Plus, Search } from 'lucide-react';

const HomePage = () => {
  const categories = [
    { name: 'Electronics', emoji: '📱', count: '2.5k+' },
    { name: 'Clothing', emoji: '👕', count: '8.1k+' },
    { name: 'Furniture', emoji: '🪑', count: '1.2k+' },
    { name: 'Sports', emoji: '⚽', count: '956' },
    { name: 'Books', emoji: '📚', count: '3.4k+' },
    { name: 'Home & Garden', emoji: '🏡', count: '2.1k+' },
  ];

  const features = [
    {
      icon: <Recycle className="h-8 w-8 text-green-600" />,
      title: 'Circular Economy',
      description: 'Give products a second life and reduce waste by buying and selling pre-loved items.'
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: 'Community Driven',
      description: 'Connect with like-minded people who care about sustainable living and environmental impact.'
    },
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: 'Easy & Secure',
      description: 'Simple listing process, secure payments, and trusted community marketplace.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-blue-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Sustainable
              <span className="text-green-600 block">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Buy and sell pre-loved goods. Build a sustainable future. 
              Every purchase helps reduce waste and supports circular economy.
            </p>
            
            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/products"
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>Start Shopping</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/sell"
                className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white px-8 py-4 rounded-lg text-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Sell Your Items</span>
              </Link>
            </div>

            {/* Search Bar */}
            <div className="max-w-md mx-auto">
              <form className="relative">
                <input
                  type="text"
                  placeholder="Search for sustainable products..."
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
                <Search className="absolute left-4 top-4 h-6 w-6 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-lg text-gray-600">Discover sustainable products across all categories</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category.name.toLowerCase()}`}
                className="bg-gray-50 hover:bg-green-50 rounded-lg p-6 text-center transition-colors group"
              >
                <div className="text-4xl mb-3">{category.emoji}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 mb-1">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} items</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EcoFinds?</h2>
            <p className="text-lg text-gray-600">Making sustainable shopping simple and rewarding</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50k+</div>
              <div className="text-green-100">Happy Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200k+</div>
              <div className="text-green-100">Items Sold</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-green-100">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-green-100">CO₂ Saved (kg)</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of users who are building a more sustainable future through conscious consumption.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Get Started Today
            </Link>
            <Link
              to="/products"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-4 rounded-lg text-lg font-medium transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
