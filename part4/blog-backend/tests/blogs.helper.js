const Blog = require('#@/models/blog');
const { usersInDb } = require('#@/tests/users.helper');

const payloadBlog = {
  title: 'packetstorm',
  author: 'me',
  url: '127.0.01',
  likes: 255,
};

const blogsSingle = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
];

const blogsMultiple = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];

const populateBlogs = async () => {
  const user = (await usersInDb())[0];
  const entries = blogsMultiple.map((_) => ({ ..._, user: user.id }));
  return await Blog.collection.insertMany(entries);
};

const expectCount = async (expected) => {
  const blogCount = await Blog.countDocuments({});
  expect(blogCount).toBe(expected);
};

module.exports = {
  payloadBlog,
  blogsSingle,
  blogsMultiple,
  populateBlogs,
  expectCount,
};
