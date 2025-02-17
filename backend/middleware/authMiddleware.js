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
  const authHeader = req.headers['authorization'];

  if (typeof authHeader !== 'undefined') {
    const token = authHeader && authHeader.split(' ')[1];
    console.log(token);
    if (!token) {
      return res.sendStatus(401);
    }

    const result = verifyAccessToken(token);

    if (!result.success) {
      return res.status(403).json({ error: result.error });
    }

    req.user = result.data;
    next();
  } else {
    //If header is undefined return Forbidden (403)
    res.sendStatus(403);
  }
}

module.exports = authenticateToken;
