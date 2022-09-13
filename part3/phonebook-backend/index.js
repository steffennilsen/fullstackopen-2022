require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const httpError = require('http-errors');
const Person = require('./models/person');

const chalkSuccess = chalk.green;
const chalkInfo = chalk.bgBlue.white;
const chalkWarn = chalk.bgYellow.black;
const chalkError = chalk.bold.red;

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then((result) =>
    console.log(chalkSuccess(`connected to ${result.connections[0].host}`)),
  )
  .catch((error) => {
    console.error(chalkError('error connecting to MongoDB'));
    console.error(chalkError(error.message));
    process.exit(1);
  });

/**
 * Middleware
 */

const enforceJSONContentType = (req, res, next) => {
  if (
    ['POST', 'PUT', 'PATCH'].find((method) => method === req.method) &&
    req.get('Content-Type') !== 'application/json'
  ) {
    return res.sendStatus(415);
  }

  return next();
};

// https://stackoverflow.com/a/58165719/2029532
const jsonParseError = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.warn(chalkWarn(err.message));
    console.warn(chalkWarn(err.body));
    return res.status(400).send({ error: err.message });
  }
  return next();
};

/**
 * Middleware end
 */

app.use(
  express.static('build'),
  morgan.token('body', (req, res) => JSON.stringify(req.body))(
    ':method :url :status :res[content-length] - :response-time ms :body',
  ),
  enforceJSONContentType,
  express.json(),
  jsonParseError,
  cors(),
);

/**
 * /info
 */

app.get('/info', async (req, res, next) => {
  const count = await Person.estimatedDocumentCount().catch((error) =>
    next(error),
  );
  return res.send(
    `<div><p>Phonebook has info for ${count} people</p><p>${Date()}</p></div>`,
  );
});

/**
 * /api/persons
 */

app.get('/api/persons', async (req, res, next) => {
  const persons = await Person.find({}).catch((error) => next(error));
  return res.json(persons);
});

app.post('/api/persons', async (req, res, next) => {
  const invalid = invalidPersonEntries(req.body, res);
  if (!!invalid) {
    return invalid;
  }

  const exists = await checkIfPersonExists(req.body.name, res, next);
  if (!!exists) {
    return exists;
  }

  const person = await new Person({
    name: req.body.name,
    number: `${req.body.number}`,
  })
    .save()
    .catch((err) => next(err));

  console.log(chalkSuccess(`saved ${JSON.stringify(person)}`));
  return res.status(201).json(person);
});

/**
 * /api/persons/:id
 */

app.get('/api/persons/:id', async (req, res, next) => {
  const person = await Person.findById(req.params.id).catch((err) => next(err));
  if (person === null) {
    return res.sendStatus(404);
  }

  return res.json(person);
});

app.delete('/api/persons/:id', async (req, res, next) => {
  const person = await Person.findByIdAndRemove(req.params.id).catch((err) =>
    next(err),
  );
  if (person === null) {
    return res.sendStatus(404);
  }

  return res.json(person);
});

app.put('/api/persons/:id', async (req, res, next) => {
  const invalid = invalidPersonEntries(req.body, res);
  if (!!invalid) {
    return invalid;
  }

  const entries = { name: req.body.name, number: req.body.number };
  const person = await Person.findByIdAndUpdate(req.params.id, entries, {
    new: true,
    upsert: false,
  }).catch((err) => next(err));

  if (person === null) {
    return res.status(404).send({ error: 'id not found' });
  }

  console.log(chalkSuccess(`updated ${JSON.stringify(person)}`));
  return res.json(person);
});

/**
 * Route end
 */

/**
 * 404 is not an actual error, so lets make it one
 * so the endpointhandler has something to work with
 */
app.use((req, res, next) => next(new httpError(404)));

/**
 * Handle malformed id's
 */
app.use((err, req, res, next) => {
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(400).send({ error: 'malformatted id' });
  }

  return next(err);
});

/**
 * Handle unknown endpoint
 */
app.use((err, req, res, next) => {
  console.warn(chalkWarn(`unknownEndpoint`));
  return res.status(404).send({ error: 'unknown endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Utils
 */

/**
 * @returns `router response` if exists, `false` if not
 */
async function checkIfPersonExists(name, res, next) {
  const person = await Person.findOne({
    name,
  }).catch((err) => next(err));

  if (person !== null) {
    console.warn(chalkWarn(`${person.name} already exists`));
    return res.status(409).json({
      error: 'name must be unique',
    });
  }

  return false;
}

/**
 * @returns `router response` invalid, `false` if not
 */
function invalidPersonEntries(person, res) {
  for (const key of ['name', 'number']) {
    if (person[key] === undefined || person[key] === null) {
      console.warn(chalkWarn(`invalid or missing entries`));
      return res.status(400).json({ error: 'invalid or missing entries' });
    }
  }

  return false;
}
