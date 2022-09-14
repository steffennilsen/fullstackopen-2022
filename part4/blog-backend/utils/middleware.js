const morgan = require('morgan');
const logger = require('#@/utils/logger');

const enforceJSONContentType = (req, res, next) => {
  if (
    ['POST', 'PUT', 'PATCH'].find((method) => method === req.method) &&
    req.get('Content-Type') !== 'application/json'
  ) {
    return res.sendStatus(415);
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

const requestLogger = morgan.token('body', (req) => JSON.stringify(req.body))(
  ':method :url :status :res[content-length] - :response-time ms :body',
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

module.exports = {
  enforceJSONContentType,
  jsonParseErrorHandler,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
