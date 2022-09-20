/* eslint-disable node/no-process-env */
require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 3003;
const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  NODE_ENV,
  MONGODB_URI,
  PORT,
};
