/**
 * User Routes
 * User profile management and user-related operations
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { User, Product } = require('../models');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile (detailed)
 * @access  Private
 */
router.get('/profile', authenticate, async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ['id', 'title', 'price', 'status', 'image_url', 'created_at']
        }
      ]
    });

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        stats: {
          totalListings: user.products ? user.products.length : 0,
          activeListings: user.products ? user.products.filter(p => p.status === 'active').length : 0,
          soldItems: user.products ? user.products.filter(p => p.status === 'sold').length : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', authenticate, async (req, res, next) => {
  try {
    const { name, phone, address, bio, avatar_url } = req.body;

    const user = await User.findByPk(req.user.id);
    
    // Update allowed fields
    if (name !== undefined) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (bio !== undefined) user.bio = bio;
    if (avatar_url !== undefined) user.avatar_url = avatar_url;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: user.toSafeObject()
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/:id/public
 * @desc    Get public user profile
 * @access  Public
 */
router.get('/:id/public', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['id', 'name', 'avatar_url', 'bio', 'created_at'],
      include: [
        {
          model: Product,
          as: 'products',
          where: { status: 'active' },
          required: false,
          attributes: ['id', 'title', 'price', 'image_url', 'category', 'created_at']
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          avatar_url: user.avatar_url,
          bio: user.bio,
          memberSince: user.created_at,
          activeListings: user.products ? user.products.length : 0
        },
        products: user.products || []
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/dashboard/stats
 * @desc    Get user dashboard statistics
 * @access  Private
 */
router.get('/dashboard/stats', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // Get user's products
    const products = await Product.findAll({
      where: { seller_id: userId },
      attributes: ['id', 'status', 'price', 'view_count', 'favorite_count', 'created_at']
    });

    // Calculate statistics
    const stats = {
      totalListings: products.length,
      activeListings: products.filter(p => p.status === 'active').length,
      soldItems: products.filter(p => p.status === 'sold').length,
      reservedItems: products.filter(p => p.status === 'reserved').length,
      totalViews: products.reduce((sum, p) => sum + (p.view_count || 0), 0),
      totalFavorites: products.reduce((sum, p) => sum + (p.favorite_count || 0), 0),
      totalRevenue: products
        .filter(p => p.status === 'sold')
        .reduce((sum, p) => sum + parseFloat(p.price || 0), 0),
      recentListings: products
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          status: p.status,
          price: p.price,
          views: p.view_count,
          created_at: p.created_at
        }))
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
