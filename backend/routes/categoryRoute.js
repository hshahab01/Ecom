const express = require('express');
const router = express.Router();
const {createCategory, deleteCategory, getCategory, updateCategory} = require('../controllers/categoryController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const admin = auth.isAdmin;

router.post('/', admin,  createCategory);
router.get('/get', admin, getCategory);
router.put('/update', admin, updateCategory);
router.delete('/delete', admin, deleteCategory);

module.exports = router