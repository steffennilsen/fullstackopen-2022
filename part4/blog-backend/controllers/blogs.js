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
router.all('/:id', async (req, res) => res.sendStatus(405));

module.exports = router;
