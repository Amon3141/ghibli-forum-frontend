const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// GET /api/comments/:id - Get a specific comment
router.get('/:id', commentController.getCommentById);

// PUT /api/comments/:id - Update a comment
router.put('/:id', commentController.putComment);

// PUT /api/comments/:id/likes - Update comment likes
router.put('/:id/likes', commentController.updateCommentLikes);

// DELETE /api/comments/:id - Delete a comment
router.delete('/:id', commentController.deleteComment);

// GET /api/comments/:id/replies - Get replies for a comment
router.get('/:id/replies', commentController.getRepliesByComment);

module.exports = router; 