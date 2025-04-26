/**
 * @typedef {Object} Thread
 * @property {number} id - The unique identifier of the thread
 * @property {string} title - The title of the thread
 * @property {string} description - The description of the thread
 * @property {Date} createdAt - When the thread was created
 * @property {Date} [updatedAt] - When the thread was last updated
 * @property {number} likes - The number of likes
 * @property {number} movieId - The ID of the associated movie
 * @property {Movie} movie - The associated movie
 * @property {number} creatorId - The ID of the thread creator
 * @property {User} creator - The creator of the thread
 * @property {Array<Comment>} comments - The comments on this thread
 */

const prisma = require('../utils/PrismaClient');

/**
 * Thread model operations
 * @module models/threadModel
 */

/**
 * Retrieves all threads from the database
 * @async
 * @returns {Promise<Array<Thread>>} Array of thread objects
 */
async function findAllThreads() {
  return await prisma.thread.findMany({
    include: {
      creator: {
        select: {
          username: true,
          userId: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Finds a specific thread by its ID
 * @async
 * @param {number} id - The ID of the thread
 * @returns {Promise<Thread|null>} Thread object if found, null otherwise
 */
async function findThreadById(id) {
  return await prisma.thread.findUnique({
    where: { id },
    include: {
      creator: {
        select: {
          username: true,
          userId: true
        }
      },
      comments: true
    }
  });
}

/**
 * Retrieves all threads created by a specific user
 * @async
 * @param {number} userId - The ID of the user
 * @returns {Promise<Array<Thread>>} Array of thread objects
 */
async function findThreadsByUser(userId) {
  return await prisma.thread.findMany({
    where: { creatorId: userId },
    include: {
      creator: {
        select: {
          username: true,
          userId: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Retrieves all threads associated with a specific movie
 * @async
 * @param {number} movieId - The ID of the movie
 * @returns {Promise<Array<Thread>>} Array of thread objects
 */
async function findThreadsByMovie(movieId) {
  return await prisma.thread.findMany({
    where: { movieId },
    include: {
      creator: {
        select: {
          username: true,
          userId: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
}

/**
 * Creates a new thread
 * @async
 * @param {Object} data - The thread data
 * @param {string} data.title - The title of the thread
 * @param {string} data.description - The description of the thread
 * @param {number} data.movieId - The ID of the associated movie
 * @param {number} data.creatorId - The ID of the thread creator
 * @returns {Promise<Thread>} Created thread object
 */
async function createThread(data) {
  return await prisma.thread.create({ data });
}

/**
 * Updates an existing thread
 * @async
 * @param {number} id - The ID of the thread to update
 * @param {Object} data - The update data
 * @param {string} [data.title] - The updated title
 * @param {string} [data.description] - The updated description
 * @returns {Promise<Thread>} Updated thread object
 * @throws {Error} If thread not found
 */
async function updateThread(id, data) {
  return await prisma.thread.update({ where: { id }, data });
}

/**
 * Deletes a thread
 * @async
 * @param {number} id - The ID of the thread to delete
 * @returns {Promise<Thread>} Deleted thread object
 * @throws {Error} If thread not found
 */
async function deleteThread(id) {
  return await prisma.thread.delete({ where: { id }});
}

// Read operations
const readOperations = {
  findAllThreads,
  findThreadById,
  findThreadsByUser,
  findThreadsByMovie
};

// Write operations
const writeOperations = {
  createThread,
  updateThread,
  deleteThread
};

module.exports = {
  ...readOperations,
  ...writeOperations
};
