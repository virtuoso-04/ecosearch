import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">🌱 EcoSearch</h1>
            </div>
            <div className="flex space-x-4">
              <button className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded">
                Login
              </button>
              <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
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
            Sustainable Marketplace
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Buy and sell eco-friendly products. Make a difference for our planet.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex">
              <input
                type="text"
                placeholder="Search for eco-friendly products..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-r-lg">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">♻️</div>
            <h3 className="text-xl font-semibold mb-2">Sustainable Products</h3>
            <p className="text-gray-600">
              Discover eco-friendly alternatives for everyday products
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🌿</div>
            <h3 className="text-xl font-semibold mb-2">Green Community</h3>
            <p className="text-gray-600">
              Connect with like-minded people who care about the environment
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Easy Trading</h3>
            <p className="text-gray-600">
              Simple and secure platform for buying and selling
            </p>
          </div>
        </div>

        {/* Status Section */}
        <div className="mt-16 text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Status:</strong> Frontend is working! Backend API running on port 3001
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
