// const crypto = require('crypto');
const nodemailer = require('nodemailer');

// メール送信設定
const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASSWORD
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: `"ジブリ掲示板" <${process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER}>`,
      to: email,
      subject: 'ジブリ掲示板 - メールアドレスの確認',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              background-color: #E5D7B8; 
              color: #4a3f26; 
              padding: 12px 24px; 
              text-decoration: none;
              border: 1px solid #D4C4A3;
              border-radius: 5px; 
              display: inline-block; 
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: #333;">ジブリ掲示板へようこそ！</h2>
            <p style="color: #333;">アカウント登録ありがとうございます。</p>
            <p style="margin: 0; color: #333;">以下のボタンをクリックしてメールアドレスを確認してください：</p>
            <a href="${verificationUrl}" class="button" style="color: #4a3f26">メールアドレスを確認</a>
            <p style="color: #333;">または以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてください：</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 3px; margin: 15px 0 0 0; color: #333;">${verificationUrl}</p>
            <div style="margin-top: 20px; font-size: 12px; color: #333;">
              <ul style="margin: 0; padding: 0; list-style-position: outside; color: #333;">
                <li style="color: #333;">このリンクは24時間有効です</li>
                <li style="color: #333;">メールに心当たりがない場合は、無視してください</li>
                <li style="color: #333;">このメールには返信しないでください</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error('メールの送信に失敗しました');
  }
};

const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: `"ジブリ掲示板" <${process.env.BREVO_FROM_EMAIL || process.env.BREVO_USER}>`,
      to: email,
      subject: 'ジブリ掲示板 - パスワードのリセット',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .button { 
              background-color: #E5D7B8; 
              color: #4a3f26; 
              padding: 12px 24px; 
              text-decoration: none;
              border: 1px solid #D4C4A3;
              border-radius: 5px; 
              display: inline-block; 
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2 style="color: #333;">パスワードのリセット</h2>
            <p style="color: #333;">以下のボタンをクリックして新しいパスワードを設定してください：</p>
            <a href="${resetUrl}" class="button" style="color: #4a3f26">パスワードをリセット</a>
            <p style="color: #333;">または以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてください：</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 3px; margin: 15px 0 0 0; color: #333;">${resetUrl}</p>
            <div style="margin-top: 20px; font-size: 12px; color: #333;">
              <ul style="margin: 0; padding: 0; list-style-position: outside; color: #333;">
                <li style="color: #333;">このリンクは24時間有効です</li>
                <li style="color: #333;">このパスワードリセットに心当たりがない場合は、無視してください</li>
                <li style="color: #333;">このメールには返信しないでください</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    throw new Error('パスワードリセットメールの送信に失敗しました');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};