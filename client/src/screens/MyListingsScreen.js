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
      setProducts(products.filter((product) => product.id !== productId));
    } catch (err) {
      alert('Failed to delete product. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Listings</h1>
        <Button onClick={() => navigate('/add-product')} className="bg-green-500 text-white">
          Create New Listing
        </Button>
      </div>

      {loading ? (
        <LoadingScreen message="Loading your listings..." />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadUserProducts} />
      ) : products.length === 0 ? (
        <EmptyState message="You have no listings yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="relative">
              <img src={product.imageUrl} alt={product.title} className="w-full h-48 object-cover rounded" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-sm text-gray-800 font-semibold">${product.price}</p>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button
                  onClick={() => navigate(`/edit-product/${product.id}`)}
                  className="bg-blue-500 text-white"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(product.id)}
                  className="bg-red-500 text-white"
                  disabled={deleting === product.id}
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
