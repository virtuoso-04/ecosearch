import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { useFormValidation } from '../hooks';
import { Button, Input, Select, TextArea, ErrorMessage, LoadingScreen } from '../components/ui';
import apiService from '../services/apiService';

const productValidationRules = {
  title: { required: true, minLength: 3, maxLength: 100 },
  price: { required: true, min: 0.01 },
  category: { required: true },
  description: { maxLength: 500 },
  imageUrl: { pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i }
};

function AddEditProductScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [initialProduct, setInitialProduct] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Electronics', 'Clothing', 'Furniture', 'Sports', 'Books', 'Other'];

  const {
    values,
    errors: validationErrors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setValues,
    validateForm
  } = useFormValidation({
    title: '',
    description: '',
    category: '',
    price: '',
    imageUrl: ''
  }, productValidationRules);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await apiService.getProduct(id);
      
      // Check if user owns this product
      if (product.seller.id !== user.id) {
        setError('You can only edit your own products');
        return;
      }

      setInitialProduct(product);
      setValues({
        title: product.title,
        description: product.description || '',
        category: product.category || '',
        price: product.price.toString(),
        imageUrl: product.imageUrl || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    try {
      setSubmitting(true);
      const productData = {
        title: values.title.trim(),
        description: values.description.trim(),
        category: values.category,
        price: parseFloat(values.price),
        imageUrl: values.imageUrl
      };

      if (id) {
        await apiService.updateProduct(id, productData);
      } else {
        await apiService.createProduct(productData);
      }

      navigate(id ? '/my-listings' : '/products');
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading product..." />;
  }

  if (error && !submitting) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="ios-card p-8">
        <div className="flex items-center mb-6">
          <Button 
            variant="secondary"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            ← Back
          </Button>
          <h2 className="text-2xl font-bold">
            {id ? 'Edit Product' : 'Add New Product'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Title"
            name="title"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.title ? validationErrors.title : ''}
            placeholder="Enter product title"
            required
          />

          <TextArea
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.description ? validationErrors.description : ''}
            placeholder="Describe your product..."
            rows={4}
          />

          <Select
            label="Category"
            name="category"
            value={values.category}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.category ? validationErrors.category : ''}
            required
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            min="0.01"
            value={values.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.price ? validationErrors.price : ''}
            placeholder="0.00"
            required
          />

          <Input
            label="Image URL"
            name="imageUrl"
            type="url"
            value={values.imageUrl}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.imageUrl ? validationErrors.imageUrl : ''}
            placeholder="https://example.com/image.jpg"
          />

          {values.imageUrl && !validationErrors.imageUrl && (
            <div className="mt-4">
              <img
                src={values.imageUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded"
              />
            </div>
          )}

          <Button
            type="submit"
            disabled={submitting || !isValid}
            loading={submitting}
            className="w-full"
          >
            {id ? 'Update Product' : 'Add Product'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default AddEditProductScreen;
