/**
 * Validation Middleware
 * Comprehensive validation rules for all API endpoints
 */

const { body, param, query } = require('express-validator');

class ValidationRules {
  // User validation rules
  static registerUser = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 6, max: 128 })
      .withMessage('Password must be between 6 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('name')
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters')
      .matches(/^[a-zA-Z\s\-'\.]+$/)
      .withMessage('Name can only contain letters, spaces, hyphens, apostrophes, and periods'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('address')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Address cannot exceed 500 characters')
  ];

  static loginUser = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required')
  ];

  static updateProfile = [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('phone')
      .optional()
      .isMobilePhone()
      .withMessage('Please provide a valid phone number'),
    body('address')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Address cannot exceed 500 characters'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
    body('bio')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Bio cannot exceed 500 characters')
  ];

  // Product validation rules
  static createProduct = [
    body('title')
      .trim()
      .isLength({ min: 3, max: 255 })
      .withMessage('Title must be between 3 and 255 characters'),
    body('description')
      .optional()
      .isLength({ max: 2000 })
      .withMessage('Description cannot exceed 2000 characters'),
    body('price')
      .isFloat({ min: 0.01, max: 999999.99 })
      .withMessage('Price must be between 0.01 and 999,999.99'),
    body('original_price')
      .optional()
      .isFloat({ min: 0.01 })
      .withMessage('Original price must be greater than 0'),
    body('category')
      .isIn([
        'electronics', 'clothing', 'furniture', 'sports', 'books', 
        'home_garden', 'automotive', 'health_beauty', 'toys_games', 'other'
      ])
      .withMessage('Invalid category'),
    body('condition')
      .isIn(['new', 'like_new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
    body('image_url')
      .optional()
      .isURL()
      .withMessage('Image URL must be a valid URL'),
    body('images')
      .optional()
      .isArray()
      .withMessage('Images must be an array'),
    body('images.*')
      .optional()
      .isURL()
      .withMessage('Each image must be a valid URL'),
    body('location')
      .optional()
      .isLength({ max: 255 })
      .withMessage('Location cannot exceed 255 characters'),
    body('latitude')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('longitude')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
    body('tags')
      .optional()
      .custom((value) => {
        if (Array.isArray(value)) {
          return value.every(tag => typeof tag === 'string' && tag.length <= 50);
        }
        return typeof value === 'string';
      })
      .withMessage('Tags must be an array of strings or a comma-separated string')
  ];

  static updateProduct = [
    ...ValidationRules.createProduct.map(rule => rule.optional()),
    body('status')
      .optional()
      .isIn(['active', 'sold', 'reserved', 'inactive'])
      .withMessage('Invalid status')
  ];

  // Cart validation rules
  static addToCart = [
    body('product_id')
      .isUUID()
      .withMessage('Valid product ID is required'),
    body('quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99'),
    body('notes')
      .optional()
      .isLength({ max: 500 })
      .withMessage('Notes cannot exceed 500 characters')
  ];

  static updateCartItem = [
    body('quantity')
      .isInt({ min: 1, max: 99 })
      .withMessage('Quantity must be between 1 and 99')
  ];

  // Order validation rules
  static createOrder = [
    body('shipping_address')
      .optional()
      .isObject()
      .withMessage('Shipping address must be an object'),
    body('shipping_address.street')
      .optional()
      .isLength({ min: 1, max: 255 })
      .withMessage('Street address is required'),
    body('shipping_address.city')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('City is required'),
    body('shipping_address.state')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('State is required'),
    body('shipping_address.zip_code')
      .optional()
      .isPostalCode('any')
      .withMessage('Valid postal code is required'),
    body('payment_method')
      .optional()
      .isIn(['cash', 'card', 'bank_transfer', 'digital_wallet'])
      .withMessage('Invalid payment method'),
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters')
  ];

  static updateOrderStatus = [
    body('status')
      .isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'])
      .withMessage('Invalid status'),
    body('notes')
      .optional()
      .isLength({ max: 1000 })
      .withMessage('Notes cannot exceed 1000 characters'),
    body('tracking_number')
      .optional()
      .isLength({ max: 100 })
      .withMessage('Tracking number cannot exceed 100 characters')
  ];

  // Parameter validation rules
  static validateUUID = [
    param('id')
      .isUUID()
      .withMessage('Valid ID is required')
  ];

  static validateOptionalUUID = [
    param('id')
      .optional()
      .isUUID()
      .withMessage('Valid ID is required')
  ];

  // Query validation rules
  static validatePagination = [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100')
  ];

  static validateProductQuery = [
    ...ValidationRules.validatePagination,
    query('search')
      .optional()
      .isLength({ min: 2 })
      .withMessage('Search query must be at least 2 characters'),
    query('category')
      .optional()
      .isIn([
        'electronics', 'clothing', 'furniture', 'sports', 'books', 
        'home_garden', 'automotive', 'health_beauty', 'toys_games', 'other'
      ])
      .withMessage('Invalid category'),
    query('minPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Minimum price must be a positive number'),
    query('maxPrice')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Maximum price must be a positive number'),
    query('condition')
      .optional()
      .isIn(['new', 'like_new', 'good', 'fair', 'poor'])
      .withMessage('Invalid condition'),
    query('sort')
      .optional()
      .isIn(['title', 'price', 'created_at', 'view_count', 'favorite_count'])
      .withMessage('Invalid sort field'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be asc or desc'),
    query('featured')
      .optional()
      .isBoolean()
      .withMessage('Featured must be true or false')
  ];

  // Custom validation middleware
  static validatePasswordChange = [
    body('currentPassword')
      .notEmpty()
      .withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 6, max: 128 })
      .withMessage('New password must be between 6 and 128 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match new password');
        }
        return true;
      })
  ];
}

module.exports = ValidationRules;
