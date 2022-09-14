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

  return [...new Set(blogs.map((blog) => blog.author))]
    .map((author) => ({
      author,
      likes: 0,
    }))
    .map((counter) => ({
      author: counter.author,
      blogs: blogs.filter((blog) => blog.author === counter.author).length,
    }))
    .reduce((a, b) => (a.likes > b.likes ? a : b));
};
const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined;
  }

  return [...new Set(blogs.map((blog) => blog.author))]
    .map((author) => ({
      author,
      likes: 0,
    }))
    .map((counter) => ({
      author: counter.author,
      likes: blogs
        .filter((blog) => blog.author === counter.author)
        .reduce((a, b) => a + b.likes, 0),
    }))
    .reduce((a, b) => (a.likes > b.likes ? a : b));
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
