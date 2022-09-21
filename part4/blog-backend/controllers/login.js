const { SECRET } = require('#@/utils/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const loginRouter = require('express').Router();
const User = require('../models/user');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body;

  const user = await User.findOne({ username });
  const passwordCorrect = !user
    ? false
    : await bcrypt.compare(password, user.passwordHash);

  if (!(user && passwordCorrect))
    return response.status(401).json({
      error: 'invalid username or password',
    });

  const token = jwt.sign(
    {
      username: user.username,
      id: user._id,
    },
    SECRET,
    {
      expiresIn: 60 * 60,
    },
  );

  response
    .status(200)
    .send({ token, username: user.username, name: user.name });
});
loginRouter.all('/', async (req, res) => res.sendStatus(405));

module.exports = loginRouter;
