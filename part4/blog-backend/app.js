const express = require('express');
require('express-async-errors');

/**
 * Some of these require statments have side effects depending on load order
 */

const mongoose = require('mongoose');
const cors = require('cors');
const config = require('#@/utils/config');
const logger = require('#@/utils/logger');
const {
  enforceJSONContentType,
  jsonParseErrorHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('#@/utils/middleware');
const blogsRouter = require('#@/controllers/blogs');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.success('connected to MongoDB'))
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

app
  .use(
    cors(),
    enforceJSONContentType,
    express.json(),
    jsonParseErrorHandler,
    requestLogger,
  )
  .use('/api/blogs', blogsRouter)
  .use(unknownEndpoint, errorHandler);

module.exports = app;
