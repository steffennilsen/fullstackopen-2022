/* eslint-disable node/no-process-env */
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.SECRET;

module.exports = {
  MONGODB_URI,
  NODE_ENV,
  PORT,
  SECRET,
  ...(NODE_ENV === 'test' && {
    MONGODB_URI: process.env.TEST_MONGODB_URI,
    PORT: process.env.TEST_PORT,
    SECRET: process.env.TEST_SECRET,
  }),
};
