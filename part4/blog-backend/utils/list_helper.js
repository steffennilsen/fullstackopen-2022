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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
