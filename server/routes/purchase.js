const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, purchaseController.getPurchases);
router.post('/checkout', authenticate, purchaseController.checkout);

module.exports = router;
