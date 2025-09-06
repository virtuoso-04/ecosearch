/**
 * Product Model
 * Enhanced product model with comprehensive features
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product name cannot be empty'
      },
      len: {
        args: [3, 255],
        msg: 'Product name must be between 3 and 255 characters'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Product description cannot be empty'
      },
      len: {
        args: [10, 2000],
        msg: 'Description must be between 10 and 2000 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      isDecimal: {
        msg: 'Price must be a valid decimal number'
      },
      min: {
        args: 0.01,
        msg: 'Price must be greater than 0'
      },
      max: {
        args: 999999.99,
        msg: 'Price cannot exceed 999,999.99'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'Electronics',
      'Clothing',
      'Home & Garden',
      'Health & Beauty',
      'Sports & Outdoors',
      'Books & Media',
      'Toys & Games',
      'Automotive',
      'Food & Beverages',
      'Other'
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Category is required'
      }
    }
  },
  condition: {
    type: DataTypes.ENUM('New', 'Like New', 'Good', 'Fair', 'Poor'),
    defaultValue: 'Good',
    allowNull: false
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Image must be a valid URL'
      }
    }
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
  stock_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
    validate: {
      min: {
        args: 0,
        msg: 'Stock quantity cannot be negative'
      }
    }
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  views_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  featured_until: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  indexes: [
    {
      fields: ['seller_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['price']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['created_at']
    },
    {
      fields: ['name'],
      type: 'FULLTEXT'
    },
    {
      fields: ['description'],
      type: 'FULLTEXT'
    }
  ],
  hooks: {
    beforeValidate: (product) => {
      if (product.name) {
        product.name = product.name.trim();
      }
      if (product.description) {
        product.description = product.description.trim();
      }
    }
  }
});

// Instance methods
Product.prototype.incrementViews = async function() {
  this.views_count += 1;
  await this.save();
  return this;
};

Product.prototype.isAvailable = function() {
  return this.is_active && this.stock_quantity > 0;
};

Product.prototype.isFeatured = function() {
  return this.featured_until && new Date() < this.featured_until;
};

// Class methods
Product.findAvailable = function(options = {}) {
  return this.findAll({
    where: {
      is_active: true,
      stock_quantity: { [require('sequelize').Op.gt]: 0 }
    },
    order: [['created_at', 'DESC']],
    ...options
  });
};

Product.findByCategory = function(category, options = {}) {
  return this.findAll({
    where: {
      category,
      is_active: true
    },
    order: [['created_at', 'DESC']],
    ...options
  });
};

Product.findBySeller = function(sellerId, options = {}) {
  return this.findAll({
    where: { seller_id: sellerId },
    order: [['created_at', 'DESC']],
    ...options
  });
};

module.exports = Product;
