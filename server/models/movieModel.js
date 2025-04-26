const prisma = require('../utils/PrismaClient');

async function findAllMovies() {
  return await prisma.movie.findMany();
}

async function findMovieById(id) {
  return await prisma.movie.findUnique({ where: { id }});
}

async function createMovie(data) {
  return await prisma.movie.create({ data });
}

/* ----- 多分使わない ----- */

async function updateMovie(id, data) {
  return await prisma.movie.update({ where: { id }, data });
}

async function deleteMovie(id) {
  return await prisma.movie.delete({ where: { id }});
}

module.exports = {
  findAllMovies,
  findMovieById,
  createMovie,
  updateMovie,
  deleteMovie
};