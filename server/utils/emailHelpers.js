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
    const verificationUrl = `${process.env.FRONTEND_URL}/auth/verify-email/${verificationToken}`;
    
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
              background-color: #4CAF50; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              display: inline-block; 
              margin: 20px 0;
            }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>ジブリ掲示板へようこそ！</h2>
            <p>アカウント登録ありがとうございます。</p>
            <p>以下のボタンをクリックしてメールアドレスを確認してください：</p>
            <a href="${verificationUrl}" class="button">メールアドレスを確認</a>
            <p>または、以下のリンクをコピーしてブラウザのアドレスバーに貼り付けてください：</p>
            <p style="word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 3px;">${verificationUrl}</p>
            <div class="footer">
              <p><strong>重要：</strong></p>
              <ul>
                <li>このリンクは24時間有効です</li>
                <li>このメールに心当たりがない場合は、無視してください</li>
                <li>このメールには返信しないでください</li>
              </ul>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('メールの送信に失敗しました');
  }
};

module.exports = {
  sendVerificationEmail
};