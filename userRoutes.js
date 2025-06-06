const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('./userController');
const { protect } = require('./authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

module.exports = router;