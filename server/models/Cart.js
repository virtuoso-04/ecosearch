/**
 * Cart Model
 * Enhanced shopping cart with business logic
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  product_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: {
        args: 1,
        msg: 'Quantity must be at least 1'
      },
      max: {
        args: 99,
        msg: 'Quantity cannot exceed 99'
      }
    }
  },
  price_at_time: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price when item was added to cart'
  },
  notes: {
    type: DataTypes.TEXT(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Notes cannot exceed 500 characters'
      }
    }
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'product_id'],
      name: 'unique_user_product_cart'
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['created_at']
    }
  ]
});

// Instance methods
Cart.prototype.getTotalPrice = function() {
  return parseFloat(this.price_at_time) * this.quantity;
};

Cart.prototype.updateQuantity = async function(newQuantity) {
  this.quantity = newQuantity;
  await this.save();
  return this;
};

// Class methods
Cart.findByUser = function(userId, options = {}) {
  return this.findAll({
    where: { user_id: userId },
    order: [['created_at', 'DESC']],
    ...options
  });
};

Cart.getUserCartTotal = async function(userId) {
  const cartItems = await this.findByUser(userId);
  return cartItems.reduce((total, item) => total + item.getTotalPrice(), 0);
};

Cart.clearUserCart = async function(userId) {
  return this.destroy({
    where: { user_id: userId }
  });
};

module.exports = Cart;
