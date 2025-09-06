/**
 * Order Model
 * Complete order management system
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  order_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  buyer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  status: {
    type: DataTypes.ENUM(
      'pending', 
      'confirmed', 
      'processing', 
      'shipped', 
      'delivered', 
      'cancelled', 
      'refunded'
    ),
    defaultValue: 'pending',
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: {
        args: 0,
        msg: 'Total amount cannot be negative'
      }
    }
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  tax_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  shipping_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  discount_amount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0,
    allowNull: false
  },
  shipping_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  billing_address: {
    type: DataTypes.JSON,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'card', 'bank_transfer', 'digital_wallet'),
    allowNull: true
  },
  payment_status: {
    type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
    defaultValue: 'pending',
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  shipped_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  delivered_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tracking_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['order_number']
    },
    {
      fields: ['buyer_id']
    },
    {
      fields: ['status']
    },
    {
      fields: ['payment_status']
    },
    {
      fields: ['created_at']
    }
  ],
  hooks: {
    beforeCreate: (order) => {
      if (!order.order_number) {
        order.order_number = 'ECO' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
      }
    }
  }
});

// Instance methods
Order.prototype.canBeCancelled = function() {
  return ['pending', 'confirmed'].includes(this.status);
};

Order.prototype.isCompleted = function() {
  return this.status === 'delivered';
};

Order.prototype.updateStatus = async function(newStatus, notes = null) {
  const validTransitions = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: ['refunded'],
    cancelled: [],
    refunded: []
  };

  if (!validTransitions[this.status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.status} to ${newStatus}`);
  }

  this.status = newStatus;
  if (notes) this.notes = notes;
  
  if (newStatus === 'shipped') this.shipped_at = new Date();
  if (newStatus === 'delivered') this.delivered_at = new Date();

  await this.save();
  return this;
};

// Class methods
Order.findByUser = function(userId, options = {}) {
  return this.findAll({
    where: { buyer_id: userId },
    order: [['created_at', 'DESC']],
    ...options
  });
};

Order.findByStatus = function(status, options = {}) {
  return this.findAll({
    where: { status },
    order: [['created_at', 'DESC']],
    ...options
  });
};

module.exports = Order;
