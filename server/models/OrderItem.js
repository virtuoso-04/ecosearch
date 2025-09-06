/**
 * OrderItem Model
 * Individual items within an order
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  order_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'orders',
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
  seller_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: 1,
        msg: 'Quantity must be at least 1'
      }
    }
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Price per unit at time of purchase'
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Total price for this line item'
  },
  product_snapshot: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Snapshot of product data at time of purchase'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending',
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: true,
  indexes: [
    {
      fields: ['order_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['seller_id']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeCreate: (orderItem) => {
      orderItem.total_price = orderItem.unit_price * orderItem.quantity;
    },
    beforeUpdate: (orderItem) => {
      if (orderItem.changed('quantity') || orderItem.changed('unit_price')) {
        orderItem.total_price = orderItem.unit_price * orderItem.quantity;
      }
    }
  }
});

// Instance methods
OrderItem.prototype.getTotalPrice = function() {
  return parseFloat(this.unit_price) * this.quantity;
};

// Class methods
OrderItem.findByOrder = function(orderId, options = {}) {
  return this.findAll({
    where: { order_id: orderId },
    ...options
  });
};

OrderItem.findBySeller = function(sellerId, options = {}) {
  return this.findAll({
    where: { seller_id: sellerId },
    order: [['created_at', 'DESC']],
    ...options
  });
};

module.exports = OrderItem;
