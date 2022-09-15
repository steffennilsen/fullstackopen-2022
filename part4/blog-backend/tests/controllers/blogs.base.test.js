const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('#@/models/blog');
const app = require('#@/app');
const api = supertest(app);
const {
  payloadBlog,
  blogsMultiple,
  postPayloadExpectCount,
} = require('#@/tests/blogs.helper');

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
    const res = await api
      .post(PATH)
      .send(payloadBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const body = res.body;
    const { title, author, url, likes } = body;
    const payload = { title, author, url, likes };
    expect(payload).toEqual(payloadBlog);

    const blogs = await Blog.find({});
    expect(blogs.length).toBe(blogsMultiple.length + 1);
    expect(blogs.map((_) => _.title)).toContain(payloadBlog.title);
  });

  it('should not add an empty blog', async () => {
    const payload = {};
    await postPayloadExpectCount({
      path: PATH,
      payload,
      expected: blogsMultiple.length,
      model: Blog,
      api,
      status: 400,
    });
  });

  it('should not add if missing title', async () => {
    const { author, url, likes } = payloadBlog;
    const payload = { author, url, likes };

    await postPayloadExpectCount({
      path: PATH,
      payload,
      expected: blogsMultiple.length,
      model: Blog,
      api,
      status: 400,
    });
  });

  it('should not add if missing url', async () => {
    const { title, author, likes } = payloadBlog;
    const payload = { title, author, likes };
    await postPayloadExpectCount({
      path: PATH,
      payload,
      expected: blogsMultiple.length,
      model: Blog,
      api,
      status: 400,
    });
  });

  it('should set likes to 0 if missing', async () => {
    const { title, author, url } = payloadBlog;
    const payload = { title, author, url };
    const res = await api.post(PATH).send(payload).expect(201);
    const { likes } = res.body;

    expect(likes).toBeDefined();
    expect(likes).toEqual(0);
  });
});
