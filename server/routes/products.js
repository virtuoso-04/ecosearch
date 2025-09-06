// HACKATHON MOD: Product routes updated for image upload functionality
// - Added multer middleware for handling multipart/form-data
// - Enhanced product creation with image upload support
// - Fallback to placeholder when no images provided

/**
 * Product Routes
 * CRUD operations and search functionality for products
 */

const express = require('express');
const { Op } = require('sequelize');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { uploadProductImages } = require('../middleware/upload'); // HACKATHON MOD: Added upload middleware
const { Product, User } = require('../models');

const router = express.Router();

/**
 * @route   GET /api/products
 * @desc    Get all products with filters and pagination
 * @access  Public
 */
router.get('/', optionalAuth, async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      condition,
      minPrice,
      maxPrice,
      search,
      location,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      featured
    } = req.query;

    const offset = (page - 1) * limit;
    const where = { status: 'active' };

    // Apply filters
    if (category) where.category = category;
    if (condition) where.condition = condition;
    if (featured !== undefined) where.featured = featured === 'true';

    // Price range filter
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = minPrice;
      if (maxPrice) where.price[Op.lte] = maxPrice;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Location filter (basic text search)
    if (location) {
      where.location = { [Op.like]: `%${location}%` };
    }

    // Expiry filter
    where[Op.or] = [
      { expires_at: null },
      { expires_at: { [Op.gt]: new Date() } }
    ];

    const { count, rows: products } = await Product.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'avatar_url']
      }],
      order: [[sortBy, sortOrder.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/products/:id
 * @desc    Get product by ID
 * @access  Public
 */
router.get('/:id', optionalAuth, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'avatar_url', 'phone', 'email']
      }]
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Increment view count
    await product.incrementViews();

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/products
 * @desc    Create new product
 * @access  Private
 * // HACKATHON MOD: Enhanced with image upload support and validation
 */
router.post('/', authenticate, uploadProductImages, async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      originalPrice,
      category,
      condition,
      location,
      latitude,
      longitude,
      tags,
      expires_at
    } = req.body;

    // HACKATHON MOD: Handle uploaded images
    let images = [];
    let image_url = null;

    if (req.files && req.files.length > 0) {
      // Process uploaded files
      images = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        alt: title || 'Product image',
        filename: file.filename
      }));
      
      // Set first image as main image
      image_url = images[0].url;
    } else {
      // HACKATHON MOD: Use placeholder if no images uploaded
      images = [{
        url: '/placeholder-image.svg',
        alt: 'Product placeholder image'
      }];
      image_url = '/placeholder-image.svg';
    }

    // HACKATHON MOD: Enhanced validation
    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 3 characters long'
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    if (!price || parseFloat(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Price must be greater than 0'
      });
    }

    // Parse arrays from form data
    let parsedTags = [];
    if (tags) {
      try {
        parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags;
      } catch (e) {
        parsedTags = [];
      }
    }

    const product = await Product.create({
      title: title.trim(),
      description: description ? description.trim() : null,
      price: parseFloat(price),
      original_price: originalPrice ? parseFloat(originalPrice) : null,
      category,
      condition: condition || 'good',
      image_url,
      images,
      location: location ? location.trim() : null,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      tags: parsedTags,
      expires_at: expires_at || null,
      seller_id: req.user.id
    });

    // Fetch the product with seller info
    const productWithSeller = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'avatar_url']
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: productWithSeller }
    });
  } catch (error) {
    // HACKATHON MOD: Enhanced error handling for upload errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum 5MB per image.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 images allowed.'
      });
    }
    if (error.message === 'Only image files are allowed') {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed.'
      });
    }
    
    next(error);
  }
});

/**
 * @route   PUT /api/products/:id
 * @desc    Update product
 * @access  Private (Owner only)
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    const {
      title,
      description,
      price,
      original_price,
      category,
      condition,
      image_url,
      images,
      location,
      latitude,
      longitude,
      tags,
      status,
      expires_at
    } = req.body;

    // Update product
    await product.update({
      title: title || product.title,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      original_price: original_price !== undefined ? original_price : product.original_price,
      category: category || product.category,
      condition: condition || product.condition,
      image_url: image_url !== undefined ? image_url : product.image_url,
      images: images !== undefined ? images : product.images,
      location: location !== undefined ? location : product.location,
      latitude: latitude !== undefined ? latitude : product.latitude,
      longitude: longitude !== undefined ? longitude : product.longitude,
      tags: tags !== undefined ? tags : product.tags,
      status: status || product.status,
      expires_at: expires_at !== undefined ? expires_at : product.expires_at
    });

    // Fetch updated product with seller info
    const updatedProduct = await Product.findByPk(product.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'avatar_url']
      }]
    });

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete product
 * @access  Private (Owner only)
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product'
      });
    }

    await product.destroy();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/products/user/:userId
 * @desc    Get products by user
 * @access  Public
 */
router.get('/user/:userId', async (req, res, next) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: products } = await Product.findAndCountAll({
      where: {
        seller_id: req.params.userId,
        status: 'active'
      },
      include: [{
        model: User,
        as: 'seller',
        attributes: ['id', 'name', 'avatar_url']
      }],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/products/:id/mark-sold
 * @desc    Mark product as sold
 * @access  Private (Owner only)
 */
router.post('/:id/mark-sold', authenticate, async (req, res, next) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check ownership
    if (product.seller_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product'
      });
    }

    await product.markAsSold();

    res.json({
      success: true,
      message: 'Product marked as sold'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;