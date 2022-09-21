const express = require('express');
const {
  authJwt,
  enforceJSONContentType,
  userExtractor,
  userValidator,
} = require('#@/utils/middleware');
const Blog = require('#@/models/blog');

const router = express.Router();

router.get('/', async (req, res) =>
  res.json(
    await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 }),
  ),
);
router.post(
  '/',
  authJwt,
  userExtractor,
  userValidator,
  enforceJSONContentType,
  async (req, res) => {
    const user = req.user;
    const blog = await new Blog({ ...req.body, user: user.id }).save();
    user.blogs.push(blog.id);
    await user.save();
    return res.status(201).json(blog);
  },
);
router.all('/', async (req, res) => res.sendStatus(405));

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  });
  return !!blog ? res.json(blog) : res.sendStatus(404);
});
router.put(
  '/:id',
  authJwt,
  userExtractor,
  userValidator,
  enforceJSONContentType,
  async (req, res) => {
    const user = req.user;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, user: user.id },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    if (!blog) {
      res.sendStatus(404);
    }

    user.blogs.push(blog.id);
    await user.save();
    return blog.__v === 0 ? res.status(201).json(blog) : res.json(blog);
  },
);
router.patch(
  '/:id',
  authJwt,
  userExtractor,
  userValidator,
  enforceJSONContentType,
  async (req, res) => {
    const user = req.user;
    const blog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, user: user.id },
      {
        runValidators: true,
        new: true,
      },
    );
    return !!blog ? res.json(blog) : res.sendStatus(404);
  },
);
router.delete(
  '/:id',
  authJwt,
  userExtractor,
  userValidator,
  async (req, res) => {
    const user = req.user;
    let blog = await Blog.findById(req.params.id);

    if (!blog) return res.sendStatus(404);

    const ownerId = blog.user.toString();
    if (user.id !== ownerId) return res.sendStatus(401);

    blog = await blog.remove();

    return res.json(blog);
  },
);
router.all('/:id', async (req, res) => res.sendStatus(405));

module.exports = router;
