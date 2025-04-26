const { getAllMovies, createMovie } = require('../models/movieModel');

async function getMovies(req, res) {
  const movies = await getAllMovies();
  res.json(movies);
}

async function postMovie(req, res) {
  const { title, director, release_date } = req.body;
  const movie = await createMovie({ title, director, release_date: new Date(release_date) });
  res.status(201).json(movie);
}

module.exports = {
  getMovies,
  postMovie
};