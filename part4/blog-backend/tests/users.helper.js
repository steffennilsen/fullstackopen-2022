const bcrypt = require('bcrypt');
const User = require('#@/models/user');

const userEntries = [
  {
    username: 'root',
    password: 'banan123',
  },
  {
    username: 'noob',
    name: 'Ola Potet',
    password: 'hashedhlongpwd',
  },
];
let _userList;
const _userListEntries = async () => {
  _userList =
    _userList ||
    (await Promise.all(
      userEntries.map(async ({ username, password, name }) => ({
        username,
        ...(!!name && { name }),
        passwordHash: await bcrypt.hash(password, 10),
      })),
    ));

  return _userList;
};

const userList = async () => await _userListEntries();

const populateUsers = async () => {
  const entries = await userList();
  await User.collection.insertMany(entries);
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const expectCount = async (expected) => {
  const count = await User.countDocuments({});
  expect(count).toBe(expected);
};

module.exports = {
  userEntries,
  userList,
  populateUsers,
  expectCount,
  usersInDb,
};
