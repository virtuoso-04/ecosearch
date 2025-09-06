const bcrypt = require('bcryptjs');
const sequelize = require('../sequelize');
const User = require('../models/User');
const Product = require('../models/Product');

async function seed() {
  try {
    // Force sync database (this will drop and recreate tables)
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const demoUser = await User.create({
      email: 'demo@ecofinds.com',
      password: hashedPassword,
      name: 'Demo User',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    });

    // Create demo products
    const products = [
      {
        title: 'Vintage Leather Jacket',
        description: 'Genuine leather jacket in excellent condition. Perfect for sustainable fashion.',
        category: 'Clothing',
        price: 89.99,
        imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        ownerId: demoUser.id
      },
      {
        title: 'iPhone 12 - Like New',
        description: 'Barely used iPhone 12 with original box and accessories.',
        category: 'Electronics',
        price: 399.99,
        imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        ownerId: demoUser.id
      },
      {
        title: 'Wooden Coffee Table',
        description: 'Handcrafted wooden coffee table. Solid oak construction.',
        category: 'Furniture',
        price: 150.00,
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        ownerId: demoUser.id
      },
      {
        title: 'Road Bike - Specialized',
        description: 'Well-maintained road bike, perfect for commuting or weekend rides.',
        category: 'Sports',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop',
        ownerId: demoUser.id
      },
      {
        title: 'Vintage Camera Collection',
        description: 'Collection of vintage cameras for photography enthusiasts.',
        category: 'Electronics',
        price: 125.00,
        imageUrl: 'https://images.unsplash.com/photo-1606983340077-4a6ca7c2ecaa?w=400&h=400&fit=crop',
        ownerId: demoUser.id
      }
    ];

    await Product.bulkCreate(products);
    console.log('Demo data created successfully');
    console.log('Demo user: demo@ecofinds.com / demo123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seed();
