const express = require('express');
const router = express.Router();
const { handleNotification } = require('../controllers/paymentController');

router.post('/notification', handleNotification);

module.exports = router;