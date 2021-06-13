const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-token');
  if (!token)
    return res.status(401).send('Unauthorized access. Token not found');

  try {
    const payload = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = payload;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};
