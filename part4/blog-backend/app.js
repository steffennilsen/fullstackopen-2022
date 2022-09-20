const express = require('express');
require('express-async-errors');
const ON_DEATH = require('death')({ uncaughtException: true });

/**
 * Some of these require statments have side effects depending on load order
 */

const {
  enforceJSONContentType,
  jsonParseErrorHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('#@/utils/middleware');
const { onDeath } = require('#@/utils/death');
const blogsRouter = require('#@/controllers/blogs');
const cors = require('cors');
const mongoose = require('#@/utils/mongoose');

ON_DEATH(onDeath);

mongoose.globalConnect();

const app = express();
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
