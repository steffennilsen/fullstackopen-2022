const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const config = require('#@/utils/config');
const logger = require('#@/utils/logger');
const middleware = require('#@/utils/middleware');
const blogsRouter = require('#@/controllers/blogs');

const app = express();

mongoose
  .connect(config.MONGODB_URI)
  .then(() => logger.success('connected to MongoDB'))
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
    process.exit(1);
  });

app
  .use(
    cors(),
    middleware.enforceJSONContentType,
    express.json(),
    middleware.jsonParseErrorHandler,
    middleware.requestLogger,
  )
  .use('/api/blogs', blogsRouter)
  .use(middleware.unknownEndpoint, middleware.errorHandler);

module.exports = app;
