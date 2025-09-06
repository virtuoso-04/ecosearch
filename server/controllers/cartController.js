const { Cart, Product } = require('../models');

exports.getCart = async (req, res) => {
  try {
    const items = await Cart.findAll({ 
      where: { user_id: req.user.id },
      include: [{
        model: Product,
        as: 'product'
      }]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ error: 'Product required.' });
    
    let item = await Cart.findOne({ 
      where: { user_id: req.user.id, product_id: productId } 
    });
    
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      item = await Cart.create({ 
        user_id: req.user.id, 
        product_id: productId, 
        quantity,
        price_at_time: product.price
      });
    }
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Cart.findByPk(id);
    if (!item || item.user_id !== req.user.id) {
      return res.status(404).json({ error: 'Not found.' });
    }
    await item.destroy();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove from cart' });
  }
};
