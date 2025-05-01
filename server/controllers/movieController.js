/**
 * Movie controller for handling movie-related HTTP requests
 * @module controllers/movieController
 */

const movieModel = require('../models/movieModel');

/**
 * Get all movies
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>} - Returns JSON array of all movies
 * @throws {Error} Database error
 */
async function getAllMovies(req, res) {
  try {
    const movies = await movieModel.findAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
}

/**
 * Get a movie by its ID
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Movie ID
 * @returns {Promise<void>} - Returns JSON of the requested movie or 404
 * @throws {Error} Database error or movie not found
 */
async function getMovieById(req, res) {
  try {
    const { id } = req.params;
    const movie = await movieModel.findMovieById(Number(id));
    if (!movie) {
      return res.status(404).json({ error: '映画が見つかりません' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ error: '映画取得時にエラーが発生しました' });
  }
}

/**
 * Create a new movie
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.body - Request body
 * @param {string} req.body.title - Movie title
 * @param {string} req.body.director - Movie director
 * @param {string} req.body.releaseDate - Movie release date (YYYY-MM-DD)
 * @returns {Promise<void>} - Returns JSON of the created movie
 * @throws {Error} Database error or validation error
 */
async function postMovie(req, res) {
  try {
    const { title, director, releaseDate } = req.body;

    // check yyyy-mm-dd format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(releaseDate)) {
      return res.status(400).json({ error: '公開日は yyyy-mm-dd 形式で入力してください' });
    }

    // check valid date
    const date = new Date(releaseDate);
    if (isNaN(date.getTime())) {
      return res.status(400).json({ error: '無効な日付です' });
    }

    const movie = await movieModel.createMovie({ 
      title, 
      director, 
      releaseDate: new Date(releaseDate) 
    });
    res.status(201).json({ movie });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'すでに同じタイトルの映画が存在します' });
    }
    res.status(500).json({ error: '映画登録時にエラーが発生しました' });
  }
}

/**
 * Update an existing movie
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Movie ID
 * @param {Object} req.body - Request body
 * @param {string} [req.body.title] - Updated movie title
 * @param {string} [req.body.director] - Updated movie director
 * @param {string} [req.body.releaseDate] - Updated release date (YYYY-MM-DD)
 * @returns {Promise<void>} - Returns JSON of the updated movie
 * @throws {Error} Database error, movie not found, or validation error
 */
async function putMovie(req, res) {
  try {
    const { id } = req.params;
    const { title, director, releaseDate } = req.body;
    const movie = await movieModel.updateMovie(Number(id), { 
      title, 
      director, 
      releaseDate: releaseDate ? new Date(releaseDate) : undefined 
    });
    res.json(movie);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Movie title already exists' });
    }
    res.status(500).json({ error: 'Failed to update movie' });
}
}

/**
 * Delete a movie
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {Object} req.params - URL parameters
 * @param {string} req.params.id - Movie ID
 * @returns {Promise<void>} - Returns 204 No Content on success
 * @throws {Error} Database error or movie not found
 */
async function deleteMovie(req, res) {
  try {
  const { id } = req.params;
    await movieModel.deleteMovie(Number(id));
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Movie not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete movie with existing threads' });
    }
    res.status(500).json({ error: 'Failed to delete movie' });
  }
}

module.exports = {
  getAllMovies,
  postMovie,
  getMovieById,
  putMovie,
  deleteMovie
};