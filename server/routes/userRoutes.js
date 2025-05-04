const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const threadController = require('../controllers/threadController');
const commentController = require('../controllers/commentController');

const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

/* ----- Protected routes ----- */

// GET /api/users/me - Get the current user
router.get('/me', verifyToken, userController.getCurrentUser);

// PUT /api/users/me - Update a user
router.put('/me', verifyToken, userController.putCurrentUser);

// DELETE /api/users/me - Delete a user
router.delete('/me', verifyToken, userController.deleteCurrentUser);

/* ----- Public routes ----- */

// GET /api/users/:userId - Get user by userId
router.get('/:userId', userController.getUserByUserId);

// POST /api/users - Create a new user
// router.post('/', userController.postUser);

// GET /api/users/:userId/threads - Get all threads by a specific user
router.get('/:userId/threads', threadController.getThreadsByUser);

// GET /api/users/:userId/comments - Get all comments by a specific user
router.get('/:userId/comments', commentController.getCommentsByUser);

/* ----- Admin routes ----- */

// GET /api/users - Get all users
router.get('/', verifyToken, checkAdmin, userController.getAllUsers);

// GET /api/users/:id - Get a specific user
router.get('/:id', verifyToken, checkAdmin, userController.getUserById);

module.exports = router; 