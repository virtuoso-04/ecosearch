# 🌱 EcoSearch Marketplace

![Hackathon Ready](https://img.shields.io/badge/hackathon-ready-brightgreen)
![Node.js](https://img.shields.io/badge/backend-Node.js-informational?logo=node.js)
![React](https://img.shields.io/badge/frontend-React-blue?logo=react)
![MySQL](https://img.shields.io/badge/database-MySQL-orange?logo=mysql)
![License: MIT](https://img.shields.io/badge/license-MIT-yellow)

> A professional, full-stack sustainable marketplace application for buying and selling eco-friendly products, featuring a modern React frontend with Vite and a robust Node.js backend with MySQL database.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based login/registration with bcrypt encryption
- 👤 **User Management**: Complete profile system with role-based access
- 📦 **Product Catalog**: Full CRUD operations for eco-friendly product listings
- 🔍 **Advanced Search**: Real-time search with category and price filtering
- 🛒 **Shopping Experience**: Modern cart system with order management
- 💳 **Order Processing**: Complete checkout flow with order tracking
- 🏪 **Vendor System**: Multi-vendor marketplace capabilities
- 📱 **Responsive Design**: Modern UI that works on all devices
- 🌱 **Sustainability Focus**: Emphasis on eco-friendly and sustainable products
- 🚀 **Production Ready**: Comprehensive error handling and security features

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MySQL 8.0+ 
- Git

### Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/virtuoso-04/ecosearch.git
cd ecosearch

# 2. Install all dependencies (both client and server)
npm run install:all

# 3. Configure Environment
# Copy and configure your environment variables
cp server/.env.example server/.env
# Edit server/.env with your MySQL credentials and JWT secret

# 4. Setup Database
# Make sure MySQL is running, then:
cd server
npm run db:setup
# This will create tables and run migrations

# 5. Start the Application
cd ..
npm run dev
# This starts both client (localhost:5173) and server (localhost:3000)
```

### Quick Development Start
```bash
# Install dependencies for both client and server
npm run install:all

# Start both client and server concurrently
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:3000
```

## 🏗️ Architecture

```
Frontend (React + Vite + TailwindCSS)
    ↓ API Calls (Axios)
Backend (Node.js + Express + Sequelize)
    ↓ ORM Queries
Database (MySQL)
```

### System Design
- **Frontend**: Modern React with Vite for fast development and building
- **API Layer**: RESTful API with JWT authentication
- **Database**: MySQL with Sequelize ORM for robust data management
- **Security**: bcrypt password hashing, JWT tokens, CORS protection
- **Development**: Concurrent development with hot reloading

## 📦 Tech Stack

**Frontend:**
- React 18 with modern hooks and functional components
- Vite for lightning-fast development and optimized builds
- TailwindCSS for modern, responsive styling
- React Router for client-side navigation
- Axios for API communication
- Context API for state management

**Backend:**
- Node.js with Express.js framework
- Sequelize ORM with MySQL database
- JWT authentication with bcrypt password hashing
- Express-validator for robust input validation
- CORS and security middleware
- UUID primary keys for enhanced security

**Database:**
- MySQL 8.0+ for production-ready data storage
- Sequelize migrations for version control
- Optimized schema with proper relationships
- Foreign key constraints and data integrity

## 🖥️ API Documentation

### Authentication Endpoints
```
POST /api/auth/register - Register new user
POST /api/auth/login - Login user
POST /api/auth/logout - Logout user
GET  /api/auth/me - Get current user info (auth required)
```

### Product Management
```
GET    /api/products - List all products with filtering
POST   /api/products - Create new product (auth required)
GET    /api/products/:id - Get product details
PUT    /api/products/:id - Update product (auth required)
DELETE /api/products/:id - Delete product (auth required)
GET    /api/products/category/:category - Get products by category
```

### User Management
```
GET /api/users/profile - Get user profile (auth required)
PUT /api/users/profile - Update profile (auth required)
GET /api/users/:id - Get public user info
```

### Order Management
```
GET    /api/orders - List user orders (auth required)
POST   /api/orders - Create new order (auth required)
GET    /api/orders/:id - Get order details (auth required)
PUT    /api/orders/:id/status - Update order status (auth required)
```

### Categories & Search
```
GET /api/categories - List all categories
GET /api/search?q=query&category=cat&minPrice=0&maxPrice=1000 - Search products
```

## 🎨 Design & User Experience

The application features a modern, clean design focused on sustainability:

- **Modern UI**: Clean, professional interface with intuitive navigation
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile
- **Accessibility**: WCAG-compliant design with proper contrast and keyboard navigation
- **Performance**: Optimized images and lazy loading for fast page loads
- **Sustainability Theme**: Green color palette emphasizing eco-friendly messaging

## 🚀 Development Scripts

Available scripts in the root directory:

```bash
# Install dependencies for both client and server
npm run install:all

# Start both client and server in development mode
npm run dev

# Start only the client (React app)
npm run client

# Start only the server (Express API)
npm run server

# Build the client for production
npm run build

# Run client in production mode
npm run preview
```

## 🧪 Testing & Quality

- **Error Handling**: Comprehensive error handling on both frontend and backend
- **Input Validation**: Server-side validation with express-validator
- **Security**: JWT authentication, password hashing, CORS protection
- **Code Quality**: ESLint configuration for consistent code style
- **Database**: Migration system for version-controlled schema changes

## 🌍 Environment Configuration

Create a `.env` file in the `server/` directory:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=ecosearch
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## 🚀 Deployment Ready

### Production Considerations
- **Environment Variables**: Secure configuration management
- **Database**: MySQL ready for cloud deployment (AWS RDS, Google Cloud SQL)
- **Frontend**: Vite builds optimized static assets for CDN deployment
- **Backend**: Express server ready for containerization and cloud hosting
- **Security**: Production-ready security measures implemented

### Deployment Options
- **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
- **Backend**: Heroku, AWS EC2, Google Cloud Run, or DigitalOcean
- **Database**: AWS RDS, Google Cloud SQL, or managed MySQL hosting
- **Full Stack**: Docker containerization ready

## 📁 Project Structure

```
ecosearch/
├── client/                    # React frontend application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── App.jsx          # Main app component
│   ├── package.json
│   └── vite.config.js       # Vite configuration
├── server/                   # Express backend application
│   ├── controllers/         # Route handlers and business logic
│   ├── models/             # Sequelize database models
│   ├── routes/             # API route definitions
│   ├── middleware/         # Custom Express middleware
│   ├── config/             # Database and app configuration
│   ├── migrations/         # Database migration files
│   └── app.js              # Express application setup
├── package.json             # Root package.json with scripts
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🏆 Hackathon Highlights

### Technical Excellence
- **Production-Ready Code**: Clean, well-documented, and scalable architecture
- **Modern Tech Stack**: Latest versions of React, Node.js, and industry best practices
- **Security First**: JWT authentication, input validation, and secure database design
- **Performance Optimized**: Vite for fast builds, efficient API design, and optimized queries

### Features & Functionality
- **Complete Marketplace**: End-to-end buying and selling platform
- **User Management**: Registration, authentication, and profile management
- **Product Catalog**: Advanced search, filtering, and categorization
- **Order System**: Complete shopping cart and checkout functionality
- **Responsive Design**: Works perfectly on all devices

### Sustainability Focus
- **Eco-Friendly Mission**: Platform designed to promote sustainable commerce
- **Reusable Products**: Emphasis on selling and buying eco-friendly items
- **Green UI/UX**: Design elements that reinforce environmental consciousness
- **Community Building**: Features that encourage sustainable practices

### Development Quality
- **Clean Architecture**: Separation of concerns with clear project structure
- **Database Design**: Normalized MySQL schema with proper relationships
- **API Design**: RESTful endpoints with consistent error handling
- **Documentation**: Comprehensive README and inline code documentation

## 🎬 Demo Guide

### Quick Demo Flow
1. **Setup**: `npm run install:all && npm run dev`
2. **Registration**: Create a new user account
3. **Browse Products**: Explore the product catalog with search and filters
4. **Add Products**: Demonstrate creating new product listings
5. **Shopping**: Add items to cart and complete an order
6. **Profile**: Show user profile and order history

### Key Demo Points
- **Fast Setup**: Application runs in under 2 minutes
- **Modern UI**: Clean, professional interface
- **Full Functionality**: Complete marketplace features
- **Responsive**: Works on mobile and desktop
- **Sustainability**: Clear focus on eco-friendly commerce

## 🤝 Contributing

This project is open for contributions! Areas for enhancement:

- Additional payment gateway integrations
- Advanced recommendation algorithms
- Social features (ratings, reviews, seller profiles)
- Mobile app development (React Native)
- Admin dashboard for marketplace management
- Analytics and reporting features

## 📞 Support

For questions or support:
- Check the documentation in this README
- Review API documentation above
- Check the issue tracker for known problems
- Contact the development team

## 📄 License

MIT License - see LICENSE file for details

---

**Built with 💚 for a sustainable future**

*EcoSearch - Making sustainable commerce accessible to everyone*
