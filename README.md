# 🌱 EcoFinds - Sustainable Second-Hand Marketplace

![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)
![React](https://img.shields.io/badge/frontend-React_18-blue?logo=react)
![Node.js](https://img.shields.io/badge/backend-Node.js-informational?logo=node.js)
![SQLite](https://img.shields.io/badge/database-SQLite-orange?logo=sqlite)
![Status](https://img.shields.io/badge/status-ready_for_demo-success)

> **A modern, full-stack sustainable marketplace platform that empowers users to buy and sell pre-loved items, promoting circular economy and environmental consciousness.**

## 📖 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📱 How to Use the App](#-how-to-use-the-app)
- [🏗️ Technical Architecture](#️-technical-architecture)
- [📦 Project Structure](#-project-structure)
- [🔧 API Documentation](#-api-documentation)
- [🎨 UI/UX Design](#-uiux-design)
- [🌍 Environment Setup](#-environment-setup)
- [🚀 Deployment](#-deployment)

---

## ✨ Features

### 🔐 **Authentication & User Management**
- Secure JWT-based login and registration
- User profiles with avatar and bio
- Password encryption with bcrypt
- Session management and logout

### 🛍️ **Marketplace Functionality**
- Browse products with advanced filtering
- Search by keywords, categories, and price ranges
- Grid and list view options
- Product condition ratings (New → Poor)
- Seller ratings and reviews

### 🛒 **Shopping Experience**
- Interactive shopping cart with quantity controls
- Order creation and management
- Purchase history tracking
- Real-time cart updates

### 📦 **Selling Platform**
- Easy product listing creation
- Photo upload with drag-and-drop
- Category selection and condition rating
- Price comparison with original retail value

### 🌱 **Sustainability Focus**
- CO₂ savings calculator
- Environmental impact tracking
- Circular economy messaging
- Waste reduction statistics

### 📱 **Modern UI/UX**
- Fully responsive design (mobile-first)
- Clean, intuitive interface
- Smooth animations and transitions
- Professional component library

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 16+ and npm
- **Git** for version control

### Installation (60 seconds setup!)

```bash
# 1. Clone the repository
git clone https://github.com/virtuoso-04/ecosearch.git
cd ecosearch

# 2. Install all dependencies (both frontend and backend)
npm install

# 3. Start the development servers
npm run dev

# 🎉 Done! The app is running at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:3001
```

### Alternative Setup
```bash
# Install dependencies separately
cd client && npm install
cd ../server && npm install
cd ..

# Start both servers
npm run dev
```

---

## 📱 How to Use the App

### 🏠 **Getting Started**
1. **Open the app** at [http://localhost:5173](http://localhost:5173)
2. **Explore the homepage** to understand the platform's mission
3. **Browse categories** to see different product types

### 👤 **User Account**
1. **Sign Up/Login**
   - Click "Login" in the top-right corner
   - Toggle between "Sign In" and "Create Account"
   - Fill in your details and submit
   - *Note: Currently uses mock authentication*

2. **Profile Management**
   - Navigate to "Profile" in the header
   - View your dashboard with statistics
   - Edit profile information
   - Track your environmental impact

### 🛍️ **Shopping**
1. **Browse Products**
   - Click "Browse" or visit `/products`
   - Use search bar for specific items
   - Apply filters: category, condition, price range
   - Toggle between grid and list views

2. **Product Details**
   - Click on any product card
   - View detailed information
   - Check seller ratings and reviews
   - See environmental savings

3. **Shopping Cart**
   - Click "Add to Cart" on products
   - Access cart via header icon
   - Adjust quantities or remove items
   - View total price and environmental impact
   - Proceed to checkout

### 📦 **Selling Items**
1. **Create Listing**
   - Click "Sell" in the navigation
   - Upload product photos (drag & drop)
   - Fill in title, description, and category
   - Select condition (honest assessment)
   - Set competitive pricing
   - Add location for local pickup

2. **Manage Listings**
   - Go to Dashboard → "My Listings"
   - Edit or deactivate listings
   - View listing statistics and views
   - Track sales performance

### 📊 **Dashboard Features**
1. **Overview Tab**
   - View selling/buying statistics
   - Environmental impact metrics
   - Recent activity feed
   - Quick action buttons

2. **My Listings Tab**
   - Manage all your product listings
   - View performance metrics
   - Edit or remove products
   - Track views and engagement

3. **Purchase History**
   - Review all past purchases
   - Download receipts
   - Contact sellers
   - Leave reviews

4. **Profile Settings**
   - Update personal information
   - Change profile picture
   - Manage account preferences
   - View membership details

### 🔍 **Advanced Features**
- **Smart Search**: Type keywords to find specific items
- **Category Filtering**: Browse by Electronics, Clothing, Furniture, etc.
- **Price Ranges**: Set minimum and maximum price filters
- **Condition Filtering**: Find items in your preferred condition
- **Sorting Options**: Order by newest, price, or popularity

---

## 🏗️ Technical Architecture

### **Frontend Stack**
```
React 18 + Vite + TailwindCSS + React Router
├── Modern component architecture
├── Responsive design system
├── State management with Context API
├── Routing with React Router DOM
└── Icon library (Lucide React)
```

### **Backend Stack**
```
Node.js + Express + Sequelize + SQLite
├── RESTful API architecture
├── JWT authentication
├── Database ORM with Sequelize
├── File upload handling
└── Comprehensive error handling
```

### **Database Schema**
```
Users ←→ Products (One-to-Many)
Users ←→ Cart (One-to-Many)
Users ←→ Orders (One-to-Many)
Orders ←→ OrderItems (One-to-Many)
Products ←→ OrderItems (One-to-Many)
```

### **Development Workflow**
```
Development: Vite Dev Server + Nodemon
Production: Optimized builds + Production server
Database: SQLite for development, PostgreSQL/MySQL for production
```

---

## 📦 Project Structure

```
ecosearch/
├── 📁 client/                    # Frontend React application
│   ├── 📁 public/               # Static assets and favicon
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   └── Navbar.jsx       # Navigation component
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── HomePage.jsx     # Landing page
│   │   │   ├── ProductsPage.jsx # Product catalog
│   │   │   ├── LoginPage.jsx    # Authentication
│   │   │   ├── SellPage.jsx     # Create listings
│   │   │   ├── CartPage.jsx     # Shopping cart
│   │   │   └── DashboardPage.jsx# User dashboard
│   │   ├── 📁 context/         # React context providers
│   │   ├── App.jsx             # Main app with routing
│   │   ├── index.jsx           # React entry point
│   │   └── index.css           # Global styles
│   ├── package.json            # Frontend dependencies
│   ├── vite.config.js          # Vite configuration
│   └── tailwind.config.js      # TailwindCSS config
├── 📁 server/                   # Backend Express application
│   ├── 📁 config/              # Configuration files
│   │   └── database.js         # Database connection
│   ├── 📁 models/              # Sequelize models
│   │   ├── User.js             # User model
│   │   ├── Product.js          # Product model
│   │   ├── Cart.js             # Cart model
│   │   ├── Order.js            # Order model
│   │   └── index.js            # Model associations
│   ├── 📁 routes/              # API route handlers
│   │   ├── auth.js             # Authentication routes
│   │   ├── users.js            # User management
│   │   ├── products.js         # Product CRUD
│   │   ├── cart.js             # Cart operations
│   │   └── orders.js           # Order processing
│   ├── 📁 middleware/          # Express middleware
│   │   └── auth.js             # JWT authentication
│   ├── 📁 migrations/          # Database migrations
│   ├── app.js                  # Express app setup
│   └── package.json            # Backend dependencies
├── package.json                # Root scripts and dependencies
├── README.md                   # This documentation
└── .gitignore                  # Git ignore rules
```

---

## 🔧 API Documentation

### **Authentication Endpoints**
```http
POST /api/auth/register          # Register new user
POST /api/auth/login             # User login
GET  /api/auth/profile           # Get user profile (protected)
PUT  /api/auth/profile           # Update profile (protected)
```

### **Product Management**
```http
GET    /api/products             # List products with filters
POST   /api/products             # Create product (protected)
GET    /api/products/:id         # Get product details
PUT    /api/products/:id         # Update product (protected)
DELETE /api/products/:id         # Delete product (protected)
```

### **Shopping Cart**
```http
GET    /api/cart                 # Get user's cart (protected)
POST   /api/cart/add             # Add item to cart (protected)
PUT    /api/cart/update          # Update item quantity (protected)
DELETE /api/cart/remove/:id      # Remove item from cart (protected)
DELETE /api/cart/clear           # Clear entire cart (protected)
```

### **Order Management**
```http
GET    /api/orders               # Get user orders (protected)
POST   /api/orders/create        # Create order from cart (protected)
GET    /api/orders/:id           # Get order details (protected)
PUT    /api/orders/:id/status    # Update order status (protected)
```

### **User Dashboard**
```http
GET /api/users/dashboard         # Get dashboard stats (protected)
GET /api/users/listings          # Get user's listings (protected)
GET /api/users/sales            # Get sales history (protected)
```

---

## 🎨 UI/UX Design

### **Design System**
- **Color Palette**: Green primary (#059669), supporting grays and blues
- **Typography**: Inter font family with clear hierarchy
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable design tokens and components

### **Responsive Breakpoints**
```css
Mobile:     < 640px   (sm)
Tablet:     640px+    (md)
Desktop:    1024px+   (lg)
Large:      1280px+   (xl)
```

### **Key UI Features**
- **Mobile-First Design**: Optimized for mobile experience
- **Touch-Friendly**: Large tap targets and gesture support
- **Loading States**: Skeleton screens and spinners
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant with proper contrast ratios

---

## 🌍 Environment Setup

### **Development Environment**
Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database (SQLite - no configuration needed)
DB_STORAGE=./database.sqlite

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_for_development_change_in_production
JWT_EXPIRES_IN=7d

# CORS Configuration
CLIENT_URL=http://localhost:5173

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880
```

### **Production Environment**
```env
NODE_ENV=production
PORT=3001
JWT_SECRET=your_very_secure_production_jwt_secret
CLIENT_URL=https://your-production-domain.com
DB_URL=postgresql://user:password@host:5432/ecofinds
```

---

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build the frontend
cd client
npm run build

# Deploy the dist/ folder to your hosting platform
```

### **Backend Deployment (Heroku/Railway)**
```bash
# Prepare for deployment
cd server
npm install --production

# Deploy using your platform's CLI
```

### **Full-Stack Deployment Options**
- **Vercel + PlanetScale**: Frontend on Vercel, database on PlanetScale
- **Netlify + Railway**: Frontend on Netlify, backend on Railway
- **Digital Ocean**: Full-stack deployment on droplets
- **AWS**: EC2 + RDS for production-grade deployment

---

## 🧪 Testing & Scripts

### **Available Scripts**
```bash
# Development
npm run dev              # Start both frontend and backend
npm run dev:client       # Start only frontend (port 5173)
npm run dev:server       # Start only backend (port 3001)

# Production
npm run build           # Build frontend for production
npm run start           # Start production server
npm run preview         # Preview production build

# Utilities
npm run install:all     # Install dependencies for both client/server
npm run clean          # Clean node_modules and build files
```

### **Quality Assurance**
- **Error Handling**: Comprehensive error boundaries and API error handling
- **Input Validation**: Client-side and server-side validation
- **Security**: JWT authentication, password hashing, CORS protection
- **Performance**: Optimized builds, lazy loading, efficient queries

---

## 🏆 Demo Highlights

### **Quick Demo Script**
1. **Setup** (30 seconds): `npm run dev`
2. **Homepage**: Show sustainable marketplace concept
3. **Browse Products**: Demonstrate search and filtering
4. **Product Details**: Show detailed product information
5. **Shopping Cart**: Add items and checkout flow
6. **Sell Item**: Create a new product listing
7. **Dashboard**: User statistics and management

### **Key Selling Points**
- ⚡ **Fast Setup**: Running in under 60 seconds
- 📱 **Mobile Ready**: Perfect mobile experience
- 🎨 **Professional UI**: Modern, clean design
- 🔧 **Full Featured**: Complete marketplace functionality
- 🌱 **Sustainability**: Clear environmental focus
- 🚀 **Production Ready**: Scalable architecture

---

## 🤝 Contributing

### **Development Setup**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### **Code Style**
- Use Prettier for code formatting
- Follow React hooks best practices
- Write meaningful commit messages
- Add comments for complex logic

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/virtuoso-04/ecosearch/issues)
- **Documentation**: This README and inline code comments
- **Demo**: Available at [localhost:5173](http://localhost:5173) after setup

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

<div align="center">

**🌱 Built with 💚 for a sustainable future**

*EcoFinds - Empowering Sustainable Consumption through Second-Hand Commerce*

**Ready for Demo • Production Grade • Fully Responsive**

</div>
