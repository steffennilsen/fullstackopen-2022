require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const chalk = require('chalk');
const Person = require('./models/person');

const chalkSuccess = chalk.green;
const chalkWarn = chalk.bgYellow.black;
const chalkError = chalk.bold.red;

const app = express();
const PORT = process.env.PORT || 3001;
const URL = process.env.MONGODB_URI;

app.use(
  express.static('build'),
  morgan.token('body', (req, res) => JSON.stringify(req.body))(
    ':method :url :status :res[content-length] - :response-time ms :body',
  ),
  cors(),
  express.json(),
);

mongoose
  .connect(URL)
  .then((result) =>
    console.log(chalkSuccess(`connected to ${result.connections[0].host}`)),
  )
  .catch((error) =>
    console.error(chalkError('error connecting to MongoDB:', error.message)),
  );

app.get('/info', async (request, response) => {
  const count = await Person.estimatedDocumentCount();
  return response.send(
    `<div><p>Phonebook has info for ${count} people</p><p>${Date()}</p></div>`,
  );
});
app.all('/info', (request, response) => response.status(405).end());

app.get('/api/persons', async (request, response) => {
  const persons = await Person.find({});
  return response.json(persons);
});
app.post('/api/persons', async (request, response) => {
  if (request.get('Content-Type') !== 'application/json') {
    return response.status(400).json({
      error: 'expect Content-Type: application/json',
    });
  }

  const existingPerson = await Person.findOne({ name: request.body.name });
  if (existingPerson !== null) {
    console.log(
      chalkWarn(`POST /api/persons rejected, name exists`),
      chalkWarn(JSON.stringify(existingPerson.name)),
    );
    return response.status(409).json({
      error: 'name must be unique',
    });
  }

  const person = new Person({
    name: request.body.name,
    number: `${request.body.number}`,
  });

  return person
    .save()
    .then((result) => {
      console.log(chalkSuccess(`saved ${JSON.stringify(result)}`));
      return response.status(201).json(result);
    })
    .catch((error) => {
      console.warn(chalkWarn(JSON.stringify(person)));
      return response.status(400).json({ error: error });
    });
});
app.all('/api/persons', (request, response) => response.status(405).end());

app.get('/api/persons/:id', async (request, response) => {
  return Person.findById(request.params.id)
    .then((person) => {
      if (person.statusCode) {
        return response.status(statusCode).end();
      }

      return response.json(person);
    })
    .catch((error) => {
      const idCastError = checkIdCastError(error);
      if (!!idCastError) {
        return response.status(400).json({ error: idCastError });
      }

      return response.status(404).end();
    });
});
app.delete('/api/persons/:id', async (request, response) => {
  return Person.findOneAndRemove({ _id: request.params.id })
    .then((deleted) => {
      if (!!deleted) {
        console.warn(chalkWarn(`deleted ${request.params.id}`));
        return response.status(204).end();
      }

      return response.status(404).end();
    })
    .catch((error) => {
      const idCastError = checkIdCastError(error);
      if (!!idCastError) {
        return response.status(400).json({ error: idCastError });
      }

      console.error(chalkError(error));
      return response.json(error);
    });
});

/**
 * Almost tripped me when I tried PUT, postponing implementation
 *
 * 3.9 phonebook backend step9
 * Make the backend work with the phonebook frontend from the exercises of the previous part.
 * Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.
 */
app.put('/api/persons/:id', (request, response) => response.status(501).end());
app.all('/api/persons/:id', (request, response) => response.status(405).end());

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`, URL);
});

function checkIdCastError(error) {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    const msg =
      'id must be a string of 12 bytes or a string of 24 hex characters or an integer';
    console.error(chalkError(msg));
    return msg;
  }

  return false;
}
