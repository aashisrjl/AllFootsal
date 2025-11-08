// generate jwt token for user/admin/footsal
const jwt = require('jsonwebtoken');

const generateJwt = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

module.exports = generateJwt;