const express = require('express');
const router = express.Router();
const { addItem, deleteItem, getCart } = require('../controllers/cartController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const protect = auth.protect;

router.post('/', protect, addItem);
router.get('/get', protect, getCart);
router.delete('/delete', protect, deleteItem);

module.exports = router