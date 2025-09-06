import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useApi } from '../hooks';
import { Button, Card, ErrorMessage, LoadingScreen, Badge } from '../components/ui';
import apiService from '../services/apiService';

function ProductDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  
  const { 
    loading, 
    error, 
    execute: loadProduct 
  } = useApi(apiService.getProduct);

  useEffect(() => {
    if (id) {
      loadProductData();
    }
  }, [id]);

  const loadProductData = async () => {
    try {
      const data = await loadProduct(id);
      setProduct(data);
    } catch (err) {
      console.error('Failed to load product:', err);
    }
  };

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await apiService.addToCart(product.id, 1);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add to cart: ' + err.message);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      await apiService.addToCart(product.id, 1);
      navigate('/cart');
    } catch (err) {
      alert('Failed to add to cart: ' + err.message);
    }
  };

  const isOwnProduct = product && user && product.seller.id === user.id;

  if (loading) {
    return <LoadingScreen message="Loading product details..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={error} 
          onRetry={loadProductData} 
        />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4">
        <ErrorMessage message="Product not found" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Button 
        variant="secondary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        ← Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📦</div>
                <div>No Image Available</div>
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-green-600">
                ${product.price}
              </span>
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
            </div>
          </div>

          {product.description && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* Seller Info */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2">Seller Information</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                {product.seller.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-medium">{product.seller.name}</div>
                <div className="text-sm text-gray-600">{product.seller.email}</div>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          {!isOwnProduct && (
            <div className="space-y-3">
              <Button
                onClick={handleBuyNow}
                className="w-full"
                size="lg"
              >
                Buy Now
              </Button>
              <Button
                variant="secondary"
                onClick={handleAddToCart}
                disabled={addingToCart}
                loading={addingToCart}
                className="w-full"
                size="lg"
              >
                Add to Cart
              </Button>
            </div>
          )}

          {isOwnProduct && (
            <div className="space-y-3">
              <Button
                variant="secondary"
                onClick={() => navigate(`/add-product/${product.id}`)}
                className="w-full"
                size="lg"
              >
                Edit Product
              </Button>
              <div className="text-sm text-gray-600 text-center">
                This is your product
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailScreen;
