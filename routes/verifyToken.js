const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return next(createError(401, 'Access denied'));

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
  } catch (error) {
    return next(createError(403, 'token is invalid.'));
  }

  next();
};

module.exports = authenticateUser;
