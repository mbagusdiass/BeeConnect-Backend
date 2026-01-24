const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { checkout, getBuyerHistory, getSellerHistory, getDetailHistory  } = require('../controllers/transactionController');

router.post('/checkout', auth, checkout);
router.get('/history/buyer', auth, getBuyerHistory);
router.get('/history/seller', auth, getSellerHistory);
router.get('/history/detail/:id', auth, getDetailHistory);

module.exports = router;