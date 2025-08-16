/**
 * @typedef {Object} Movie
 * @property {number} id - The unique identifier of the movie
 * @property {string} title - The title of the movie
 * @property {string} director - The director of the movie
 * @property {Date} releaseDate - The release date of the movie
 * @property {Array<Thread>} threads - The threads associated with the movie
 */

const prisma = require('../utils/PrismaClient');

/**
 * Movie model operations
 * @module models/movieModel
 */

/**
 * Retrieves all movies from the database
 * @async
 * @returns {Promise<Array<Movie>>} Array of movie objects
 */
async function findAllMovies() {
  return await prisma.movie.findMany({
    include: {
      _count: {
        select: {
          threads: true
        }
      }
    },
    orderBy: {
      releaseDate: 'asc'
    }
  });
}

/**
 * Finds a specific movie by its ID
 * @async
 * @param {number} id - The ID of the movie
 * @returns {Promise<Movie|null>} Movie object if found, null otherwise
 */
async function findMovieById(id) {
  return await prisma.movie.findUnique({
    where: { id },
    include: {
      threads: {
        include: {
          creator: {
            select: {
              username: true,
              userId: true
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }
    }
  });
}

/**
 * Creates a new movie
 * @async
 * @param {Object} data - The movie data
 * @param {string} data.title - The title of the movie
 * @param {string} data.director - The director of the movie
 * @param {Date} data.releaseDate - The release date of the movie
 * @param {string} [data.imagePath] - The image path of the movie
 * @returns {Promise<{movie: Movie, isNewlyCreated: boolean}>} Object containing created/existing movie and whether it was newly created
 * @throws {Error} If title already exists (due to @unique constraint)
 */
async function createMovie(data) {
  return await prisma.movie.create({ data });
}

/**
 * Updates an existing movie
 * @async
 * @param {number} id - The ID of the movie to update
 * @param {Object} data - The update data
 * @param {string} [data.title] - The updated title
 * @param {string} [data.director] - The updated director
 * @param {Date} [data.releaseDate] - The updated release date
 * @param {string} [data.imagePath] - The updated image path
 * @returns {Promise<Movie>} Updated movie object
 * @throws {Error} If movie not found or if new title conflicts with existing one
 */
async function updateMovie(id, data) {
  return await prisma.movie.update({ where: { id }, data });
}

/**
 * Deletes a movie
 * @async
 * @param {number} id - The ID of the movie to delete
 * @returns {Promise<Movie>} Deleted movie object
 * @throws {Error} If movie not found or if there are associated threads
 */
async function deleteMovie(id) {
  return await prisma.movie.delete({ where: { id }});
}

// Read operations
const readOperations = {
  findAllMovies,
  findMovieById
};

// Write operations
const writeOperations = {
  createMovie,
  updateMovie,
  deleteMovie
};

module.exports = {
  ...readOperations,
  ...writeOperations
};