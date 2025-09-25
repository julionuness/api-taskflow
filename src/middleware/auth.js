const jwt = require('jsonwebtoken');
const { HTTP_STATUS } = require('../utils/constants');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      error: 'Token de acesso requerido'
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        error: 'Token inválido'
      });
    }
    req.user = user;
    next();
  });
};

module.exports = {
  authenticateToken
};