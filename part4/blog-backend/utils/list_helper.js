const { NODE_ENV } = require('./config');

// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => 1;

const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0);

const emptyBlogListHandler = (blogs, callback) =>
  blogs.length === 0 ? undefined : callback(blogs);

const favoriteBlog = (blogs) =>
  emptyBlogListHandler(
    blogs,
    (blogs) =>
      [blogs.reduce((a, b) => (a.likes > b.likes ? a : b))].map(
        ({ title, author, likes }) => ({ title, author, likes }),
      )[0],
  );

const mostBlogs = (blogs) =>
  emptyBlogListHandler(blogs, (blogs) =>
    [...new Set(blogs.map((blog) => blog.author))]
      .map((author) => ({
        author,
        blogs: blogs.filter((blog) => blog.author === author).length,
      }))
      .reduce((a, b) => (a.blogs > b.blogs ? a : b)),
  );

const mostLikes = (blogs) =>
  emptyBlogListHandler(blogs, (blogs) =>
    [...new Set(blogs.map((blog) => blog.author))]
      .map((author) => ({
        author,
        likes: blogs
          .filter((blog) => blog.author === author)
          .reduce((a, b) => a + b.likes, 0),
      }))
      .reduce((a, b) => (a.likes > b.likes ? a : b)),
  );

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};

if (NODE_ENV === 'test') {
  module.exports = {
    ...module.exports,
    ...{
      emptyBlogListHandler,
    },
  };
}
