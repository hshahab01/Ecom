const express = require('express');
const router = express.Router();
const {createProduct, deleteProduct, getProduct, updateProduct} = require('../controllers/productController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const admin = auth.isAdmin;

router.post('/', admin,  createProduct);
router.get('/get', admin, getProduct);
router.put('/update', admin, updateProduct);
router.delete('/delete', admin, deleteProduct);

module.exports = router