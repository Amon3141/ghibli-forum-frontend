/**
 * User controller for handling user-related HTTP requests
 * @module controllers/userController
 */

const userModel = require('../models/userModel');

/* ----- PUBLIC ROUTES ----- */

/**
 * Get a user by their public userId
 * @returns {Promise<void>} - Returns JSON of the requested user or 404
 * @throws {Error} Database error or user not found
 */
async function getUserByUserId(req, res) {
  try {
    const { id: userId } = req.params;
    const user = await userModel.findUserByUserId(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Don't send password in response
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

/**
 * Create a new user
 * @returns {Promise<void>} - Returns JSON of the created user
 * @throws {Error} Database error or validation error
 */
async function postUser(req, res) {
  try {
    const { userId, username, password, email } = req.body;
    const user = await userModel.createUser({
      userId,
      username,
      password,
      email,
      isAdmin: false
    });
    res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
}

/* ----- PROTECTED ROUTES ----- */

/**
 * Get the current user
 * @returns {Promise<void>} - Returns JSON of the current user
 */
const getCurrentUser = async (req, res) => {
  const user = await userModel.findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ user });
};

/**
 * Update an existing user
 * @returns {Promise<void>} - Returns JSON of the updated user
 * @throws {Error} Database error, user not found, or validation error
 */
async function putCurrentUser(req, res) {
  try {
    const updateInfo = req.body;
    const updatedUser = await userModel.updateUser(req.user.id, updateInfo);
    res.json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
}

/**
 * Delete a user
 * @returns {Promise<void>} - Returns 204 No Content on success
 * @throws {Error} Database error or user not found
 */
async function deleteCurrentUser(req, res) {
  try {
    await userModel.deleteUser(req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Cannot delete user with existing threads or comments' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

/* ----- ADMIN ROUTES ----- */

/**
 * Get all users (for admin use only)
 * @returns {Promise<void>} - Returns JSON of all users
 */
async function getAllUsers(req, res) {
  try {
    const users = await userModel.findAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

/**
 * Get a user by their database ID (for admin use only)
 * @returns {Promise<void>} - Returns JSON of the requested user or 404
 * @throws {Error} Database error or user not found
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;  // Database ID (numeric)
    const user = await userModel.findUserById(Number(id));
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

const publicRoutes = {
  getUserByUserId,
  postUser
};

const protectedRoutes = {
  getCurrentUser,
  putCurrentUser,
  deleteCurrentUser
};

const adminRoutes = {
  getUserById,
  getAllUsers
};

module.exports = {
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes
};