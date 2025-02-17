const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const jwt_secret = process.env.JWT_SECRET;

function verifyAccessToken(token) {
  try {
    const decoded = jwt.verify(token, jwt_secret);
    return { success: true, data: decoded };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (typeof token !== 'undefined') {
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
  } else {
    return res.status(403).json({ message: 'Forbidden' }); // token is undefined
  }
}

module.exports = authenticateToken;
