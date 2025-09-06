import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { useApi } from '../hooks';
import { Button, Card, ErrorMessage, LoadingScreen, EmptyState } from '../components/ui';
import apiService from '../services/apiService';

function CartScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [processing, setProcessing] = useState(false);
  
  const { 
    loading, 
    error, 
    execute: loadCart 
  } = useApi(apiService.getCart);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = async () => {
    try {
      const data = await loadCart();
      setCartItems(data || []);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  };

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity <= 0) {
      handleRemoveItem(itemId);
      return;
    }

    try {
      await apiService.updateCartItem(itemId, quantity);
      setCartItems(cartItems.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    } catch (err) {
      alert('Failed to update quantity: ' + err.message);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      await apiService.removeFromCart(itemId);
      setCartItems(cartItems.filter(item => item.id !== itemId));
    } catch (err) {
      alert('Failed to remove item: ' + err.message);
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    try {
      setProcessing(true);
      await apiService.checkout();
      setCartItems([]);
      alert('Purchase successful! Check your purchase history.');
      navigate('/purchases');
    } catch (err) {
      alert('Checkout failed: ' + err.message);
    } finally {
      setProcessing(false);
    }
  };

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (loading) {
    return <LoadingScreen message="Loading your cart..." />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorMessage 
          message={error} 
          onRetry={loadCartData} 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Button 
          variant="secondary"
          onClick={() => navigate('/products')}
        >
          Continue Shopping
        </Button>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add some products to your cart to get started!"
          actionLabel="Browse Products"
          onAction={() => navigate('/products')}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <Card key={item.id} className="p-4">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                    <h3 className="font-semibold text-lg mb-1">
                      {item.product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Sold by {item.product.seller.name}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-green-600">
                        ${item.product.price}
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Quantity Controls */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleRemoveItem(item.id)}
                          className="ml-4"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={processing || cartItems.length === 0}
                loading={processing}
                className="w-full"
                size="lg"
              >
                Proceed to Checkout
              </Button>

              <div className="text-xs text-gray-500 mt-2 text-center">
                Secure checkout powered by EcoFinds
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartScreen;
