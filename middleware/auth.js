
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const bearerToken = token.split(' ')[1]; // Extract the token after 'Bearer'
    const decoded = jwt.verify(bearerToken, 'SECRET_KEY');
    req.userId = decoded.userId;
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
