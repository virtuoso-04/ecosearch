# HACKATHON MOD: Complete Product Listing Creation - API Testing & Demo Guide

## Quick Setup & Run Commands

### Environment Setup
```bash
# Server environment (if .env needed)
cd server
cp .env.example .env  # if exists, or create with:
# NODE_ENV=development
# JWT_SECRET=your-super-secret-jwt-key-change-in-production
# PORT=3001
```

### Start Servers
```bash
# Start both servers (from project root)
npm run dev

# OR start individually:
# Frontend (port 5173/5174)
cd client && npm run dev

# Backend (port 3001)  
cd server && npm run dev
```

## API Testing Commands

### Health Check
```bash
curl -X GET http://localhost:3001/health
```

### Product Creation (JSON fallback - no auth for demo)
```bash
# Create product with JSON (will use placeholder image)
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer demo-token" \
  -d '{
    "title": "Vintage Camera - Canon AE-1",
    "description": "Beautiful vintage 35mm film camera in excellent working condition. Comes with original leather case and manual.",
    "price": 299.99,
    "originalPrice": 450.00,
    "category": "electronics",
    "condition": "good",
    "location": "San Francisco, CA"
  }'
```

### Product Creation (Multipart with images)
```bash
# Create product with image upload
curl -X POST http://localhost:3001/api/products \
  -H "Authorization: Bearer demo-token" \
  -F "title=Sustainable Wooden Desk" \
  -F "description=Handcrafted wooden desk made from reclaimed materials. Perfect for home office." \
  -F "price=450.00" \
  -F "originalPrice=600.00" \
  -F "category=furniture" \
  -F "condition=like_new" \
  -F "location=Portland, OR" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Get All Products
```bash
# List all products
curl -X GET http://localhost:3001/api/products

# With filters
curl -X GET "http://localhost:3001/api/products?category=electronics&condition=good&minPrice=100&maxPrice=500"

# With search
curl -X GET "http://localhost:3001/api/products?search=camera&sortBy=price&sortOrder=ASC"
```

### Get Single Product
```bash
curl -X GET http://localhost:3001/api/products/{product-id}
```

### Update Product (requires auth)
```bash
curl -X PUT http://localhost:3001/api/products/{product-id} \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "title": "Updated Product Title",
    "price": 199.99,
    "status": "active"
  }'
```

### Delete Product (requires auth)
```bash
curl -X DELETE http://localhost:3001/api/products/{product-id} \
  -H "Authorization: Bearer your-jwt-token"
```

### Mark Product as Sold
```bash
curl -X POST http://localhost:3001/api/products/{product-id}/mark-sold \
  -H "Authorization: Bearer your-jwt-token"
```

## Frontend Demo URLs

- **Homepage**: http://localhost:5173/
- **Browse Products**: http://localhost:5173/products  
- **Create Product**: http://localhost:5173/create-product
- **My Listings**: http://localhost:5173/my-listings
- **Dashboard**: http://localhost:5173/dashboard

## Manual Test Checklist

### ✅ Product Creation Flow
- [ ] Navigate to `/create-product`
- [ ] Fill in required fields (title, category, price)
- [ ] Test validation (empty title, invalid price, etc.)
- [ ] Upload 1-5 images (test file size/type validation)  
- [ ] Create product without images (should use placeholder)
- [ ] Verify form disables submit until valid
- [ ] Check success redirect after creation

### ✅ Image Handling
- [ ] Upload multiple images (up to 5)
- [ ] Test file size limit (5MB per image)
- [ ] Test invalid file types (should reject non-images)
- [ ] Verify image preview thumbnails
- [ ] Test remove image functionality
- [ ] Create listing without images (placeholder fallback)

### ✅ Product Listing & Search
- [ ] View products on `/products` page
- [ ] Test search with debouncing (300ms delay)
- [ ] Filter by category and condition
- [ ] Test price range filtering  
- [ ] Verify sorting options work
- [ ] Check pagination (if implemented)

### ✅ My Listings Management
- [ ] Navigate to `/my-listings`
- [ ] View personal product listings
- [ ] Test edit product functionality
- [ ] Test delete with confirmation
- [ ] Test mark as sold
- [ ] Verify ownership checks (with/without auth)

### ✅ Error Handling
- [ ] Test network failures gracefully
- [ ] Verify form validation errors display
- [ ] Check upload progress indicator
- [ ] Test image fallback to placeholder
- [ ] Verify auth error messages

### ✅ UI/UX Features  
- [ ] Responsive design on mobile/desktop
- [ ] Auto-generated slug preview
- [ ] Product preview card
- [ ] Upload progress indicator
- [ ] Debounced search input
- [ ] Accessible form labels and errors

## Quick Demo Script (5 minutes)

1. **Show Product Creation** (2 min)
   - Navigate to `/create-product`
   - Fill form with sample data
   - Upload 2-3 images
   - Show validation working
   - Create product successfully

2. **Show Listing Integration** (1 min)  
   - Navigate to `/products`
   - Show new product appears
   - Test search/filter functionality
   - Demonstrate debounced search

3. **Show Management Features** (2 min)
   - Go to `/my-listings` 
   - Show edit/delete buttons
   - Mark item as sold
   - Show ownership controls

## Technical Implementation Notes

### HACKATHON MOD Features Completed:
- ✅ Complete product create form with validation
- ✅ Image upload with multer (multipart/form-data)
- ✅ Placeholder image fallback system
- ✅ Client-side form validation & UX
- ✅ Debounced search (300ms)
- ✅ Auto-slug generation preview
- ✅ Upload progress tracking
- ✅ Edit/Delete with ownership checks
- ✅ Category/condition constants
- ✅ Responsive design with Tailwind
- ✅ Error handling & accessibility

### TODO (Post-Hackathon):
- 🔲 Complete authentication system integration
- 🔲 Implement proper JWT token management  
- 🔲 Add user registration/login flow
- 🔲 Enhanced image optimization (Sharp)
- 🔲 Real-time notifications
- 🔲 Advanced search/filtering
- 🔲 Product analytics & insights

## File Changes Summary

### Modified Files:
- `client/src/pages/CreateProductPage.jsx` - Complete create form
- `client/src/pages/Products.jsx` - Enhanced with debounced search
- `client/src/pages/ProductsPage.jsx` - Updated product display  
- `client/src/pages/MyListingsPage.jsx` - Management interface
- `client/src/utils/api.js` - FormData & progress support
- `client/src/constants/categories.js` - Shared constants
- `client/src/components/Navbar.jsx` - Navigation updates
- `client/src/App.jsx` - Routes & AuthProvider
- `server/routes/products.js` - Multer integration
- `server/middleware/upload.js` - Image upload config
- `server/middleware/auth.js` - Enhanced auth handling

All changes marked with `// HACKATHON MOD:` comments for easy identification.
