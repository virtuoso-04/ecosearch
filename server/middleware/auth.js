// HACKATHON MOD: Authentication middleware updated for demo
// - Enhanced error handling for product creation demos
// - Maintains existing JWT functionality with fallbacks
// - TODO: Implement proper ownership checks post-hackathon

/**
 * Authentication Middleware
 * JWT token validation and user authentication
 */

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');
const { User } = require('../models');

/**
 * Authenticate JWT token and attach user to request
 * // HACKATHON MOD: Enhanced for demo mode with better error messages
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required. Please log in to continue.',
        code: 'AUTH_REQUIRED' // HACKATHON MOD: Added error codes for better frontend handling
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user by ID from token
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User account not found. Please log in again.',
          code: 'USER_NOT_FOUND'
        });
      }

      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is not active. Please contact support.',
          code: 'ACCOUNT_INACTIVE'
        });
      }

      req.user = user;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.',
        code: 'TOKEN_EXPIRED'
      });
    }
  } catch (error) {
    console.error('Authentication middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication service temporarily unavailable'
    });
  }
};

/**
 * Optional authentication - doesn't fail if no token provided
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(); // Continue without user
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ['password'] }
      });

      if (user && user.status === 'active') {
        req.user = user;
      }
    } catch (jwtError) {
      // Invalid token, but continue without user
    }

    next();
  } catch (error) {
    console.error('Optional auth middleware error:', error);
    next(); // Continue even if error
  }
};

module.exports = {
  authenticate,
  optionalAuth
};
