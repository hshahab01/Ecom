const express = require('express');
const router = express.Router();
const { placeOrder, cancelOrder, getOrder } = require('../controllers/orderController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const protect = auth.protect;

router.post('/', protect, placeOrder);
router.get('/get', protect, getOrder);
router.delete('/delete', protect, cancelOrder);

module.exports = router