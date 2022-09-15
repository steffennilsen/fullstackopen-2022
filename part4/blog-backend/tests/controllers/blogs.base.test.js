const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('#@/models/blog');
const app = require('#@/app');
const api = supertest(app);
const { blogsMultiple } = require('#@/tests/blogs.helper');

const PATH = '/api/blogs';

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.collection.insertMany(blogsMultiple);
});

afterAll(() => {
  mongoose.connection.close();
});

describe(`GET ${PATH}`, () => {
  it('should return all blogs as json', async () =>
    await api
      .get(PATH)
      .expect(200)
      .expect('Content-Type', /application\/json/));

  it('should contain a specific blog', async () => {
    const expected = blogsMultiple[0].title;
    const titles = (await api.get(PATH)).body.map((_) => _.title);
    expect(titles).toContain(expected);
  });

  it('should return all blogs', async () => {
    const expected = blogsMultiple.length;
    const blogs = (await api.get(PATH)).body;
    expect(blogs.length).toBe(expected);
  });

  it('should transform _id to id', async () => {
    const blog = (await api.get(PATH)).body[0];
    expect(blog.id).toBeDefined();
    expect(blog._id).not.toBeDefined();
  });
});

describe(`POST ${PATH}`, () => {
  it('should add a valid blog', async () => {
    const payload = {
      title: 'packetstorm',
      author: 'me',
      url: '10.0.0.1',
      likes: 255,
    };

    const res = await api
      .post(PATH)
      .send(payload)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const body = res.body;
    const { title, author, url, likes } = body;
    const resBlog = { title, author, url, likes };
    expect(resBlog).toEqual(payload);

    const blogs = await Blog.find({});
    expect(blogs.length).toBe(blogsMultiple.length + 1);
    expect(blogs.map((_) => _.title)).toContain(payload.title);
  });

  it('should not add an empty blog', async () => {
    await api.post(PATH).send({}).expect(400);
    const blogCount = await Blog.countDocuments({});
    expect(blogCount).toBe(blogsMultiple.length);
  });

  it('should not add an invalid blog', async () => {
    await api.post(PATH).send({ title: 'missing entries' }).expect(400);
    const blogCount = await Blog.countDocuments({});
    expect(blogCount).toBe(blogsMultiple.length);
  });

  it('should set likes to 0 if missing', async () => {
    const res = await api
      .post(PATH)
      .send({ title: 'packetstorm', author: 'me', url: '127.0.01' })
      .expect(201);

    const { likes } = res.body;
    expect(likes).toBeDefined();
    expect(likes).toEqual(0);
  });
});
