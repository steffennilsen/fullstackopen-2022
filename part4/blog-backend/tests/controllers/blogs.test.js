const app = require('#@/app');
const supertest = require('supertest');
const api = supertest(app);
const { createToken } = require('#@/utils/auth');

const {
  payloadBlog,
  blogsMultiple,
  expectCount,
  populateBlogs,
} = require('#@/tests/blogs.helper');
const { userList, populateUsers } = require('#@/tests/users.helper');
const Blog = require('#@/models/blog');
const db = require('#@/utils/mongoose');
const User = require('#@/models/user');

const PATH = '/api/blogs';
let blogIds = [];
let token;

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await db.clear();
  await populateUsers();

  const res = await populateBlogs();
  blogIds = Object.values(res.insertedIds).map((_) => _.valueOf());

  const { username, _id } = await User.findOne({});
  token = createToken({ username, id: _id });
});

afterEach(() => {
  blogIds = [];
  token;
});

afterAll(async () => {
  await db.disconnect();
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
      .set('Authorization', `bearer ${token}`)
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
    await api
      .post(PATH)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(400);
    await expectCount(blogsMultiple.length);
  });

  it('should not add if missing title', async () => {
    const { author, url, likes } = payloadBlog;
    const payload = { author, url, likes };

    await api
      .post(PATH)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(400);
    await expectCount(blogsMultiple.length);
  });

  it('should not add if missing url', async () => {
    const { title, author, likes } = payloadBlog;
    const payload = { title, author, likes };
    await api
      .post(PATH)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(400);
    await expectCount(blogsMultiple.length);
  });

  it('should set likes to 0 if missing', async () => {
    const { title, author, url } = payloadBlog;
    const payload = { title, author, url };
    const res = await api
      .post(PATH)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(201);
    const { likes } = res.body;

    expect(likes).toBeDefined();
    expect(likes).toEqual(0);
  });
});

describe(`GET ${PATH}/:id`, () => {
  it('should fetch valid id blog', async () => {
    const blogs = (await api.get(PATH).expect(200)).body;
    const expected = blogs[0];
    const { id } = expected;

    const res = await api.get(`${PATH}/${id}`).expect(200);
    expect(res.body).toEqual(expected);
    expect(res.body.user).toBeDefined();
  });

  it('should not find an invalid id', async () => {
    const id = '000000000000000000000000';
    const res = await api.get(`${PATH}/${id}`).expect(404);
    expect(res.body).toEqual({});
  });

  it('should reject invalid id scheme', async () => {
    const id = '0';
    const res = await api.get(`${PATH}/${id}`).expect(400);
    expect(res.body).toEqual({ error: 'malformatted id' });
  });
});

describe(`PUT ${PATH}/:id`, () => {
  it('should replace a valid blog', async () => {
    const blogs = (await api.get(PATH).expect(200)).body;
    const target = blogs[0];
    const { id, title, author, url, likes } = target;
    const expectedLikes = 40;
    const user = (await userList())[0]._id.toString();
    const expected = {
      id,
      title,
      author,
      url,
      likes: expectedLikes,
      user,
    };

    // sanity check
    expect(likes).not.toBe(expectedLikes);
    const payload = { title, author, url, likes: expectedLikes };

    const res = await api
      .put(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(200);
    expect(res.body).toEqual(expected);

    // make sure we didnt insert a new document instead of replacing
    await expectCount(blogsMultiple.length);
  });

  it('should insert document if no doc of id is found', async () => {
    const id = '000000000000000000000000';
    const { title, author, url, likes } = payloadBlog;
    const user = (await userList())[0]._id.toString();
    const expected = { id, title, author, url, likes, user };

    const res = await api
      .put(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send(payloadBlog)
      .expect(201);
    expect(res.body).toEqual(expected);
    await expectCount(blogsMultiple.length + 1);
  });

  it('should reject missing schema entries', async () => {
    const { id, author, url, likes } = payloadBlog;
    const payload = { author, url, likes }; // missing title

    await api
      .put(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send(payload)
      .expect(400);
    await expectCount(blogsMultiple.length);
  });

  it('should reject invalid id scheme', async () => {
    const id = '0';
    const res = await api
      .put(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send(payloadBlog)
      .expect(400);
    expect(res.body).toEqual({ error: 'malformatted id' });
    await expectCount(blogsMultiple.length);
  });
});

describe(`PATCH ${PATH}/:id`, () => {
  it('should modify an attribute of a document', async () => {
    const blogs = (await api.get(PATH).expect(200)).body;
    const target = blogs[0];
    const { id, title, author, url, likes } = target;
    const expectedLikes = 120;
    const user = (await userList())[0]._id.toString();
    const expected = { id, title, author, url, likes: expectedLikes, user };

    // sanity check
    expect(likes).not.toBe(expectedLikes);

    const res = await api
      .patch(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ likes: expectedLikes })
      .expect(200);
    expect(res.body).toEqual(expected);
    await expectCount(blogsMultiple.length);
  });

  it('should not find an invalid id', async () => {
    const id = '000000000000000000000000';
    const res = await api
      .patch(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ likes: 0 })
      .expect(404);
    expect(res.body).toEqual({});
  });

  it('should reject invalid id scheme', async () => {
    const id = '0';
    const res = await api
      .patch(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ likes: 0 })
      .expect(400);
    expect(res.body).toEqual({ error: 'malformatted id' });
  });
});

describe(`DELETE ${PATH}/:id`, () => {
  it('should delete a blog', async () => {
    const id = blogIds[0];
    await api
      .delete(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(200);
    await expectCount(blogsMultiple.length - 1);
  });

  it('should not find an invalid id', async () => {
    const id = '000000000000000000000000';
    await api
      .delete(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(404);
    await expectCount(blogsMultiple.length);
  });

  it('should reject invalid id scheme', async () => {
    const id = '0';
    await api
      .delete(`${PATH}/${id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(400);
    await expectCount(blogsMultiple.length);
  });

  it('should reject deleting a blog which isnt owned by the token', async () => {
    const users = await userList();
    expect(users.length).toBeGreaterThanOrEqual(2);

    const user = users[1];
    const otherToken = createToken({ username: user.username, id: user._id });
    const blogId = blogIds[0];

    await api
      .delete(`${PATH}/${blogId}`)
      .set('Authorization', `bearer ${otherToken}`)
      .expect(401);
    await expectCount(blogsMultiple.length);
  });
});
