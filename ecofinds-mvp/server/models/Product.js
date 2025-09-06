/**
 * Product Model
 * Enhanced with validation, search, and business logic
 */

const { DataTypes } = require('sequelize');
const slugify = require('slugify');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [3, 255],
        msg: 'Title must be between 3 and 255 characters'
      },
      notEmpty: {
        msg: 'Title cannot be empty'
      }
    },
    set(value) {
      this.setDataValue('title', value.trim());
    }
  },
  slug: {
    type: DataTypes.STRING(300),
    allowNull: false,
    unique: {
      name: 'slug_unique',
      msg: 'Product slug already exists'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 2000],
        msg: 'Description cannot exceed 2000 characters'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
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
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: {
        args: 0.01,
        msg: 'Original price must be greater than 0'
      }
    }
  },
  category: {
    type: DataTypes.ENUM(
      'electronics', 
      'clothing', 
      'furniture', 
      'sports', 
      'books', 
      'home_garden',
      'automotive',
      'health_beauty',
      'toys_games',
      'other'
    ),
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'Category is required'
      }
    }
  },
  condition: {
    type: DataTypes.ENUM('new', 'like_new', 'good', 'fair', 'poor'),
    defaultValue: 'good',
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'sold', 'reserved', 'inactive'),
    defaultValue: 'active',
    allowNull: false
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Image URL must be a valid URL'
      }
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  location: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true,
    validate: {
      min: -180,
      max: 180
    }
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  view_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  favorite_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
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
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'products',
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      fields: ['seller_id']
    },
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['price']
    },
    {
      fields: ['created_at']
    },
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['featured']
    },
    {
      name: 'location_index',
      fields: ['latitude', 'longitude']
    }
  ],
  hooks: {
    beforeCreate: (product) => {
      product.slug = slugify(product.title, { 
        lower: true, 
        strict: true,
        remove: /[*+~.()'"!:@]/g
      }) + '-' + Date.now();
    },
    beforeUpdate: (product) => {
      if (product.changed('title')) {
        product.slug = slugify(product.title, { 
          lower: true, 
          strict: true,
          remove: /[*+~.()'"!:@]/g
        }) + '-' + Date.now();
      }
    }
  }
});

// Instance methods
Product.prototype.incrementViews = async function() {
  this.view_count += 1;
  await this.save({ fields: ['view_count'] });
};

Product.prototype.markAsSold = async function() {
  this.status = 'sold';
  await this.save();
};

Product.prototype.isAvailable = function() {
  return this.status === 'active' && 
         (!this.expires_at || this.expires_at > new Date());
};

Product.prototype.getDiscountPercentage = function() {
  if (!this.original_price || this.original_price <= this.price) {
    return 0;
  }
  return Math.round(((this.original_price - this.price) / this.original_price) * 100);
};

// Class methods
Product.findAvailable = function(options = {}) {
  return this.findAll({
    where: { 
      status: 'active',
      [sequelize.Op.or]: [
        { expires_at: null },
        { expires_at: { [sequelize.Op.gt]: new Date() } }
      ]
    },
    ...options
  });
};

Product.findByCategory = function(category, options = {}) {
  return this.findAvailable({
    where: { category },
    ...options
  });
};

Product.search = function(query, options = {}) {
  return this.findAvailable({
    where: {
      [sequelize.Op.or]: [
        { title: { [sequelize.Op.like]: `%${query}%` } },
        { description: { [sequelize.Op.like]: `%${query}%` } },
        { tags: { [sequelize.Op.like]: `%${query}%` } }
      ]
    },
    ...options
  });
};

module.exports = Product;
