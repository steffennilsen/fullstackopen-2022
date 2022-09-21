const express = require('express');
require('express-async-errors');
const ON_DEATH = require('death')({ uncaughtException: true });

/**
 * Some of these require statments have side effects depending on load order
 */

const {
  jsonParseErrorHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('#@/utils/middleware');
const { onDeath } = require('#@/utils/death');
const blogsRouter = require('#@/controllers/blogs');
const cors = require('cors');
const loginRouter = require('#@/controllers/login');
const mongoose = require('#@/utils/mongoose');
const usersRouter = require('#@/controllers/users');

ON_DEATH(onDeath);

mongoose.globalConnect();

const app = express();
app
  .use(cors(), express.json(), jsonParseErrorHandler, requestLogger)
  .use('/api/blogs', blogsRouter)
  .use('/api/login', loginRouter)
  .use('/api/users', usersRouter)
  .use(unknownEndpoint, errorHandler);

module.exports = app;
