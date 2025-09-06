/**
 * Cart Routes
 * Shopping cart functionality for EcoFinds marketplace
 */

const express = require('express');
const { authenticate } = require('../middleware/auth');
const { Cart, Product, User } = require('../models');

const router = express.Router();

/**
 * @route   GET /api/cart
 * @desc    Get user's cart items
 * @access  Private
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'price', 'image_url', 'status', 'seller_id'],
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name', 'avatar_url']
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    // Filter out products that are no longer available
    const availableItems = cartItems.filter(item => 
      item.product && item.product.status === 'active'
    );

    // Calculate totals
    const totalItems = availableItems.length;
    const totalAmount = availableItems.reduce((sum, item) => 
      sum + (parseFloat(item.product.price) * item.quantity), 0
    );

    res.json({
      success: true,
      data: {
        items: availableItems,
        summary: {
          totalItems,
          totalAmount: totalAmount.toFixed(2),
          currency: 'USD'
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/cart/add
 * @desc    Add item to cart
 * @access  Private
 */
router.post('/add', authenticate, async (req, res, next) => {
  try {
    const { product_id, quantity = 1 } = req.body;

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Check if product exists and is available
    const product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (product.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Product is not available for purchase'
      });
    }

    // Prevent user from adding their own products to cart
    if (product.seller_id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot add your own product to cart'
      });
    }

    // Check if item is already in cart
    const existingCartItem = await Cart.findOne({
      where: {
        user_id: req.user.id,
        product_id: product_id
      }
    });

    if (existingCartItem) {
      // Update quantity
      existingCartItem.quantity = parseInt(quantity);
      await existingCartItem.save();

      const updatedItem = await Cart.findByPk(existingCartItem.id, {
        include: [
          {
            model: Product,
            as: 'product',
            attributes: ['id', 'title', 'price', 'image_url']
          }
        ]
      });

      return res.json({
        success: true,
        message: 'Cart updated successfully',
        data: { item: updatedItem }
      });
    }

    // Add new item to cart
    const cartItem = await Cart.create({
      user_id: req.user.id,
      product_id: product_id,
      quantity: parseInt(quantity)
    });

    const newItem = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'price', 'image_url']
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully',
      data: { item: newItem }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/cart/:id
 * @desc    Update cart item quantity
 * @access  Private
 */
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Valid quantity is required'
      });
    }

    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();

    const updatedItem = await Cart.findByPk(cartItem.id, {
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'price', 'image_url']
        }
      ]
    });

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: { item: updatedItem }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/cart/:id
 * @desc    Remove item from cart
 * @access  Private
 */
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const cartItem = await Cart.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    await cartItem.destroy();

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/cart/clear
 * @desc    Clear all items from cart
 * @access  Private
 */
router.delete('/clear', authenticate, async (req, res, next) => {
  try {
    await Cart.destroy({
      where: { user_id: req.user.id }
    });

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
