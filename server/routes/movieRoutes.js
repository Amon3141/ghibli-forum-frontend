const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const threadController = require('../controllers/threadController');

const threadRoutes = require('./threadRoutes');

/* ----- Basic routes ----- */

// GET /api/movies - Get all movies
router.get('/', movieController.getAllMovies);

// GET /api/movies/:id - Get a specific movie
router.get('/:id', movieController.getMovieById);

// POST /api/movies - Create a new movie
router.post('/', movieController.postMovie);

// PUT /api/movies/:id - Update a movie
router.put('/:id', movieController.putMovie);

// DELETE /api/movies/:id - Delete a movie
router.delete('/:id', movieController.deleteMovie);

/* ----- Thread-related routes ----- */

// GET /api/movies/:id/threads - Get all threads for a specific movie
router.get('/:id/threads', threadController.getThreadsByMovie);

// POST /api/movies/:id/threads - Create a new thread
router.post('/:id/threads', threadController.postThread);

module.exports = router;