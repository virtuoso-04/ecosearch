import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useApi } from '../hooks';
import { Button, Card, ErrorMessage, LoadingScreen, EmptyState, Badge } from '../components/ui';
import apiService from '../services/apiService';

function PreviousPurchasesScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  
  const { 
    loading, 
    error, 
    execute: loadPurchases 
  } = useApi(apiService.getPurchases);

  useEffect(() => {
    loadPurchaseData();
  }, []);

  const loadPurchaseData = async () => {
    try {
      const data = await loadPurchases();
      setPurchases(data || []);
    } catch (err) {
      console.error('Failed to load purchases:', err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalSpent = purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0);

  if (loading) {
    return <LoadingScreen message="Loading purchase history..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={error} 
          onRetry={loadPurchaseData} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Purchase History</h1>
        <Button 
          variant="secondary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>

      {/* Summary Stats */}
      {purchases.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {purchases.length}
            </div>
            <div className="text-gray-600">Total Orders</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              ${totalSpent.toFixed(2)}
            </div>
            <div className="text-gray-600">Total Spent</div>
          </Card>
          
          <Card className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {purchases.reduce((sum, p) => sum + p.items.length, 0)}
            </div>
            <div className="text-gray-600">Items Purchased</div>
          </Card>
        </div>
      )}

      {purchases.length === 0 ? (
        <EmptyState
          title="No purchases yet"
          description="Start shopping to see your purchase history here!"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="space-y-4">
          {purchases.map(purchase => (
            <Card key={purchase.id} className="p-6">
              {/* Purchase Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">
                    Order #{purchase.id}
                  </h3>
                  <p className="text-gray-600">
                    Purchased on {formatDate(purchase.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-green-600">
                    ${purchase.totalAmount.toFixed(2)}
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              </div>

              {/* Purchase Items */}
              <div className="space-y-3">
                {purchase.items.map(item => (
                  <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img 
                          src={item.product.imageUrl} 
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          📦
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{item.product.title}</h4>
                      <p className="text-gray-600 text-sm mb-1">
                        Sold by {item.product.seller.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </span>
                        <span className="font-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => navigate(`/product/${item.product.id}`)}
                      >
                        View Product
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PreviousPurchasesScreen;
