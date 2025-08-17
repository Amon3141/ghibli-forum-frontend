const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

/* ----- Public routes ----- */

// POST /api/auth/register - Register a new user
router.post('/register', authController.registerUser);

// POST /api/auth/login - Login a user
router.post('/login', authController.loginUser);

// POST /api/auth/logout - Logout a user
router.post('/logout', authController.logoutUser);

// GET /api/auth/verify-email - Verify email
router.get('/verify-email', authController.verifyEmail);

// POST /api/auth/resend-verification - Resend verification email
router.post('/resend-verification', authController.resendVerificationEmail);

module.exports = router;
