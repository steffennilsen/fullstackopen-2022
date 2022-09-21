const { enforceJSONContentType } = require('#@/utils/middleware');
const express = require('express');
const Blog = require('#@/models/blog');
const User = require('#@/models/user');
const router = express.Router();

router.get('/', async (req, res) =>
  res.json(
    await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 }),
  ),
);
router.post('/', enforceJSONContentType, async (req, res) => {
  // temp set user to first in list
  const user = await User.findOne({});
  const blog = await new Blog({ ...req.body, user: user.id }).save();
  user.blogs.push(blog.id);
  await user.save();
  return res.status(201).json(blog);
});
router.all('/', async (req, res) => res.sendStatus(405));

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  return !!blog ? res.json(blog) : res.sendStatus(404);
});
router.put('/:id', enforceJSONContentType, async (req, res) => {
  // temp set user to first in list
  const user = await User.findOne({});
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { ...req.body, user: user.id },
    {
      new: true,
      upsert: true,
      runValidators: true,
    },
  );

  return !!blog
    ? blog.__v === 0
      ? res.status(201).json(blog)
      : res.json(blog)
    : res.sendStatus(404);
});
router.patch('/:id', enforceJSONContentType, async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  return !!blog ? res.json(blog) : res.sendStatus(404);
});
router.delete('/:id', async (req, res) => {
  const blog = await Blog.findByIdAndDelete(req.params.id, { new: true });
  return !!blog ? res.json(blog) : res.sendStatus(404);
});
router.all('/:id', async (req, res) => res.sendStatus(405));

module.exports = router;
