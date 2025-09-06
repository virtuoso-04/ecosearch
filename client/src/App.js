import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">🌱 EcoFinds</h1>
              <p className="ml-3 text-sm text-green-100 hidden sm:block">
                Sustainable Second-Hand Marketplace
              </p>
            </div>
            <div className="flex space-x-4">
              <button className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition-colors">
                Login
              </button>
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded transition-colors">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Unique Second-Hand Treasures
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Give products a second life. Buy and sell pre-owned goods sustainably.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for second-hand items..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-r-lg transition-colors">
                🔍 Search
              </button>
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['Electronics', 'Clothing', 'Furniture', 'Sports', 'Books', 'Home & Garden'].map((category) => (
              <button 
                key={category}
                className="bg-white hover:bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-full transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-semibold mb-2">Circular Economy</h3>
            <p className="text-gray-600">
              Extend product lifecycles and reduce waste through sustainable shopping
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">💚</div>
            <h3 className="text-xl font-semibold mb-2">Trusted Community</h3>
            <p className="text-gray-600">
              Connect with conscious buyers and sellers in your local area
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">�</div>
            <h3 className="text-xl font-semibold mb-2">Great Value</h3>
            <p className="text-gray-600">
              Find quality items at affordable prices while helping the planet
            </p>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            + List Your Item
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            🛒 Browse Marketplace
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors">
            👤 My Dashboard
          </button>
        </div>

        {/* Status Section */}
        <div className="mt-16 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>🚀 EcoFinds Status:</strong> Frontend ready! Backend API running on port 3001
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Features: User Authentication • Product Listings • Cart • Order Management • Search & Filtering</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
