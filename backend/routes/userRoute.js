const express = require('express');
const router = express.Router();
const {createUser, deleteUser, getUser, updateUser, login} = require('../controllers/userController')
const validator = require('../middleware/validation')
const auth = require('../middleware/authMiddleware');

const protect = auth.protect;

router.post('/', validator.userValidation(),  createUser);
router.get('/get', protect, getUser);
router.get('/login', login);
router.put('/update', protect, updateUser);
router.delete('/delete', protect, deleteUser);

module.exports = router