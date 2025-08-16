/**
 * Reaction controller for handling reaction-related HTTP requests
 * @module controllers/reactionController
 */

const reactionModel = require('../models/reactionModel');

/**
 * Get all comments that a user has reacted to
 * @returns {Promise<void>} - Returns JSON array of comments the user has reacted to
 * @throws {Error} Database error
 */
async function getReactedCommentsByUser(req, res) {
  try {
    const { id } = req.params;
    const reactions = await reactionModel.findReactionsByUserAndReactableType(Number(id), 'COMMENT');
    
    // Extract just the comment data from the reactions
    const comments = reactions.map(reaction => reaction.comment);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching reacted comments:', error);
    res.status(500).json({ error: 'Failed to fetch reacted comments' });
  }
}

/**
 * Update reactions for a reactable (create, update, or remove)
 * // body.reactionType === current reactionType -> remove reaction
 * // otherwise, change reaction
 * @returns {Promise<void>} - Returns JSON of the reaction operation result
 * @throws {Error} Database error
 */
async function updateReaction(reactableType, req, res) {
  try {
    const { id: reactableId } = req.params;
    const { reactionType } = req.body;
    const userId = req.user.id;

    // Check if user already has a reaction on this comment
    const existingReaction = await reactionModel.findReactionsByUserAndReactableType(userId, reactableType);
    const userReaction = existingReaction.find(reaction => {
      if (reactableType === 'COMMENT') {
        return reaction.comment && reaction.comment.id === Number(reactableId);
      } else if (reactableType === 'THREAD') {
        return reaction.thread && reaction.thread.id === Number(reactableId);
      }
      return false;
    });

    let result;

    if (!reactionType) {
      res.status(400).json({ error: 'Reaction type is required' });
    } else if (userReaction) {
      // Update existing reaction
      if (userReaction.type === reactionType) {
        result = await reactionModel.removeReaction(reactableType, Number(reactableId), userId);
        res.json({ message: 'Reaction removed', reaction: result });
      } else {
        result = await reactionModel.updateReaction(reactableType, Number(reactableId), userId, reactionType.toUpperCase());
        res.json({ message: 'Reaction updated', reaction: result });
      }
    } else {
      // Create new reaction
      result = await reactionModel.createReaction(reactableType, Number(reactableId), userId, reactionType.toUpperCase());
      res.status(201).json({ message: 'Reaction created', reaction: result });
    }

  } catch (error) {
    console.error(`Error updating ${reactableType} reaction:`, error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: `${reactableType} not found` });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Reaction already exists' });
    }
    res.status(500).json({ error: 'Failed to update reaction' });
  }
}

module.exports = {
  getReactedCommentsByUser,
  updateReaction
};
