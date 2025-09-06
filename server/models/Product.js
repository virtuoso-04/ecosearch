const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const User = require('./User');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, allowNull: false },
  imageUrl: { type: DataTypes.STRING },
});

Product.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });

module.exports = Product;
