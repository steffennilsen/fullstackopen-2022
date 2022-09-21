const { SECRET } = require('#@/utils/config');
const jwt = require('jsonwebtoken');

const createToken = ({ username, id }) =>
  jwt.sign(
    {
      username,
      id,
    },
    SECRET,
    {
      expiresIn: 60 * 60,
    },
  );

const decodeToken = (token) => jwt.verify(token, SECRET);

module.exports = { createToken, decodeToken };
