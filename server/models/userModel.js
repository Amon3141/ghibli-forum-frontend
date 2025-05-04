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
const secureSelection = {
  id: true,
  userId: true,
  username: true,
  email: true,
  isAdmin: true
};

/**
 * User model operations
 * @module models/userModel
 */

/* ----- Password is included ----- */

/**
 * Finds a user with their password by their userId
 * @async
 * @param {string} userId - The userId of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 * PASSWORD IS INCLUDED
 */
async function findUserWithPasswordByUserId(userId) {
  return await prisma.user.findUnique({ 
    where: { userId },
    select: {
      ...secureSelection,
      password: true
    }
  });
}

/**
 * Finds a user with their password by their email
 * @async
 * @param {string} email - The email of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 * PASSWORD IS INCLUDED
 */
async function findUserWithPasswordByEmail(email) {
  return await prisma.user.findUnique({ 
    where: { email },
    select: {
      ...secureSelection,
      password: true
    }
  });
}

/* ----- Password is not included ----- */

/**
 * Finds all users
 * @async
 * @returns {Promise<Array<User>>} Array of user objects
 * PASSWORD IS NOT INCLUDED
 */
async function findAllUsers() {
  return await prisma.user.findMany({
    select: secureSelection
  });
}

/**
 * Finds a user by their ID
 * @async
 * @param {number} id - The ID of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 * PASSWORD IS NOT INCLUDED
 */
async function findUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    select: secureSelection
  });
}

/**
 * Finds a user by their userId
 * @async
 * @param {string} userId - The userId of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 * PASSWORD IS NOT INCLUDED
 */
async function findUserByUserId(userId) {
  return await prisma.user.findUnique({
    where: { userId },
    select: secureSelection
  });
}

/**
 * Finds a user by their email
 * @async
 * @param {string} email - The email of the user
 * @returns {Promise<User|null>} User object if found, null otherwise
 * PASSWORD IS NOT INCLUDED
 */
async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
    select: secureSelection
  });
}

/**
 * Creates a new user
 * @async
 * @param {Object} data - The user data
 * @param {string} data.userId - The unique userId for the user
 * @param {string} data.username - The username
 * @param {string} data.password - The user's password
 * @param {string} data.email - The user's email address
 * @param {boolean} data.isAdmin - Whether the user is an admin
 * @returns {Promise<User>} Created user object
 * PASSWORD IS NOT INCLUDED
 */
async function createUser(data) {
  return await prisma.user.create({
    data,
    select: secureSelection
  });
}

/**
 * Updates an existing user
 * @async
 * @param {number} id - The ID of the user to update
 * @param {Object} data - The update data
 * @param {string} [data.username] - The updated username
 * @param {string} [data.password] - The updated password
 * @param {string} [data.email] - The updated email
 * @param {boolean} [data.isAdmin] - Whether the user is an admin
 * @returns {Promise<User>} Updated user object
 * @throws {Error} If user not found
 * PASSWORD IS NOT INCLUDED
 */
async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data,
    select: secureSelection
  });
}

/**
 * Deletes a user
 * @async
 * @param {number} id - The ID of the user to delete
 * @returns {Promise<User>} Deleted user object
 * @throws {Error} If user not found
 * PASSWORD IS NOT INCLUDED
 */
async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id },
    select: secureSelection
  });
}

const readOperations = {
  findAllUsers,
  findUserWithPasswordByUserId,
  findUserWithPasswordByEmail,
  findUserById,
  findUserByUserId,
  findUserByEmail
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
