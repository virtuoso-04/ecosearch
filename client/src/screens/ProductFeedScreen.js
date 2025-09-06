import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useProducts, useProductSearch } from '../hooks';
import { Button, Input, Select, LoadingScreen, ErrorMessage, EmptyState } from '../components/ui';
import ProductCard from '../components/ProductCard';
import apiService from '../services/apiService';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Furniture', 'Sports', 'Books', 'Other'];

function ProductFeedScreen() {
  const { user } = useAuth();
  const { data: products, loading, error, refetch } = useProducts();
  const {
    searchTerm,
    setSearchTerm,
    categoryFilter,
    setCategoryFilter,
    filteredProducts
  } = useProductSearch(products || []);

  const handleAddToCart = async (productId) => {
    try {
      await apiService.addToCart(productId);
      // Could add toast notification here
      alert('Added to cart successfully!');
    } catch (error) {
      alert('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return <LoadingScreen message="Loading marketplace..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-4">
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-1">
            Discover sustainable products from our community
          </p>
        </div>
        <Link to="/add-product">
          <Button variant="primary" size="lg">
            + Sell Something
          </Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
            >
              {CATEGORIES.map(category => (
                <option key={category} value={category === 'All' ? '' : category}>
                  {category}
                </option>
              ))}
            </Select>
          </div>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          {searchTerm && ` for "${searchTerm}"`}
          {categoryFilter && ` in ${categoryFilter}`}
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <EmptyState
          icon="🔍"
          title="No products found"
          description="Try adjusting your search criteria or explore different categories."
          action={
            <Link to="/add-product">
              <Button variant="primary">
                Be the first to sell in this category
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              isOwner={product.ownerId === user?.id}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductFeedScreen;
