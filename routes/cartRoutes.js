const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addToCart, getCart, removeItem } = require('../controllers/cartController');

router.get('/', auth, getCart);
router.post('/add', auth, addToCart);
router.delete('/remove/:productId', auth, removeItem);

module.exports = router;