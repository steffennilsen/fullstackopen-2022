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
  it('should succeed with valid entries', async () => {
    await db.clear();
    await expectCount(0);
    await api.post(PATH).send(userEntries[0]).expect(201);
    await expectCount(1);
  });

  it('should reject non unique name', async () => {
    await expectCount(userEntries.length);
    await api.post(PATH).send(userEntries[0]).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject missing name', async () => {
    await expectCount(userEntries.length);
    const { password } = userEntries[0];
    const entries = { password };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject missing password', async () => {
    await expectCount(userEntries.length);
    const { username } = userEntries[0];
    const entries = { username };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject name.length < 3', async () => {
    await expectCount(userEntries.length);
    const { password } = userEntries[0];
    const entries = { username: 'to', password };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });

  it('should reject user with password.length < 3', async () => {
    await expectCount(userEntries.length);
    const { username } = userEntries[0];
    const entries = { username, password: 12 };
    await api.post(PATH).send(entries).expect(400);
    await expectCount(userEntries.length);
  });
});
