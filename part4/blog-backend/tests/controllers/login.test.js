const app = require('#@/app');
const supertest = require('supertest');
const api = supertest(app);

const {
  userEntries,
  userList,
  expectCount,
  populateUsers,
  usersInDb,
} = require('#@/tests/users.helper');
const db = require('#@/utils/mongoose');

const PATH = '/api/login';

beforeAll(async () => {
  await db.connect();
});

beforeEach(async () => {
  await db.clear();
  await populateUsers();
});

afterEach(() => {});

afterAll(async () => {
  await db.disconnect();
});

describe(`POST ${PATH}`, () => {
  it('should return a token on valid auth', async () => {
    const { username, password } = userEntries[0];
    const credentials = { username, password };

    const res = await api
      .post(PATH)
      .send(credentials)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.body.token).toBeDefined();
  });

  it('should reject an invalid auth', async () => {
    const res = await api.post(PATH).expect(401);
    expect(res.body.token).not.toBeDefined();
  });

  it('should reject an invalid password', async () => {
    const { username, password } = userEntries[0];
    const wrongPassword = 'breakaleg';
    // sanitycheck
    expect(password).not.toEqual(wrongPassword);
    const credentials = { username, password: wrongPassword };

    const res = await api.post(PATH).send(credentials).expect(401);
    expect(res.body.token).not.toBeDefined();
  });

  it('should reject a non existing username', async () => {
    const credentials = {
      username: 'idontexist',
      password: 'whatever',
    };

    // sanitycheck
    const users = await usersInDb();
    const contains = users.find((_) => _.username === credentials.username);
    expect(contains).toBe(undefined);

    const res = await api.post(PATH).send(credentials).expect(401);
    expect(res.body.token).not.toBeDefined();
  });
});
