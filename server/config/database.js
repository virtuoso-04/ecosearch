/**
 * Database Configuration
 * Sequelize setup for MySQL/SQLite with environment-based configuration
 */

const { Sequelize } = require('sequelize');
const { DATABASE_URL, NODE_ENV } = require('./config');

let sequelize;

if (DATABASE_URL) {
  // Production database from environment variable
  sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres', // or 'mysql' depending on your production DB
    logging: NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development database (SQLite)
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
}

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

// Initialize database
const initializeDatabase = async () => {
  try {
    await testConnection();
    
    // Create database tables without aggressive altering
    if (NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('✅ Database synchronized successfully.');
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  testConnection,
  initializeDatabase
};
