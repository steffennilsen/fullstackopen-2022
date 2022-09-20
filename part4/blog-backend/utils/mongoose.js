const mongoose = require('mongoose');
const { MONGODB_URI, NODE_ENV } = require('#@/utils/config');
const logger = require('#@/utils/logger');

const globalConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.success('connected to MongoDB');
  } catch (err) {
    logger.error('error connecting to MongoDB');
    throw new Error(err);
  }
};

const globalDisconnect = async () => {
  logger.warn('closing mongodb connection');
  await mongoose.connection.close();
};

const toJSON = {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
};

const isTestEnv = NODE_ENV === 'test';
module.exports = {
  toJSON,
  globalConnect: !isTestEnv ? globalConnect : () => {},
  globalDisconnect: !isTestEnv ? globalDisconnect : () => {},
  ...(isTestEnv && require('./testdb')),
};
