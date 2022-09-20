const express = require('express');
require('express-async-errors');

/**
 * Some of these require statments have side effects depending on load order
 */

const cors = require('cors');
const {
  enforceJSONContentType,
  jsonParseErrorHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require('#@/utils/middleware');
const blogsRouter = require('#@/controllers/blogs');
const db = require('#@/utils/mongoose.js');

const app = express();

db.connect();

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
