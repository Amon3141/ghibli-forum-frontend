const express = require('express');
const router = express.Router();
const threadController = require('../controllers/threadController');
const commentController = require('../controllers/commentController');

const { verifyToken } = require('../middlewares/authMiddleware');

/* ----- Public routes ----- */

// GET /api/threads - Get all threads
router.get('/', threadController.getAllThreads);

// GET /api/threads/:id - Get a specific thread by ID
router.get('/:id', threadController.getThreadById);

// GET /api/threads/:id/comments - Get all top-level comments for a thread
router.get('/:id/comments', commentController.getCommentsByThread);

/* ----- Protected routes ----- */

// PUT /api/threads/:id - Update a thread
router.put('/:id', verifyToken, threadController.putThread);

// DELETE /api/threads/:id - Delete a thread
router.delete('/:id', verifyToken, threadController.softDeleteThread);

// POST /api/threads/:id/comments - Create a new comment
router.post('/:id/comments', verifyToken, commentController.postComment);

// PUT /api/threads/:id/reaction - Update thread reaction
router.put('/:id/reaction', verifyToken, threadController.updateThreadReaction);

module.exports = router; 