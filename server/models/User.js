/**
 * User Model
 * Enhanced with validation, hooks, and methods
 */

const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      name: 'email_unique',
      msg: 'Email address already exists'
    },
    validate: {
      isEmail: {
        msg: 'Please provide a valid email address'
      },
      len: {
        args: [3, 255],
        msg: 'Email must be between 3 and 255 characters'
      }
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase().trim());
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6, 255],
        msg: 'Password must be at least 6 characters long'
      }
    }
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [2, 100],
        msg: 'Name must be between 2 and 100 characters'
      },
      notEmpty: {
        msg: 'Name cannot be empty'
      }
    },
    set(value) {
      this.setDataValue('name', value.trim());
    }
  },
  avatar_url: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Avatar URL must be a valid URL'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: true,
    validate: {
      is: {
        args: /^[\+]?[1-9][\d]{0,15}$/,
        msg: 'Please provide a valid phone number'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT(500),
    allowNull: true,
    validate: {
      len: {
        args: [0, 500],
        msg: 'Bio cannot exceed 500 characters'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active',
    allowNull: false
  },
  email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  login_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  }
}, {
  tableName: 'users',
  timestamps: true,
  paranoid: true, // Soft deletes
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance methods
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.toSafeObject = function() {
  const { password, deletedAt, ...safeUser } = this.toJSON();
  return safeUser;
};

User.prototype.updateLoginInfo = async function() {
  this.last_login = new Date();
  this.login_count += 1;
  await this.save();
};

// Class methods
User.findByEmail = function(email) {
  return this.findOne({
    where: { email: email.toLowerCase().trim() }
  });
};

User.findActive = function(options = {}) {
  return this.findAll({
    where: { status: 'active' },
    ...options
  });
};

module.exports = User;
