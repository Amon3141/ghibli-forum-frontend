/**
 * @typedef {Object} Reaction
 * @property {number} id - The unique identifier of the reaction
 * @property {string} type - The type of reaction (LIKE, LOVE, LAUGH, ANGRY, SAD)
 * @property {string} reactableType - The type of content being reacted to (COMMENT, THREAD)
 * @property {Date} createdAt - When the reaction was created
 * @property {number} userId - The ID of the user who made the reaction
 * @property {User} user - The user who made the reaction
 * @property {number} [commentId] - The ID of the comment (if reacting to comment)
 * @property {Comment} [comment] - The comment being reacted to
 * @property {number} [threadId] - The ID of the thread (if reacting to thread)
 * @property {Thread} [thread] - The thread being reacted to
 */

const prisma = require('../utils/PrismaClient');

/**
 * Reaction model operations
 * @module models/reactionModel
 */

/**
 * Creates a new reaction for a reactable item
 * @async
 * @param {string} reactableType - The type of content ("COMMENT" or "THREAD")
 * @param {number} id - The ID of the reactable item
 * @param {number} userId - The ID of the user making the reaction
 * @param {string} reactionType - The type of reaction (LIKE, LOVE, LAUGH, ANGRY, SAD)
 * @returns {Promise<Reaction>} Created reaction object
 * @throws {Error} If reaction already exists or invalid parameters
 */
async function createReaction(reactableType, id, userId, reactionType) {
  const reactionData = {
    type: reactionType.toUpperCase(),
    reactableType: reactableType,
    userId: userId
  };

  if (reactableType === 'COMMENT') {
    reactionData.commentId = id;
  } else if (reactableType === 'THREAD') {
    reactionData.threadId = id;
  } else {
    throw new Error(`Invalid reactable type: ${reactableType}`);
  }

  return await prisma.reaction.create({
    data: reactionData,
    include: {
      user: {
        select: {
          username: true,
          userId: true
        }
      }
    }
  });
}

/**
 * Removes a reaction from a reactable item
 * @async
 * @param {string} reactableType - The type of content ("COMMENT" or "THREAD")
 * @param {number} id - The ID of the reactable item
 * @param {number} userId - The ID of the user removing the reaction
 * @returns {Promise<Reaction>} Deleted reaction object
 * @throws {Error} If reaction not found
 */
async function removeReaction(reactableType, id, userId) {
  const whereClause = {
    userId: userId
  };

  if (reactableType === 'COMMENT') {
    whereClause.commentId = id;
  } else if (reactableType === 'THREAD') {
    whereClause.threadId = id;
  } else {
    throw new Error(`Invalid reactable type: ${reactableType}`);
  }

  return await prisma.reaction.delete({
    where: whereClause,
    include: {
      user: {
        select: {
          username: true,
          userId: true
        }
      }
    }
  });
}

/**
 * Updates an existing reaction for a reactable item
 * @async
 * @param {string} reactableType - The type of content ("COMMENT" or "THREAD")
 * @param {number} id - The ID of the reactable item
 * @param {number} userId - The ID of the user updating the reaction
 * @param {string} reactionType - The new type of reaction (LIKE, LOVE, LAUGH, ANGRY, SAD)
 * @returns {Promise<Reaction>} Updated reaction object
 * @throws {Error} If reaction not found
 */
async function updateReaction(reactableType, id, userId, reactionType) {
  const whereClause = {
    userId: userId
  };

  // Add the appropriate foreign key condition based on reactable type
  if (reactableType === 'COMMENT') {
    whereClause.commentId = id;
  } else if (reactableType === 'THREAD') {
    whereClause.threadId = id;
  } else {
    throw new Error(`Invalid reactable type: ${reactableType}`);
  }

  return await prisma.reaction.update({
    where: whereClause,
    data: {
      type: reactionType.toUpperCase()
    },
    include: {
      user: {
        select: {
          username: true,
          userId: true
        }
      }
    }
  });
}

// --------- Reraction-related ---------

const reactionInclude = {
  include: {
    user: {
      select: {
        username: true,
        userId: true
      }
    }
  },
  orderBy: { createdAt: 'desc' }
}

const commentInclude = {
  include: {
    author: true,
    parent: {
      include: {
        author: true
      }
    },
    thread: {
      select: {
        id: true,
        title: true,
        movie: {
          select: {
            id: true,
            title: true
          }
        }
      }
    },
    reactions: reactionInclude
  }
}

const threadInclude = {
  include: {
    movie: {
      select: {
        id: true,
        title: true
      }
    },
    reactions: reactionInclude
  }
}

/**
 * Retrieves all reactions made by a specific user for a given reactable type
 * @async
 * @param {number} userId - The ID of the user
 * @param {string} reactableType - The reactable type ("COMMENT" or "THREAD")
 * @returns {Promise<Array<Comment|Thread>>} Array of comment or thread objects
 */
async function findReactionsByUserAndReactable(userId, reactableType) {
  const reactions = await prisma.reaction.findMany({
    where: { 
      userId,
      reactableType 
    },
    include: {
      comment: reactableType === 'COMMENT' ? commentInclude : undefined,
      thread: reactableType === 'THREAD' ? threadInclude : undefined
    },
    orderBy: { createdAt: 'desc' }
  });

  return reactions;
}

// Read operations
const readOperations = {
  findReactionsByUserAndReactable,
  getReactionCounts
};

// Write operations
const writeOperations = {
  createReaction,
  removeReaction,
  updateReaction
};

module.exports = {
  ...readOperations,
  ...writeOperations
};
