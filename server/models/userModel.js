/**
 * @typedef {Object} User
 * @property {number} id - The unique identifier of the user
 * @property {string} userId - The unique userId for the user
 * @property {string} username - The username
 * @property {string} password - The hashed password
 * @property {string} email - The user's email address
 * @property {Array<Comment>} comments - The user's comments
 * @property {Array<Thread>} threads - The threads created by the user
 */

const prisma = require('../utils/PrismaClient');

/**
 * User model operations
 * @module models/userModel
 */

/**
 * Finds a user by their ID
 * @async
 * @param {number} id - The ID of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 */
async function findUserById(id) {
  return await prisma.user.findUnique({ where: { id }});
}

/**
 * Finds a user by their userId
 * @async
 * @param {string} userId - The userId of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 */
async function findUserByUserId(userId) {
  return await prisma.user.findUnique({ where: { userId }});
}

/**
 * Creates a new user
 * @async
 * @param {Object} data - The user data
 * @param {string} data.userId - The unique userId for the user
 * @param {string} data.username - The username
 * @param {string} data.password - The user's password
 * @param {string} data.email - The user's email address
 * @returns {Promise<User>} Created user object
 */
async function createUser(data) {
  return await prisma.user.create({ data });
}

/**
 * Updates an existing user
 * @async
 * @param {number} id - The ID of the user to update
 * @param {Object} data - The update data
 * @param {string} [data.username] - The updated username
 * @param {string} [data.password] - The updated password
 * @param {string} [data.email] - The updated email
 * @returns {Promise<User>} Updated user object
 * @throws {Error} If user not found
 */
async function updateUser(id, data) {
  return await prisma.user.update({ where: { id }, data });
}

/**
 * Deletes a user
 * @async
 * @param {number} id - The ID of the user to delete
 * @returns {Promise<User>} Deleted user object
 * @throws {Error} If user not found
 */
async function deleteUser(id) {
  return await prisma.user.delete({ where: { id }});
}

const readOperations = {
  findUserById,
  findUserByUserId
};

const writeOperations = {
  createUser,
  updateUser,
  deleteUser
};

module.exports = {
  ...readOperations,
  ...writeOperations
};
