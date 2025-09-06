// HACKATHON MOD: Complete Product Create functionality implementation
// - Full form with image upload, validation, and preview
// - Client-side validation with inline errors and disabled submit
// - Image handling with fallback to placeholder
// - Auto-slug generation and preview features

import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Upload, X, Eye, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { CATEGORIES, CONDITIONS, MAX_IMAGES, MAX_FILE_SIZE } from '../constants/categories';
import { productsApi } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  // Form state
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

  // UI state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imageFiles, setImageFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [slugPreview, setSlugPreview] = useState('');

  // HACKATHON MOD: Debounced search/slug generation
  const generateSlug = (title) => {
    if (!title) return '';
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 50);
  };

  // Validation functions
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        if (!value.trim()) return 'Title is required';
        if (value.length < 3) return 'Title must be at least 3 characters';
        if (value.length > 255) return 'Title must be less than 255 characters';
        return '';
      case 'category':
        if (!value) return 'Category is required';
        return '';
      case 'description':
        if (value.length > 2000) return 'Description must be less than 2000 characters';
        return '';
      case 'price':
        if (!value) return 'Price is required';
        const price = parseFloat(value);
        if (isNaN(price) || price <= 0) return 'Price must be greater than 0';
        if (price > 999999.99) return 'Price cannot exceed 999,999.99';
        return '';
      case 'originalPrice':
        if (value) {
          const originalPrice = parseFloat(value);
          const currentPrice = parseFloat(formData.price);
          if (isNaN(originalPrice) || originalPrice <= 0) return 'Original price must be greater than 0';
          if (currentPrice && originalPrice < currentPrice) return 'Original price should be higher than current price';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'images') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Check if at least one image or allow placeholder
    if (imageFiles.length === 0) {
      // Allow creation without images, will use placeholder
      console.log('No images provided, will use placeholder');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.category && 
           formData.price && 
           parseFloat(formData.price) > 0 &&
           Object.keys(errors).length === 0;
  };

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validate field in real-time
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }

    // Generate slug preview for title
    if (name === 'title') {
      setSlugPreview(generateSlug(value));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length > MAX_IMAGES) {
      setErrors(prev => ({ ...prev, images: `Maximum ${MAX_IMAGES} images allowed` }));
      return;
    }

    // Validate file types and sizes
    const validFiles = [];
    const invalidFiles = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} is not an image`);
      } else if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(`${file.name} is too large (max 5MB)`);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      setErrors(prev => ({ ...prev, images: invalidFiles.join(', ') }));
      return;
    }

    // Clear image errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.images;
      return newErrors;
    });

    // Create image previews
    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setImageFiles(prev => [...prev, ...newImages].slice(0, MAX_IMAGES));
  };

  const removeImage = (index) => {
    setImageFiles(prev => {
      const updated = prev.filter((_, i) => i !== index);
      // Revoke object URL to prevent memory leaks
      URL.revokeObjectURL(prev[index].preview);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || !isFormValid()) {
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Prepare FormData for upload
      const submitData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        if (key !== 'images' && formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      // Add image files
      imageFiles.forEach((image, index) => {
        submitData.append('images', image.file);
      });

      // If no images, the backend will use placeholder
      if (imageFiles.length === 0) {
        console.log('Creating product with placeholder image');
      }

      // Submit with progress tracking
      const response = await productsApi.createProductWithProgress(
        submitData, 
        setUploadProgress
      );

      console.log('Product created successfully:', response);
      
      // Navigate to product detail or listings
      if (response.data?.product?.id) {
        navigate(`/products/${response.data.product.id}`);
      } else {
        navigate('/dashboard'); // or wherever "My Listings" is
      }

    } catch (error) {
      console.error('Failed to create product:', error);
      setErrors({ submit: error.message || 'Failed to create product. Please try again.' });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Preview component
  const ProductPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="aspect-square">
        <img
          src={imageFiles.length > 0 ? imageFiles[0].preview : '/placeholder-image.svg'}
          alt={formData.title || 'Product preview'}
          className="w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2">
          {formData.title || 'Product Title'}
        </h3>
        <p className="text-xl font-bold text-green-600 mb-1">
          ${formData.price || '0.00'}
        </p>
        {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price || 0) && (
          <p className="text-sm text-gray-500 mb-2">
            <span className="line-through">${formData.originalPrice}</span>
            <span className="ml-2 text-red-500">
              {Math.round(((formData.originalPrice - (formData.price || 0)) / formData.originalPrice) * 100)}% off
            </span>
          </p>
        )}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span className="capitalize">{formData.condition.replace('_', ' ')}</span>
          <span>{formData.location || 'Location'}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/products" 
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Product Listing</h1>
          <p className="text-gray-600">Give your item a second life and help build a sustainable future</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Images Upload */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    Photos <span className="text-red-500">*</span>
                    <span className="text-sm font-normal text-gray-500 ml-2">(Optional - placeholder will be used if none provided)</span>
                  </label>
                  
                  {/* Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="mb-4">
                      <span className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors">
                        Upload Photos
                      </span>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-gray-500 text-sm">
                      Add up to {MAX_IMAGES} photos. First photo will be your cover image.
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      Max file size: 5MB per image
                    </p>
                  </div>

                  {/* Image Previews */}
                  {imageFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      {imageFiles.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Cover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {errors.images && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.images}
                    </p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-lg font-medium text-gray-900 mb-2">
                    Product Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="What are you selling?"
                    aria-describedby={errors.title ? 'title-error' : 'title-help'}
                  />
                  {errors.title ? (
                    <p id="title-error" className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </p>
                  ) : (
                    <p id="title-help" className="text-gray-500 text-sm mt-1">
                      Be specific and include key details like brand, model, size, etc.
                    </p>
                  )}
                  
                  {/* Slug Preview */}
                  {slugPreview && (
                    <div className="mt-2 text-xs text-gray-500">
                      URL: /products/{slugPreview}
                    </div>
                  )}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                    aria-describedby={errors.category ? 'category-error' : undefined}
                  >
                    <option value="">Select a category</option>
                    {CATEGORIES.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p id="category-error" className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-lg font-medium text-gray-900 mb-4">
                    Condition <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    {CONDITIONS.map(condition => (
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
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      errors.description ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Describe your item in detail. Include any flaws, special features, or additional items included..."
                    aria-describedby={errors.description ? 'description-error' : 'description-help'}
                  />
                  {errors.description ? (
                    <p id="description-error" className="mt-2 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.description}
                    </p>
                  ) : (
                    <p id="description-help" className="text-gray-500 text-sm mt-1">
                      {formData.description.length}/2000 characters
                    </p>
                  )}
                </div>

                {/* Price Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Price */}
                  <div>
                    <label htmlFor="price" className="block text-lg font-medium text-gray-900 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-500">$</span>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                        required
                        value={formData.price}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.price ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        aria-describedby={errors.price ? 'price-error' : undefined}
                      />
                    </div>
                    {errors.price && (
                      <p id="price-error" className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.price}
                      </p>
                    )}
                  </div>

                  {/* Original Price */}
                  <div>
                    <label htmlFor="originalPrice" className="block text-lg font-medium text-gray-900 mb-2">
                      Original Price <span className="text-sm font-normal text-gray-500">(optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-gray-500">$</span>
                      <input
                        id="originalPrice"
                        name="originalPrice"
                        type="number"
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                        value={formData.originalPrice}
                        onChange={handleInputChange}
                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.originalPrice ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="0.00"
                        aria-describedby={errors.originalPrice ? 'originalPrice-error' : 'originalPrice-help'}
                      />
                    </div>
                    {errors.originalPrice ? (
                      <p id="originalPrice-error" className="mt-2 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.originalPrice}
                      </p>
                    ) : (
                      <p id="originalPrice-help" className="text-gray-500 text-sm mt-1">
                        Show the savings with a strikethrough price
                      </p>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label htmlFor="location" className="block text-lg font-medium text-gray-900 mb-2">
                    Location
                  </label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="City, State"
                  />
                </div>

                {/* Upload Progress */}
                {loading && uploadProgress > 0 && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <span className="text-blue-800 font-medium">Uploading... {Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <p className="text-red-800 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {errors.submit}
                    </p>
                  </div>
                )}

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    type="submit"
                    disabled={loading || !isFormValid()}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Creating Listing...</span>
                      </>
                    ) : (
                      <>
                        <Package className="h-5 w-5" />
                        <span>Create Listing</span>
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
          </div>

          {/* Sidebar - Preview */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Preview</h3>
                  <button
                    type="button"
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
                
                {showPreview && <ProductPreview />}
                
                {!showPreview && (
                  <div className="text-center py-8 text-gray-500">
                    <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Click to preview your listing</p>
                  </div>
                )}
              </div>

              {/* Tips */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="font-semibold text-green-900 mb-3">💡 Tips for a successful listing</h3>
                <ul className="text-green-800 space-y-1 text-sm">
                  <li>• Take clear, well-lit photos from multiple angles</li>
                  <li>• Write detailed, honest descriptions</li>
                  <li>• Research similar items to price competitively</li>
                  <li>• Be transparent about any flaws or wear</li>
                  <li>• Use placeholder if no photos available initially</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
