import React, { useState } from 'react';
import { User, Package, ShoppingBag, TrendingUp, Edit3, Eye, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock user data
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    joinDate: "March 2024",
    avatar: "https://via.placeholder.com/100x100?text=AJ",
    stats: {
      itemsSold: 23,
      itemsBought: 17,
      totalEarnings: 1285,
      co2Saved: 45.8
    }
  };

  const recentListings = [
    {
      id: 1,
      title: "MacBook Pro 13-inch",
      price: 899,
      status: "active",
      views: 45,
      image: "https://via.placeholder.com/80x80?text=MacBook"
    },
    {
      id: 2,
      title: "Designer Backpack",
      price: 75,
      status: "sold",
      views: 23,
      image: "https://via.placeholder.com/80x80?text=Backpack"
    },
    {
      id: 3,
      title: "Road Bike",
      price: 450,
      status: "active",
      views: 67,
      image: "https://via.placeholder.com/80x80?text=Bike"
    }
  ];

  const recentPurchases = [
    {
      id: 1,
      title: "iPhone 12 Pro",
      price: 599,
      date: "2024-09-01",
      seller: "TechGuru123",
      image: "https://via.placeholder.com/80x80?text=iPhone"
    },
    {
      id: 2,
      title: "Vintage Jacket",
      price: 89,
      date: "2024-08-28",
      seller: "VintageCollector",
      image: "https://via.placeholder.com/80x80?text=Jacket"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'listings', label: 'My Listings', icon: Package },
    { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'sold': 'bg-blue-100 text-blue-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.inactive;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your sustainable marketplace activity</p>
        </div>

        {/* User Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Sold</p>
                <p className="text-2xl font-bold text-gray-900">{user.stats.itemsSold}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Items Bought</p>
                <p className="text-2xl font-bold text-gray-900">{user.stats.itemsBought}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${user.stats.totalEarnings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-lg">🌱</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">CO₂ Saved</p>
                <p className="text-2xl font-bold text-gray-900">{user.stats.co2Saved}kg</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-green-500 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Recent Activity */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-sm text-gray-700">You sold <strong>MacBook Pro 13-inch</strong> for $899</p>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <p className="text-sm text-gray-700">You bought <strong>iPhone 12 Pro</strong> for $599</p>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <p className="text-sm text-gray-700">New listing: <strong>Road Bike</strong> received 12 views</p>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impact */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Environmental Impact</h3>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-2">🌍</span>
                        <h4 className="font-semibold text-green-900">Your Sustainability Stats</h4>
                      </div>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>• Prevented {user.stats.co2Saved}kg of CO₂ emissions</p>
                        <p>• Diverted {user.stats.itemsSold + user.stats.itemsBought} items from landfills</p>
                        <p>• Saved approximately {Math.round(user.stats.totalEarnings * 0.3)} liters of water</p>
                        <p>• Contributed to circular economy growth</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Listings Tab */}
            {activeTab === 'listings' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">My Listings</h3>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Add New Listing
                  </button>
                </div>
                
                <div className="space-y-4">
                  {recentListings.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-lg font-semibold text-green-600">${item.price}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center text-gray-500 text-sm mb-1">
                          <Eye className="h-4 w-4 mr-1" />
                          {item.views} views
                        </div>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700">
                          <Settings className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Purchases Tab */}
            {activeTab === 'purchases' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Purchase History</h3>
                <div className="space-y-4">
                  {recentPurchases.map(item => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <img src={item.image} alt={item.title} className="w-16 h-16 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-500">Sold by {item.seller}</p>
                        <p className="text-sm text-gray-500">Purchased on {item.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">${item.price}</p>
                        <Link to={`/purchases`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Settings</h3>
                <div className="max-w-md">
                  <div className="text-center mb-6">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mx-auto mb-4"
                    />
                    <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Change Photo
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={user.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                      <input
                        type="text"
                        value={user.joinDate}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                    </div>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
