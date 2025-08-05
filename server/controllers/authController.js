/**
 * Auth controller for handling authentication-related HTTP requests
 * @module controllers/authController
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
  const { userId, username, password, email } = req.body;

  if (!userId || !username || !password || !email) {
    return res.status(400).json({ error: '全ての項目を入力してください' });
  }

  if (userId.includes('@')) {
    return res.status(400).json({ error: 'ユーザーIDに@記号は使用できません' });
  }

  try {
    const existingUserWithUserId = await userModel.findUserByUserId(userId);
    if (existingUserWithUserId) {
      return res.status(400).json({ error: 'このユーザーIDは既に使われています' });
    }

    const existingUserWithEmail = await userModel.findUserByEmail(email);
    if (existingUserWithEmail) {
      return res.status(400).json({ error: 'このメールアドレスは既に使われています' });
    }
  } catch (err) {
    return res.status(500).json({ error: 'ユーザーIDまたはメールアドレスの確認中にエラーが発生しました' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser({
      userId, username, password: hashedPassword, email, isAdmin: false
    });
    return res.status(200).json({
      message: 'ユーザー登録が完了しました',
      user: newUser
    });
  } catch (err) {
    return res.status(500).json({ error: 'ユーザー登録中にエラーが発生しました' });
  }
};

const loginUser = async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ error: '全ての項目を入力してください' });
  }

  const isEmail = identifier.includes('@');

  const user = isEmail
    ? await userModel.findUserWithPasswordByEmail(identifier)
    : await userModel.findUserWithPasswordByUserId(identifier);
  
  if (!user) {
    return res.status(401).json({ error: 'ユーザーIDまたはパスワードが正しくありません' });
  }

  try {
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: 'ユーザーIDまたはパスワードが正しくありません' });
    }

    const tokenPayload = {
      id: user.id,
      isAdmin: user.isAdmin,
    }

    const token = jwt.sign(
      tokenPayload,
      secretKey,
      { expiresIn: '3h' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',       // CSRF protection
      maxAge: 3 * 60 * 60 * 1000    // 3 hour
    });

    return res.status(200).json({
      message: 'ログインに成功しました',
      user: tokenPayload
    })
  } catch (err) {
    return res.status(500).json({ error: 'ログイン中にエラーが発生しました' });
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  return res.status(200).json({ message: 'ログアウトしました' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser
};