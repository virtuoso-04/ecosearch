import React, { useState } from 'react';
import { ArrowLeft, Upload, DollarSign, Package, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const SellPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: 'good',
    price: '',
    originalPrice: '',
    location: '',
    images: []
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    'Electronics',
    'Clothing',
    'Furniture',
    'Sports',
    'Books',
    'Home & Garden',
    'Toys & Games',
    'Automotive',
    'Beauty & Health',
    'Other'
  ];

  const conditions = [
    { value: 'new', label: 'New', description: 'Never used, in original packaging' },
    { value: 'like_new', label: 'Like New', description: 'Used once or twice, excellent condition' },
    { value: 'good', label: 'Good', description: 'Some signs of use but functions perfectly' },
    { value: 'fair', label: 'Fair', description: 'Shows wear but still functional' },
    { value: 'poor', label: 'Poor', description: 'Heavy wear, may need repair' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      console.log('Product listed:', formData);
      // Redirect to products page or success page
    }, 2000);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // Handle image upload logic here
    console.log('Images selected:', files);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">List Your Item</h1>
          <p className="text-gray-600">Give your item a second life and help build a sustainable future</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Images Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Photos <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <div className="mb-4">
                  <label htmlFor="images" className="cursor-pointer">
                    <span className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                      Upload Photos
                    </span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-gray-500 text-sm">
                  Add up to 8 photos. First photo will be your cover image.
                </p>
              </div>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-lg font-medium text-gray-900 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="What are you selling?"
              />
              <p className="text-gray-500 text-sm mt-1">
                Be specific and include key details like brand, model, size, etc.
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-lg font-medium text-gray-900 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-4">
                Condition <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                {conditions.map(condition => (
                  <label
                    key={condition.value}
                    className={`relative flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                      formData.condition === condition.value 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={formData.condition === condition.value}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-3">
                      <span className="font-medium text-gray-900">{condition.label}</span>
                      <p className="text-sm text-gray-500">{condition.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-lg font-medium text-gray-900 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={6}
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Describe your item in detail. Include any flaws, special features, or additional items included..."
              />
              <p className="text-gray-500 text-sm mt-1">
                Be honest about the condition and include all relevant details.
              </p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="price" className="block text-lg font-medium text-gray-900 mb-2">
                  Selling Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="originalPrice" className="block text-lg font-medium text-gray-900 mb-2">
                  Original Price <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    id="originalPrice"
                    name="originalPrice"
                    type="number"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-1">
                  Helps buyers see the value they're getting
                </p>
              </div>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-lg font-medium text-gray-900 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Package className="h-5 w-5" />
                    <span>List My Item</span>
                  </>
                )}
              </button>
              <Link
                to="/products"
                className="flex-1 sm:flex-none border border-gray-300 text-gray-700 hover:bg-gray-50 py-4 px-6 rounded-lg font-medium text-center transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-8 bg-green-50 rounded-lg p-6">
          <h3 className="font-semibold text-green-900 mb-3">💡 Tips for a successful listing</h3>
          <ul className="text-green-800 space-y-1">
            <li>• Take clear, well-lit photos from multiple angles</li>
            <li>• Write detailed, honest descriptions</li>
            <li>• Research similar items to price competitively</li>
            <li>• Respond quickly to buyer messages</li>
            <li>• Be transparent about any flaws or wear</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SellPage;
