#!/bin/bash
echo "🚀 Starting EcoFinds MVP Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

echo "🌱 Setting up environment..."
cd ../server

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "JWT_SECRET=ecofinds_super_secret_key_$(date +%s)" > .env
    echo "DATABASE_URL=sqlite://db.sqlite" >> .env
    echo "PORT=5000" >> .env
    echo "📝 Created .env file"
fi

echo "🎯 Seeding database with demo data..."
node scripts/seed.js

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the application:"
echo "   Terminal 1: cd server && npm start"
echo "   Terminal 2: cd client && npm run dev"
echo ""
echo "📖 Demo credentials:"
echo "   Email: demo@ecofinds.com"
echo "   Password: demo123"
