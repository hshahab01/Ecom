const express = require('express');
const router = express.Router();
const {createVariant, deleteVariant, getVariant, updateVariant} = require('../controllers/variantController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const admin = auth.isAdmin;

router.post('/', admin,  createVariant);
router.get('/get', admin, getVariant);
router.put('/update', admin, updateVariant);
router.delete('/delete', admin, deleteVariant);

module.exports = router