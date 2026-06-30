const jwt = require('jsonwebtoken');
const {SECRET_KEY} = require('../config/constants');

function authenticateJWT(req, res, next) {
  const token = req.cookies.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Не авторизован' });
  }
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.clearCookie('auth_token');
    return res.status(401).json({ error: 'Недействительный токен' });
  }
}

module.exports = {
    authenticateJWT
};