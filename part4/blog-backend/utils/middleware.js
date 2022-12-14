const { decodeToken } = require('#@/utils/auth');
const { expressjwt } = require('express-jwt');
const { NODE_ENV } = require('./config');
const config = require('#@/utils/config');
const logger = require('#@/utils/logger');
const morgan = require('morgan');
const User = require('#@/models/user');

// const isRevoked = async (req, token) => {
const isRevoked = async () => {
  // const issuer = token.payload.iss;
  // const tokenId = token.payload.jti;
  // const token = await data.getRevokedToken(issuer, tokenId);
  // return token !== 'undefined';
  return false;
};

const authJwt = expressjwt({
  secret: config.SECRET,
  algorithms: ['HS256'],
  isRevoked: isRevoked,
});

/**
 * relies on token property being set
 */
const userExtractor = async (req, res, next) => {
  if (req.user) {
    return next();
  }

  const token = decodeToken(req.token);
  const user = await User.findById(token.id);
  req.user = user;

  return next();
};

const userValidator = (req, res, next) => {
  if (!req.user) {
    return res.status(404).json({ error: 'User not found' });
  }

  return next();
};

const tokenExtractor = (req, res, next) => {
  if (req.token) {
    return next();
  }

  const authorization = req.get('authorization');
  if (authorization) {
    const regexp = new RegExp('^(bearer) (.*)$');
    const matcher = authorization.match(regexp);

    if (matcher && matcher[1] === 'bearer') {
      req.token = matcher[2];
    }
  }

  return next();
};

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
  } else if (
    err.name === 'UnauthorizedError' ||
    err.name === 'JsonWebTokenError'
  ) {
    if (
      err.code === 'invalid_token' &&
      err.inner &&
      err.inner.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        error: 'token expired',
      });
    }

    return res.status(401).json({
      error: 'invalid token',
    });
  }

  return next(err);
};

const isTestEnv = NODE_ENV === 'test';
const dummyMiddleware = (err, req, res, next) => next();

module.exports = {
  authJwt,
  enforceJSONContentType,
  enforcePasswordValidation,
  errorHandler,
  jsonParseErrorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
  userExtractor,
  userValidator,
  ...(isTestEnv && { requestLogger: dummyMiddleware }),
};
