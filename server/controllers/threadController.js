/**
 * Thread controller for handling thread-related HTTP requests
 * @module controllers/threadController
 */

const threadModel = require('../models/threadModel');
const reactionController = require('./reactionController');

/**
 * Get all threads
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - Returns JSON array of all threads
 * @throws {Error} Database error
 */
async function getAllThreads(req, res) {
  try {
    const threads = await threadModel.findAllThreads();
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
}

/**
 * Get a thread by its ID
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Thread ID
 * @returns {Promise<void>} - Returns JSON of the requested thread or 404
 * @throws {Error} Database error or thread not found
 */
async function getThreadById(req, res) {
  try {
    const { id } = req.params;
    const thread = await threadModel.findThreadById(Number(id));
    if (!thread) {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.json(thread);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
}

/**
 * Get all threads by a specific user
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - User ID
 * @returns {Promise<void>} - Returns JSON array of threads
 * @throws {Error} Database error
 */
async function getThreadsByUser(req, res) {
  try {
    const { id: userId } = req.params;
    const threads = await threadModel.findThreadsByUser(Number(userId));
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user threads' });
  }
}

/**
 * Get all threads for a specific movie
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Movie ID
 * @returns {Promise<void>} - Returns JSON array of threads
 * @throws {Error} Database error
 */
async function getThreadsByMovie(req, res) {
  try {
    const { id: movieId } = req.params;
    const threads = await threadModel.findThreadsByMovie(Number(movieId));
    res.json(threads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movie threads' });
  }
}

/**
 * Create a new thread
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Thread title
 * @param {string} req.body.description - Thread description
 * @param {number} req.body.movieId - Associated movie ID
 * @param {number} req.body.creatorId - Creator's user ID
 * @returns {Promise<void>} - Returns JSON of the created thread
 * @throws {Error} Database error or validation error
 */
async function postThread(req, res) {
  try {
    const { id: movieId } = req.params;
    const creatorId = req.user.id; // TODO: get creatorId from req.user.id, which should be setup by the auth middleware
    const { title, description } = req.body;

    const thread = await threadModel.createThread({
      title,
      description,
      movieId: Number(movieId),
      creatorId: Number(creatorId)
    });
    res.status(201).json(thread);
  } catch (error) {
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid movie ID or creator ID' });
    }
    res.status(500).json({ error: 'Failed to create thread' });
  }
}

/**
 * Update an existing thread
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Thread ID
 * @param {Object} req.body - Request body
 * @param {string} [req.body.title] - Updated title
 * @param {string} [req.body.description] - Updated description
 * @returns {Promise<void>} - Returns JSON of the updated thread
 * @throws {Error} Database error or thread not found
 */
async function putThread(req, res) {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const thread = await threadModel.updateThread(Number(id), {
      title,
      description,
      updatedAt: new Date()
    });
    res.json(thread);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.status(500).json({ error: 'Failed to update thread' });
  }
}

/**
 * Delete a thread
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Thread ID
 * @returns {Promise<void>} - Returns 204 No Content on success
 * @throws {Error} Database error or thread not found
 */
async function deleteThread(req, res) {
  try {
    const { id } = req.params;
    await threadModel.deleteThread(Number(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Thread not found' });
    }
    res.status(500).json({ error: 'Failed to delete thread' });
  }
}

async function updateThreadReaction(req, res) {
  reactionController.updateReaction('THREAD', req, res);
}

module.exports = {
  getAllThreads,
  getThreadById,
  getThreadsByUser,
  getThreadsByMovie,
  postThread,
  putThread,
  deleteThread,
  updateThreadReaction
}; 