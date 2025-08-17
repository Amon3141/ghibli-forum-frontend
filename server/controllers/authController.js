/**
 * Auth controller for handling authentication-related HTTP requests
 * @module controllers/authController
 */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userModel = require('../models/userModel');
const { sendVerificationEmail, sendPasswordResetEmail } = require('../utils/emailHelpers');

require('dotenv').config();

const secretKey = process.env.SECRET_KEY;

const registerUser = async (req, res) => {
  const { userId, username, password, email } = req.body;

  // ユーザー情報の入力形式チェック
  if (!userId || !username || !password || !email) {
    return res.status(400).json({ error: '全ての項目を入力してください' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ error: '無効なメールアドレスです' });
  }

  if (userId.includes('@')) {
    return res.status(400).json({ error: 'ユーザーIDに@記号は使用できません' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'パスワードは6文字以上で入力してください' });
  }

  // ユーザーIDとメールアドレスの重複チェック
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

    // メール確認用のトークンを生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間

    const newUser = await userModel.createUser({
      userId,
      username,
      password: hashedPassword,
      email,
      isAdmin: false,
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    try {
      await sendVerificationEmail(email, verificationToken);
    } catch (error) {
      return res.status(201).json({
        message: '確認メールの送信に失敗しました。少し後で再送信をお試しください。',
        user: newUser,
        emailSent: false
      });
    }

    return res.status(200).json({
      message: '送信されたメールから確認リンクをクリックしてアカウント登録を完了してください',
      user: newUser,
      emailSent: true
    });
  } catch (err) {
    return res.status(500).json({ error: 'アカウント登録中にエラーが発生しました' });
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

    // メールアドレス認証チェック
    if (!user.isEmailVerified) {
      return res.status(403).json({ 
        error: 'メールアドレスが認証されていません。送信されたメールから認証リンクをクリックしてください。',
        emailVerificationRequired: true,
        email: user.email
      });
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
      sameSite: 'strict',         // CSRF protection
      maxAge: 3 * 60 * 60 * 1000  // 3時間
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

const verifyEmail = async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: '確認トークンが必要です' });
  }

  try {
    const user = await userModel.findUserByVerificationToken(token);
    
    if (!user) {
      return res.status(400).json({ error: '無効な確認トークンです' });
    }

    if (new Date() > user.emailVerificationExpires) {
      return res.status(400).json({ error: '確認トークンの有効期限が切れています' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'メールアドレスは既に確認済みです' });
    }

    await userModel.updateUser(user.id, {
      isEmailVerified: true,
      emailVerificationToken: null,
      emailVerificationExpires: null
    });

    return res.status(200).json({
      message: 'メールアドレスの確認が完了しました。ログインできます。'
    });
  } catch (err) {
    return res.status(500).json({ error: 'メールアドレス確認中にエラーが発生しました' });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'メールアドレスが必要です' });
  }

  try {
    const user = await userModel.findUserByEmail(email);
    
    if (!user) {
      return res.status(404).json({ error: 'ユーザーが見つかりません' });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ error: 'メールアドレスは既に確認済みです' });
    }

    // 新しい確認トークンを生成
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await userModel.updateUser(user.id, {
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires
    });

    try {
      await sendVerificationEmail(email, verificationToken);
      return res.status(200).json({
        message: '確認メールを再送信しました'
      });
    } catch (emailError) {
      return res.status(500).json({ 
        error: '確認メールの再送信に失敗しました。少し後で再度お試しください。' 
      });
    }
  } catch (err) {
    return res.status(500).json({ error: '確認メール再送信中にエラーが発生しました' });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'メールアドレスが必要です' });
  }

  try {
    const user = await userModel.findUserByEmail(email);

    if (!user) {
      return res.status(200).json({ 
        message: 'パスワードリセットメールを送信しました'
      });
    }

    // リセットトークンを生成
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24時間

    await userModel.updateUser(user.id, {
      resetToken: resetToken,
      resetTokenExpires: resetExpires
    });

    try {
      await sendPasswordResetEmail(email, resetToken);
      return res.status(200).json({
        message: 'パスワードリセットメールを送信しました'
      });
    } catch (emailError) {
      return res.status(500).json({ 
        error: 'パスワードリセットメールの送信に失敗しました。少し後で再度お試しください。' 
      });
    }
  } catch (err) {
    return res.status(500).json({ error: 'パスワードリセットメールの送信中にエラーが発生しました' });
  }
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'トークンと新しいパスワードが必要です' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'パスワードは6文字以上である必要があります' });
  }

  try {
    const user = await userModel.findUserByResetToken(token);
    
    if (!user) {
      return res.status(400).json({ error: '無効または期限切れのリセットトークンです' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.updateUser(user.id, {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpires: null
    });

    return res.status(200).json({
      message: 'パスワードが正常に更新されました。新しいパスワードでログインしてください。'
    });
  } catch (err) {
    return res.status(500).json({ error: 'パスワードリセット中にエラーが発生しました' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  verifyEmail,
  resendVerificationEmail,
  requestPasswordReset,
  resetPassword
};