const prisma = require('../utils/PrismaClient');

async function getAllMovies() {
  return await prisma.movie.findMany();
}

async function createMovie(data) {
  return await prisma.movie.create({ data });
}

module.exports = {
  getAllMovies,
  createMovie
};