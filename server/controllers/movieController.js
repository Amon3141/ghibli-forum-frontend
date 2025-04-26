const movieModel = require('../models/movieModel');

async function getMovies(req, res) {
  const movies = await movieModel.getAllMovies();
  res.json(movies);
}

async function getMovieById(req, res) {
  const { id } = req.params;
  const movie = await movieModel.getMovieById(id);
  res.json(movie);
}

async function postMovie(req, res) {
  const { title, director, release_date } = req.body;
  const movie = await movieModel.createMovie({ title, director, release_date: new Date(release_date) });
  res.status(201).json(movie);
}

async function putMovie(req, res) {
  const { id } = req.params;
  const { title, director, release_date } = req.body;
  const movie = await movieModel.updateMovie(id, { title, director, release_date: new Date(release_date) });
  res.json(movie);
}

async function deleteMovie(req, res) {
  const { id } = req.params;
  await movieModel.deleteMovie(id);
  res.status(204).send();
}

module.exports = {
  getMovies,
  postMovie,
  getMovieById,
  putMovie,
  deleteMovie
};