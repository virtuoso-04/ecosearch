const { Order, OrderItem, Cart, Product, User } = require('../models');
const { sequelize } = require('../config/database');

exports.getPurchases = async (req, res) => {
  try {
    // Get orders for the user and transform them to look like the old Purchase format
    const orders = await Order.findAll({
      where: { buyer_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{
          model: Product,
          as: 'product'
        }]
      }],
      order: [['created_at', 'DESC']]
    });

    // Transform orders to match the expected Purchase format
    const purchases = [];
    orders.forEach(order => {
      order.items.forEach(item => {
        purchases.push({
          id: item.id,
          userId: order.buyer_id,
          productId: item.product_id,
          priceAtPurchase: parseFloat(item.unit_price),
          timestamp: order.created_at,
          totalAmount: parseFloat(item.total_price),
          quantity: item.quantity,
          Product: item.product,
          // Include order information for enhanced frontend capabilities
          orderId: order.id,
          orderNumber: order.order_number,
          orderStatus: order.status,
          paymentStatus: order.payment_status
        });
      });
    });

    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Failed to fetch purchases' });
  }
};

exports.checkout = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const cartItems = await Cart.findAll({ 
      where: { user_id: req.user.id }, 
      include: [{
        model: Product,
        as: 'product',
        include: [{
          model: User,
          as: 'seller'
        }]
      }],
      transaction
    });
    
    if (!cartItems.length) {
      await transaction.rollback();
      return res.status(400).json({ error: 'Cart is empty.' });
    }

    // Calculate totals
    let subtotal = 0;
    cartItems.forEach(item => {
      subtotal += parseFloat(item.product.price) * item.quantity;
    });

    const taxRate = 0.08; // 8% tax
    const taxAmount = subtotal * taxRate;
    const totalAmount = subtotal + taxAmount;

    // Create the order
    const order = await Order.create({
      buyer_id: req.user.id,
      subtotal: subtotal,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      status: 'confirmed',
      payment_status: 'paid' // Simplified for MVP
    }, { transaction });

    // Create order items and collect purchase data
    const purchases = [];
    for (const item of cartItems) {
      const orderItem = await OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        seller_id: item.product.seller_id,
        quantity: item.quantity,
        unit_price: item.product.price,
        product_snapshot: {
          name: item.product.name,
          description: item.product.description,
          image: item.product.image,
          category: item.product.category
        }
      }, { transaction });

      // Format response to match old Purchase format
      purchases.push({
        id: orderItem.id,
        userId: order.buyer_id,
        productId: item.product_id,
        priceAtPurchase: parseFloat(item.product.price),
        timestamp: order.created_at,
        totalAmount: parseFloat(orderItem.total_price),
        quantity: item.quantity,
        Product: item.product,
        orderId: order.id,
        orderNumber: order.order_number,
        orderStatus: order.status,
        paymentStatus: order.payment_status
      });

      // Remove item from cart
      await item.destroy({ transaction });
    }

    await transaction.commit();
    res.status(201).json(purchases);
  } catch (error) {
    await transaction.rollback();
    console.error('Checkout error:', error);
    res.status(500).json({ error: 'Checkout failed' });
  }
};
