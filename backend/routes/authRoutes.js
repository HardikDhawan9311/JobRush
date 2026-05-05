const express = require('express');
const router = express.Router();
const { register, login, sendOTP, updatePassword } = require('../controllers/authController');

// @route   POST /auth/send-otp
router.post('/send-otp', sendOTP);

// @route   POST /auth/register
router.post('/register', register);

// @route   POST api/auth/login
router.post('/login', login);

// @route   POST /auth/update-password
router.post('/update-password', updatePassword);

module.exports = router;
