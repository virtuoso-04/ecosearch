const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'sqlite',
  logging: false,
});

module.exports = sequelize;
