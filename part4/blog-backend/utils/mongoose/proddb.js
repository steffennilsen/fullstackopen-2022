const { MONGODB_URI } = require('#@/utils/config');
const logger = require('#@/utils/logger');
const mongoose = require('mongoose');

const connect = async () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => logger.success('connected to MongoDB'))
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message);
      process.exit(1);
    });
};

let close = async () => {};

module.exports = { connect, close };
