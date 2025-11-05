const jwt = require('jsonwebtoken');

const generateToken = (id, role, expiresIn='1h') => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn });
};

module.exports = { generateToken };
