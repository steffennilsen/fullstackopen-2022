const express = require('express');
const Blog = require('#@/models/blog');
const router = express.Router();

const getBlogs = async (req, res, next) => {
  const blogs = await Blog.find({}).catch((err) => next(err));
  return res.json(blogs);
};

const getBlog = async (req, res, next) => {
  return Blog.findById(req.params.id)
    .then((blog) => {
      if (!blog) {
        return res.sendStatus(404);
      }

      return res.json(blog);
    })
    .catch((err) => next(err));
};

const postBlog = async (req, res, next) => {
  const blog = new Blog(req.body);
  return blog
    .save()
    .then((savedBlog) => res.json(savedBlog))
    .catch((err) => next(err));
};

router.use('/:id', async (req, res, next) => {
  switch (req.method) {
    case 'GET':
      return getBlog(req, res, next);
    default:
      return res.sendStatus(405);
  }
});

router.use('/', async (req, res, next) => {
  switch (req.method) {
    case 'GET':
      return getBlogs(req, res, next);
    case 'POST':
      return postBlog(req, res, next);
    default:
      return res.sendStatus(405);
  }
});

module.exports = router;
