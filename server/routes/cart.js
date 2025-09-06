const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, cartController.getCart);
router.post('/', authenticate, cartController.addToCart);
router.delete('/:id', authenticate, cartController.removeFromCart);

module.exports = router;
