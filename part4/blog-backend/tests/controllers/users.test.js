const app = require('#@/app');
const supertest = require('supertest');
const api = supertest(app);

const {
  userEntries,
  userList,
  expectCount,
  populateUsers,
} = require('#@/tests/users.helper');
const db = require('#@/utils/mongoose');

const PATH = '/api/users';

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

describe(`GET ${PATH}`, () => {
  it('should return all users as json', async () => {
    const res = await api
      .get(PATH)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    expect(res.length).toBe(await userList().length);
  });
});

describe(`POST ${PATH}`, () => {
  it('should succeed with creating user with valid unique name', async () => {
    await db.clear();
    await expectCount(0);
    await api.post(PATH).send(userEntries[0]).expect(201);
    await expectCount(1);
  });

  it('should reject user with non unique name', async () => {
    await expectCount(userEntries.length);
    await api.post(PATH).send(userEntries[0]).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject user with missing name', async () => {
    await expectCount(userEntries.length);
    const { password } = userEntries[0];
    const entries = { password };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject user with missing password', async () => {
    await expectCount(userEntries.length);
    const { user } = userEntries[0];
    const entries = { user };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });
});
