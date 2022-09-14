const _ = require('lodash');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0);
const favoriteBlog = (blogs) => {
  const blog = blogs.reduce((a, b) => (a.likes > b.likes ? a : b), blogs[0]);
  return blog
    ? {
      title: blog.title,
      author: blog.author,
      likes: blog.likes,
    }
    : blog;
};
const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  return Object.entries(_.countBy(blogs, (blog) => blog.author))
    .map((entry) => ({
      author: entry[0],
      blogs: entry[1],
    }))
    .reduce((a, b) => (a.blogs > b.blogs ? a : b), []);
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
