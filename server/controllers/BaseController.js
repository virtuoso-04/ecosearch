/**
 * Base Controller
 * Common functionality for all controllers
 */

const { validationResult } = require('express-validator');
const { ApiError } = require('../utils/errors');

class BaseController {
  /**
   * Handle validation errors
   */
  static handleValidationErrors(req) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }));
      throw new ApiError('Validation failed', 400, { errors: errorMessages });
    }
  }

  /**
   * Send success response
   */
  static sendSuccess(res, data = null, message = 'Success', statusCode = 200) {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      ...(data && { data })
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send error response
   */
  static sendError(res, message = 'Internal server error', statusCode = 500, details = null) {
    const response = {
      success: false,
      error: {
        message,
        timestamp: new Date().toISOString(),
        ...(details && { details })
      }
    };
    return res.status(statusCode).json(response);
  }

  /**
   * Send paginated response
   */
  static sendPaginated(res, data, pagination, message = 'Success') {
    const response = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: Math.ceil(pagination.total / pagination.limit),
        hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
        hasPrevPage: pagination.page > 1
      }
    };
    return res.status(200).json(response);
  }

  /**
   * Parse pagination parameters
   */
  static getPagination(req) {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  /**
   * Parse sorting parameters
   */
  static getSorting(req, allowedFields = []) {
    const { sort, order } = req.query;
    
    if (!sort || !allowedFields.includes(sort)) {
      return [['created_at', 'DESC']];
    }
    
    const sortOrder = order && order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    return [[sort, sortOrder]];
  }

  /**
   * Parse filter parameters
   */
  static getFilters(req, allowedFilters = {}) {
    const filters = {};
    
    Object.keys(allowedFilters).forEach(key => {
      if (req.query[key] !== undefined) {
        const filterConfig = allowedFilters[key];
        let value = req.query[key];
        
        // Apply transformations based on filter type
        switch (filterConfig.type) {
          case 'number':
            value = parseFloat(value);
            if (isNaN(value)) return;
            break;
          case 'boolean':
            value = value === 'true';
            break;
          case 'array':
            value = Array.isArray(value) ? value : value.split(',');
            break;
          case 'date':
            value = new Date(value);
            if (isNaN(value.getTime())) return;
            break;
        }
        
        filters[filterConfig.field || key] = value;
      }
    });
    
    return filters;
  }

  /**
   * Async error wrapper
   */
  static asyncHandler(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }
}

module.exports = BaseController;
