const Product = require('../models/Product');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, price, imageUrl } = req.body;
    if (!title || !price) return res.status(400).json({ error: 'Title and price required.' });
    const product = await Product.create({
      title,
      description,
      category,
      price,
      imageUrl,
      ownerId: req.user.id,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create product.' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products.' });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch product.' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product || product.ownerId !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });
    const { title, description, category, price, imageUrl } = req.body;
    product.title = title || product.title;
    product.description = description || product.description;
    product.category = category || product.category;
    product.price = price || product.price;
    product.imageUrl = imageUrl || product.imageUrl;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product.' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product || product.ownerId !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });
    await product.destroy();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product.' });
  }
};
