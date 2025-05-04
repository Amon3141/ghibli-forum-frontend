const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');
const threadController = require('../controllers/threadController');

const { verifyToken, checkAdmin } = require('../middlewares/authMiddleware');

/* ----- Public routes ----- */

// GET /api/movies - Get all movies
router.get('/', movieController.getAllMovies);

// GET /api/movies/:id - Get a specific movie
router.get('/:id', movieController.getMovieById);

// GET /api/movies/:id/threads - Get all threads for a specific movie
router.get('/:id/threads', threadController.getThreadsByMovie);

/* ----- Protected routes ----- */

// PUT /api/movies/:id - Update a movie
router.put('/:id', verifyToken, movieController.putMovie);

// DELETE /api/movies/:id - Delete a movie
router.delete('/:id', verifyToken, movieController.deleteMovie);

// POST /api/movies/:id/threads - Create a new thread
router.post('/:id/threads', verifyToken, threadController.postThread);

/* ----- Admin routes ----- */

// POST /api/movies - Create a new movie
router.post('/', verifyToken, checkAdmin, movieController.postMovie);

module.exports = router;