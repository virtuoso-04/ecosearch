/**
 * ProductCard Component - Reusable product display card
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Card } from './ui';

function ProductCard({ 
  product, 
  onAddToCart, 
  onEdit, 
  onDelete, 
  showActions = true,
  isOwner = false 
}) {
  const handleAddToCart = async () => {
    if (onAddToCart) {
      try {
        await onAddToCart(product.id);
      } catch (error) {
        console.error('Failed to add to cart:', error);
      }
    }
  };

  return (
    <Card className="p-6 hover:shadow-xl transition-shadow">
      {/* Product Image */}
      <div className="relative mb-4">
        <div 
          className="w-full h-48 bg-gray-200 rounded-lg bg-cover bg-center"
          style={{ 
            backgroundImage: product.imageUrl ? `url(${product.imageUrl})` : 'none'
          }}
        >
          {!product.imageUrl && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
        </div>
        
        {/* Category Badge */}
        {product.category && (
          <span className="absolute top-2 right-2 px-2 py-1 bg-white bg-opacity-90 text-gray-700 rounded-full text-xs font-medium">
            {product.category}
          </span>
        )}
      </div>
      
      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {product.title}
          </h3>
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              {product.description}
            </p>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            ${parseFloat(product.price).toFixed(2)}
          </span>
          {product.createdAt && (
            <span className="text-xs text-gray-500">
              {new Date(product.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {isOwner ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-1"
                  onClick={() => onEdit?.(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  className="flex-1"
                  onClick={() => onDelete?.(product.id)}
                >
                  Delete
                </Button>
              </>
            ) : (
              <>
                <Link
                  to={`/product/${product.id}`}
                  className="flex-1"
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </Link>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}

export default ProductCard;
