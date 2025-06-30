const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

const { verifyToken } = require('../middlewares/authMiddleware');

/* ----- Public routes ----- */

// GET /api/comments/:id - Get a specific comment
router.get('/:id', commentController.getCommentById);

// GET /api/comments/:id/replies - Get replies for a comment
router.get('/:id/replies', commentController.getRepliesByComment);

/* ----- Protected routes ----- */

// PUT /api/comments/:id - Update a comment
router.put('/:id', verifyToken, commentController.putComment);

// PUT /api/comments/:id/reaction - Update comment reaction
router.put('/:id/reaction', verifyToken, commentController.updateCommentReaction);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', verifyToken, commentController.deleteComment);

module.exports = router; 