/**
 * Cart Service
 * Local storage cart management for demo purposes
 * In production, this would be replaced with API calls
 */

const CART_STORAGE_KEY = 'ecofinds_cart';

// Get cart from localStorage
const getCart = () => {
  try {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    return cartData ? JSON.parse(cartData) : [];
  } catch (error) {
    console.error('Error getting cart from localStorage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

// Add item to cart
const addItem = (product, quantity = 1) => {
  const cart = getCart();
  
  // Check if item already exists
  const existingItemIndex = cart.findIndex(item => item.id === product.id);
  
  if (existingItemIndex >= 0) {
    // Update quantity
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
      image: product.image_url,
      seller: product.seller?.name || 'Unknown Seller',
      condition: product.condition,
      productId: product.id
    });
  }
  
  saveCart(cart);
  return cart;
};

// Update item quantity
const updateQuantity = (productId, newQuantity) => {
  const cart = getCart();
  
  if (newQuantity <= 0) {
    return removeItem(productId);
  }
  
  const updatedCart = cart.map(item => 
    item.id === productId ? { ...item, quantity: newQuantity } : item
  );
  
  saveCart(updatedCart);
  return updatedCart;
};

// Remove item from cart
const removeItem = (productId) => {
  const cart = getCart();
  const updatedCart = cart.filter(item => item.id !== productId);
  
  saveCart(updatedCart);
  return updatedCart;
};

// Clear cart
const clearCart = () => {
  saveCart([]);
  return [];
};

// Get cart summary
const getCartSummary = () => {
  const cart = getCart();
  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  return {
    itemCount,
    subtotal,
    shipping: itemCount > 0 ? 9.99 : 0,
    total: subtotal + (itemCount > 0 ? 9.99 : 0)
  };
};

export default {
  getCart,
  addItem,
  updateQuantity,
  removeItem,
  clearCart,
  getCartSummary
};
