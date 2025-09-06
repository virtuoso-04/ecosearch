/**
 * Security Middleware
 * Comprehensive security configuration for the API
 */

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: {
    error: message,
    retryAfter: Math.ceil(windowMs / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      error: {
        message,
        retryAfter: Math.ceil(windowMs / 1000),
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Different rate limits for different endpoints
const rateLimits = {
  // General API rate limit
  general: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    100, // limit each IP to 100 requests per windowMs
    'Too many requests from this IP, please try again later'
  ),

  // Authentication endpoints (stricter)
  auth: createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // limit each IP to 5 requests per windowMs
    'Too many authentication attempts, please try again later'
  ),

  // Product creation (moderate)
  createProduct: createRateLimit(
    60 * 60 * 1000, // 1 hour
    10, // limit each IP to 10 product creations per hour
    'Too many products created, please try again later'
  ),

  // Search endpoints (lenient but protected)
  search: createRateLimit(
    1 * 60 * 1000, // 1 minute
    30, // limit each IP to 30 searches per minute
    'Too many search requests, please slow down'
  ),

  // Cart operations
  cart: createRateLimit(
    5 * 60 * 1000, // 5 minutes
    20, // limit each IP to 20 cart operations per 5 minutes
    'Too many cart operations, please try again later'
  )
};

// Security headers configuration
const helmetConfig = {
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin'
  }
};

// IP whitelist for development (optional)
const ipWhitelist = process.env.IP_WHITELIST ? 
  process.env.IP_WHITELIST.split(',') : [];

// IP blocking middleware
const ipFilter = (req, res, next) => {
  // Skip in development or if no whitelist is configured
  if (process.env.NODE_ENV === 'development' || ipWhitelist.length === 0) {
    return next();
  }

  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (!ipWhitelist.includes(clientIP)) {
    return res.status(403).json({
      success: false,
      error: {
        message: 'Access denied from this IP address',
        timestamp: new Date().toISOString()
      }
    });
  }

  next();
};

// Request size limiting middleware
const requestSizeLimit = (limit = '10mb') => (req, res, next) => {
  const contentLength = parseInt(req.get('content-length'));
  const maxSize = parseInt(limit) * 1024 * 1024; // Convert MB to bytes

  if (contentLength > maxSize) {
    return res.status(413).json({
      success: false,
      error: {
        message: `Request entity too large. Maximum size is ${limit}`,
        timestamp: new Date().toISOString()
      }
    });
  }

  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove sensitive headers
  res.removeHeader('X-Powered-By');
  res.removeHeader('Server');

  // Add custom security headers
  res.setHeader('X-API-Version', '2.0.0');
  res.setHeader('X-Response-Time', Date.now() - req.startTime);
  
  next();
};

// Request timing middleware
const requestTiming = (req, res, next) => {
  req.startTime = Date.now();
  next();
};

// Setup function to apply all security middleware
const setupSecurity = (app) => {
  // Request timing (should be first)
  app.use(requestTiming);

  // IP filtering
  app.use(ipFilter);

  // Helmet for security headers
  app.use(helmet(helmetConfig));

  // Custom security headers
  app.use(securityHeaders);

  // Request size limiting
  app.use(requestSizeLimit('10mb'));

  // Apply rate limiting to specific routes
  app.use('/api/auth/login', rateLimits.auth);
  app.use('/api/auth/register', rateLimits.auth);
  app.use('/api/products', rateLimits.general);
  app.use('/api/cart', rateLimits.cart);
  app.use('/api/search', rateLimits.search);

  // General rate limiting for all API routes
  app.use('/api/', rateLimits.general);

  console.log('🔒 Security middleware configured');
};

// Middleware to log security events
const securityLogger = (event, req, details = {}) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      event,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.originalUrl,
      method: req.method,
      ...details
    }));
  }
};

module.exports = {
  setupSecurity,
  rateLimit: rateLimits,
  securityLogger,
  ipFilter,
  requestSizeLimit,
  securityHeaders
};
