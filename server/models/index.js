/**
 * Model Associations
 * Define relationships between all models
 */

const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// User -> Product (One to Many)
User.hasMany(Product, {
  foreignKey: 'seller_id',
  as: 'products',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Product.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// User -> Cart (One to Many)
User.hasMany(Cart, {
  foreignKey: 'user_id',
  as: 'cartItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Product -> Cart (One to Many)
Product.hasMany(Cart, {
  foreignKey: 'product_id',
  as: 'cartItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Cart.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// User -> Order (One to Many)
User.hasMany(Order, {
  foreignKey: 'user_id',
  as: 'orders',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Order.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Order -> OrderItem (One to Many)
Order.hasMany(OrderItem, {
  foreignKey: 'order_id',
  as: 'items',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Order, {
  foreignKey: 'order_id',
  as: 'order',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// Product -> OrderItem (One to Many)
Product.hasMany(OrderItem, {
  foreignKey: 'product_id',
  as: 'orderItems',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(Product, {
  foreignKey: 'product_id',
  as: 'product',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

// User -> OrderItem (One to Many) - for seller relationship
User.hasMany(OrderItem, {
  foreignKey: 'seller_id',
  as: 'sales',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

OrderItem.belongsTo(User, {
  foreignKey: 'seller_id',
  as: 'seller',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = {
  User,
  Product,
  Cart,
  Order,
  OrderItem
};
