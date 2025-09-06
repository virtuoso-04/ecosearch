/**
 * Product Controller
 * Comprehensive product management with enhanced features
 */

const BaseController = require('./BaseController');
const { Product, User } = require('../models');
const { Op } = require('sequelize');

class ProductController extends BaseController {
  /**
   * Get all products with search, filter, and pagination
   */
  async getAllProducts(req, res) {
    try {
      const {
        page = 1,
        limit = 12,
        search,
        category,
        minPrice,
        maxPrice,
        sortBy = 'created_at',
        sortOrder = 'DESC',
        sellerId
      } = req.query;

      // Build where conditions
      const whereConditions = {};
      
      if (search) {
        whereConditions[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ];
      }
      
      if (category) {
        whereConditions.category = category;
      }
      
      if (minPrice || maxPrice) {
        whereConditions.price = {};
        if (minPrice) whereConditions.price[Op.gte] = parseFloat(minPrice);
        if (maxPrice) whereConditions.price[Op.lte] = parseFloat(maxPrice);
      }
      
      if (sellerId) {
        whereConditions.seller_id = sellerId;
      }

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      
      // Valid sort fields
      const validSortFields = ['name', 'price', 'created_at', 'updated_at'];
      const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at';
      const order = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereConditions,
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }],
        order: [[sortField, order]],
        limit: parseInt(limit),
        offset,
        distinct: true
      });

      const totalPages = Math.ceil(count / parseInt(limit));
      
      return this.successResponse(res, {
        products,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit),
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        },
        filters: {
          search,
          category,
          minPrice,
          maxPrice,
          sortBy: sortField,
          sortOrder: order
        }
      });
    } catch (error) {
      return this.errorResponse(res, 'Failed to fetch products', 500, error);
    }
  }

  /**
   * Get product by ID
   */
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id, {
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email', 'created_at']
        }]
      });

      if (!product) {
        return this.errorResponse(res, 'Product not found', 404);
      }

      return this.successResponse(res, { product });
    } catch (error) {
      return this.errorResponse(res, 'Failed to fetch product', 500, error);
    }
  }

  /**
   * Create new product (authenticated sellers only)
   */
  async createProduct(req, res) {
    try {
      const productData = {
        ...req.body,
        seller_id: req.user.id
      };

      const product = await Product.create(productData);
      
      // Fetch the created product with seller info
      const createdProduct = await Product.findByPk(product.id, {
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }]
      });

      return this.successResponse(res, { 
        product: createdProduct,
        message: 'Product created successfully' 
      }, 201);
    } catch (error) {
      return this.errorResponse(res, 'Failed to create product', 400, error);
    }
  }

  /**
   * Update product (only by the seller)
   */
  async updateProduct(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return this.errorResponse(res, 'Product not found', 404);
      }

      // Check if user is the seller
      if (product.seller_id !== req.user.id) {
        return this.errorResponse(res, 'Unauthorized: You can only update your own products', 403);
      }

      await product.update(req.body);
      
      // Fetch updated product with seller info
      const updatedProduct = await Product.findByPk(id, {
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }]
      });

      return this.successResponse(res, { 
        product: updatedProduct,
        message: 'Product updated successfully' 
      });
    } catch (error) {
      return this.errorResponse(res, 'Failed to update product', 400, error);
    }
  }

  /**
   * Delete product (only by the seller)
   */
  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      
      const product = await Product.findByPk(id);
      
      if (!product) {
        return this.errorResponse(res, 'Product not found', 404);
      }

      // Check if user is the seller
      if (product.seller_id !== req.user.id) {
        return this.errorResponse(res, 'Unauthorized: You can only delete your own products', 403);
      }

      await product.destroy();

      return this.successResponse(res, { 
        message: 'Product deleted successfully' 
      });
    } catch (error) {
      return this.errorResponse(res, 'Failed to delete product', 500, error);
    }
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(req, res) {
    try {
      const { category } = req.params;
      const { page = 1, limit = 12 } = req.query;
      
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const { count, rows: products } = await Product.findAndCountAll({
        where: { category },
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit),
        offset,
        distinct: true
      });

      const totalPages = Math.ceil(count / parseInt(limit));

      return this.successResponse(res, {
        products,
        category,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: count,
          itemsPerPage: parseInt(limit)
        }
      });
    } catch (error) {
      return this.errorResponse(res, 'Failed to fetch products by category', 500, error);
    }
  }

  /**
   * Search products with advanced filtering
   */
  async searchProducts(req, res) {
    try {
      const { q: query } = req.query;
      
      if (!query) {
        return this.errorResponse(res, 'Search query is required', 400);
      }

      const products = await Product.findAll({
        where: {
          [Op.or]: [
            { name: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
            { category: { [Op.like]: `%${query}%` } }
          ]
        },
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']],
        limit: 50 // Reasonable limit for search results
      });

      return this.successResponse(res, {
        products,
        query,
        count: products.length
      });
    } catch (error) {
      return this.errorResponse(res, 'Search failed', 500, error);
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(req, res) {
    try {
      const { limit = 8 } = req.query;

      const products = await Product.findAll({
        include: [{
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'email']
        }],
        order: [['created_at', 'DESC']],
        limit: parseInt(limit)
      });

      return this.successResponse(res, { 
        products,
        message: 'Featured products retrieved successfully' 
      });
    } catch (error) {
      return this.errorResponse(res, 'Failed to fetch featured products', 500, error);
    }
  }
}

module.exports = new ProductController();
