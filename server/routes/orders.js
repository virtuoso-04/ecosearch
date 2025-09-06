/**
 * Order Routes
 * Order management and purchase history functionality
 */

const express = require('express');
const { Op } = require('sequelize');
const { authenticate } = require('../middleware/auth');
const { Order, OrderItem, Product, User, Cart } = require('../models');

const router = express.Router();

/**
 * @route   GET /api/orders
 * @desc    Get user's order history
 * @access  Private
 */
router.get('/', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;
    const where = { user_id: req.user.id };

    if (status) {
      where.status = status;
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where,
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'title', 'image_url', 'category'],
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'name', 'avatar_url']
                }
              ]
            }
          ]
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        orders,
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
 * @route   GET /api/orders/:id
 * @desc    Get specific order details
 * @access  Private
 */
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'name', 'avatar_url', 'phone', 'email']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/orders/create
 * @desc    Create new order from cart
 * @access  Private
 */
router.post('/create', authenticate, async (req, res, next) => {
  try {
    const { shipping_address, payment_method = 'cash_on_delivery' } = req.body;

    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Get cart items
    const cartItems = await Cart.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Product,
          as: 'product',
          where: { status: 'active' },
          include: [
            {
              model: User,
              as: 'seller',
              attributes: ['id', 'name', 'email']
            }
          ]
        }
      ]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => 
      sum + (parseFloat(item.product.price) * item.quantity), 0
    );

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_amount: totalAmount,
      status: 'pending',
      shipping_address,
      payment_method,
      payment_status: 'pending'
    });

    // Create order items and mark products as reserved
    const orderItems = [];
    for (const cartItem of cartItems) {
      const orderItem = await OrderItem.create({
        order_id: order.id,
        product_id: cartItem.product_id,
        quantity: cartItem.quantity,
        price: cartItem.product.price,
        seller_id: cartItem.product.seller_id
      });

      // Mark product as reserved
      await Product.update(
        { status: 'reserved' },
        { where: { id: cartItem.product_id } }
      );

      orderItems.push(orderItem);
    }

    // Clear cart
    await Cart.destroy({
      where: { user_id: req.user.id }
    });

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              include: [
                {
                  model: User,
                  as: 'seller',
                  attributes: ['id', 'name', 'avatar_url']
                }
              ]
            }
          ]
        }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: { order: completeOrder }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status (for sellers)
 * @access  Private
 */
router.put('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product'
            }
          ]
        }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is the seller of any items in this order
    const isSellerInOrder = order.items.some(item => 
      item.product.seller_id === req.user.id
    );

    if (!isSellerInOrder && order.user_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update order status
    order.status = status;

    // If order is completed, mark products as sold
    if (status === 'delivered') {
      order.payment_status = 'completed';
      
      // Mark products as sold
      for (const item of order.items) {
        await Product.update(
          { status: 'sold' },
          { where: { id: item.product_id } }
        );
      }
    }

    // If order is cancelled, mark products as active again
    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.update(
          { status: 'active' },
          { where: { id: item.product_id } }
        );
      }
    }

    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: { order }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/orders/sales
 * @desc    Get sales for current user (as seller)
 * @access  Private
 */
router.get('/sales', authenticate, async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: orderItems } = await OrderItem.findAndCountAll({
      where: { seller_id: req.user.id },
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name', 'avatar_url']
            }
          ]
        },
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'title', 'image_url', 'category']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        sales: orderItems,
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

module.exports = router;
