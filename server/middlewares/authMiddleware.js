const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    console.log("No token")
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log("Token is valid")
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next()
  } catch (err) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    console.log("Token is invalid")
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

function checkAdmin(req, res, next) {
  if (req.user && req.user.isAdmin) {
    console.log("Admin is valid")
    return next();
  }
  console.log("Not admin")
  return res.status(403).json({ error: 'Forbidden: Admins only' });
};

module.exports = {
  verifyToken,
  checkAdmin
};