import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useApi } from '../hooks';
import { Button, Card, ErrorMessage, LoadingScreen, EmptyState } from '../components/ui';
import apiService from '../services/apiService';

function MyListingsScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [deleting, setDeleting] = useState(null);
  
  const { 
    loading, 
    error, 
    execute: loadProducts 
  } = useApi(apiService.getUserProducts);

  useEffect(() => {
    loadUserProducts();
  }, []);

  const loadUserProducts = async () => {
    try {
      const data = await loadProducts(user.id);
      setProducts(data || []);
    } catch (err) {
      console.error('Failed to load user products:', err);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setDeleting(productId);
      await apiService.deleteProduct(productId);
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      alert('Failed to delete product: ' + err.message);
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (productId) => {
    navigate(`/add-product/${productId}`);
  };

  if (loading) {
    return <LoadingScreen message="Loading your listings..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={error} 
          onRetry={loadUserProducts} 
        />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button onClick={() => navigate('/add-product')}>
          Add New Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          title="No products listed yet"
          description="Start selling by adding your first product!"
          actionLabel="Add Product"
          onAction={() => navigate('/add-product')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <Card key={product.id} className="p-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              
              <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                {product.title}
              </h3>
              
              {product.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-green-600">
                  ${product.price}
                </span>
                {product.category && (
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleEdit(product.id)}
                  className="flex-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  disabled={deleting === product.id}
                  loading={deleting === product.id}
                  className="flex-1"
                >
                  {deleting === product.id ? 'Deleting...' : 'Delete'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyListingsScreen;
