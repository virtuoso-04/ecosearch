/**
 * Model Relationships
 * Defines all associations between models
 */

// Import sequelize instance
const { sequelize } = require('../config/database');

// Import models
const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// For now, export models without associations to test basic functionality
module.exports = {
  sequelize,
  User,
  Product,
  Cart,
  Order,
  OrderItem
};
