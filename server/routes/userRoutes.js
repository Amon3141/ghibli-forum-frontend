const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const threadController = require('../controllers/threadController');
const commentController = require('../controllers/commentController');

// GET /api/users/:id - Get a specific user
router.get('/:id', userController.getUserById);

// GET /api/users/by-userid/:userId - Get user by userId
router.get('/:userId', userController.getUserByUserId);

// POST /api/users - Create a new user
router.post('/', userController.postUser);

// PUT /api/users/:id - Update a user
router.put('/:id', userController.putUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', userController.deleteUser);

// GET /api/users/:userId/threads - Get all threads by a specific user
router.get('/:id/threads', threadController.getThreadsByUser);

// GET /api/users/:userId/comments - Get all comments by a specific user
router.get('/:id/comments', commentController.getCommentsByUser);

module.exports = router; 