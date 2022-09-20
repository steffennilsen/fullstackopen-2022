const { enforceJSONContentType } = require('#@/utils/middleware');
const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('#@/models/user');

usersRouter.get('/', async (req, res) => {
  const users = await User.find({});
  return res.json(users);
});
usersRouter.post('/', enforceJSONContentType, async (res, req) => {
  const { username, name, password } = res.body;
  if (!password) return req.status(400).json({ error: 'missing password' });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await new User({
    username,
    name,
    passwordHash,
  }).save();

  return user ? req.status(201).json(user) : req.sendStatus(400);
});
usersRouter.all('/', async (res) => res.sendStatus(405));

module.exports = usersRouter;
