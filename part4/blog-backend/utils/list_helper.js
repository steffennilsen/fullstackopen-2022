const dummy = (blogs) => 1;
const totalLikes = (blogs) => blogs.reduce((a, b) => a + b.likes, 0);

module.exports = {
  dummy,
  totalLikes,
};
