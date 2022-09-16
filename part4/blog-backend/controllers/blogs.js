const express = require('express');
const Blog = require('#@/models/blog');
const router = express.Router();

router.get('/', async (req, res) => res.json(await Blog.find({})));
router.post('/', async (req, res) => {
  const blog = await new Blog(req.body).save();
  return res.status(201).json(blog);
});
router.all('/', async (req, res) => res.sendStatus(405));

router.get('/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return !!blog ? res.json(blog) : res.sendStatus(404);
});
router.put('/:id', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    upsert: true,
  });
  return !!blog
    ? blog.__v === 0
      ? res.status(201).json(blog)
      : res.json(blog)
    : res.sendStatus(404);
});
router.patch('/:id', async (req, res) => {
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
