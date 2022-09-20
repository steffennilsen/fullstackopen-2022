const morgan = require('morgan');
const logger = require('#@/utils/logger');
const { NODE_ENV } = require('./config');

const enforceJSONContentType = (req, res, next) => {
  if (req.get('Content-Type') !== 'application/json') {
    return res.sendStatus(415);
  }

  return next();
};

const enforcePasswordValidation = (req, res, next) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'missing password' });
  }

  if (`${password}`.length < 3) {
    return res.status(400).json({ error: 'too short password' });
  }

  return next();
};

/**
 * https://stackoverflow.com/a/58165719/2029532
 */
const jsonParseErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    logger.warn(err.message);
    logger.warn(err.body);
    return res.status(400).send({ error: err.message });
  }

  return next();
};

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
);

const unknownEndpoint = (req, res) => {
  return res.status(404).send({ error: 'unknown endpoint' });
};

const errorHandler = (err, req, res, next) => {
  if (err.name === 'CastError') {
    logger.warn('malformed id');
    return res.status(400).send({ error: 'malformatted id' });
  } else if (err.name === 'ValidationError') {
    logger.warn(err.message);
    return res.status(400).json({ error: err.message });
  }

  return next(err);
};

const isTestEnv = NODE_ENV === 'test';
const dummyMiddleware = (err, req, res, next) => next();

module.exports = {
  enforceJSONContentType,
  enforcePasswordValidation,
  jsonParseErrorHandler,
  unknownEndpoint,
  errorHandler,
  requestLogger,
  ...(isTestEnv && { requestLogger: dummyMiddleware }),
};
