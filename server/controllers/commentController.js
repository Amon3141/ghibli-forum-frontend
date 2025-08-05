/**
 * Comment controller for handling comment-related HTTP requests
 * @module controllers/commentController
 */

const commentModel = require('../models/commentModel');
const reactionController = require('./reactionController');
/**
 * Get all comments for a thread
 * @returns {Promise<void>} - Returns JSON array of comments
 * @throws {Error} Database error
 */
async function getCommentsByThread(req, res) {
  try {
    const { id: threadId } = req.params;
    const comments = await commentModel.findCommentsByThread(Number(threadId));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'コメント取得時にエラーが発生しました' });
  }
}

/**
 * Get all replies for a comment
 * @returns {Promise<void>} - Returns JSON array of replies
 * @throws {Error} Database error
 */
async function getRepliesByComment(req, res) {
  try {
    const { id: parentId } = req.params;
    const replies = await commentModel.findRepliesByComment(Number(parentId));
    res.json(replies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch replies' });
  }
}

/**
 * Get a specific comment by ID
 * @returns {Promise<void>} - Returns JSON of the requested comment or 404
 * @throws {Error} Database error or comment not found
 */
async function getCommentById(req, res) {
  try {
    const { id } = req.params;
    const comment = await commentModel.findCommentById(Number(id));
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
}

/**
 * Get all comments by a specific user
 * @returns {Promise<void>} - Returns JSON array of comments
 * @throws {Error} Database error
 */
async function getCommentsByUser(req, res) {
  try {
    const { id: userId } = req.params;
    const comments = await commentModel.findCommentsByAuthor(Number(userId));
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user comments' });
  }
}

/**
 * Create a new comment
 * @returns {Promise<void>} - Returns JSON of the created comment
 * @throws {Error} Database error or validation error
 */
async function postComment(req, res) {
  try {
    const { id: threadId } = req.params;
    const authorId = req.user.id;
    const { content, parentId, replyToId } = req.body;
    const comment = await commentModel.createComment({
      content,
      threadId: Number(threadId),
      authorId: Number(authorId),
      parentId: parentId ? Number(parentId) : null,
      replyToId: replyToId ? Number(replyToId) : null
    });
    res.status(201).json(comment);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid thread ID or author ID' });
    }
    res.status(500).json({ error: 'Failed to create comment' });
  }
}

/**
 * Update an existing comment
 * @returns {Promise<void>} - Returns JSON of the updated comment
 * @throws {Error} Database error or comment not found
 */
async function putComment(req, res) {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const comment = await commentModel.updateComment(Number(id), { content });
    res.json(comment);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: 'Failed to update comment' });
  }
}

/**
 * Delete a comment
 * @returns {Promise<void>} - Returns 204 No Content on success
 * @throws {Error} Database error or comment not found
 */
async function deleteComment(req, res) {
  try {
    const { id } = req.params;
    await commentModel.deleteComment(Number(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: 'Failed to delete comment' });
  }
}

async function updateCommentReaction(req, res) {
  reactionController.updateReaction('COMMENT', req, res);
}

module.exports = {
  getCommentsByThread,
  getRepliesByComment,
  getCommentById,
  getCommentsByUser,
  postComment,
  putComment,
  deleteComment,
  updateCommentReaction
}; 