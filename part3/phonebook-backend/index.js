const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();

const PORT = process.env.PORT || 3001;
app.use(
  express.static('build'),
  morgan.token('body', (req, res) => JSON.stringify(req.body))(
    ':method :url :status :res[content-length] - :response-time ms :body',
  ),
  cors(),
  express.json(),
);

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/info', (request, response) =>
  response.send(
    `<div><p>Phonebook has infor for ${
      persons.length
    } people</p><p>${Date()}</p></div>`,
  ),
);
app.all('/info', (request, response) => response.status(405).end());

app.get('/api/persons', (request, response) => response.json(persons));
app.post('/api/persons', (request, response) => {
  if (request.get('Content-Type') !== 'application/json') {
    return response.status(400).json({
      error: 'expect Content-Type: application/json',
    });
  }

  const body = request.body;
  /**
   * no easy way to break a .forEach, without additional checking afterwards.
   * nor can we use return as its part of the inner anonymous callback function,
   *  so good old fashion for loop it is
   * */
  for (const key of ['name', 'number']) {
    if (!body[key]) {
      return response.status(400).json({
        error: `missing ${key} entry`,
      });
    }
  }

  if (persons.find((_) => _.name === body.name)) {
    return response.status(409).json({
      error: 'name must be unique',
    });
  }

  /**
   * Generate a new id for the phonebook entry with the Math.random function 🤮🤮🤮
   * fyi we cant set the seed on Math.random
   * -1 from Number.MAX_SAFE_INTEGER just to be extra super duper safe since the rng can make it exceed it
   **/
  const id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1));

  /**
   * Important to be concise with incoming form of number, either number or string, not both
   */
  const person = {
    name: body.name,
    number: `${body.number}`,
    id,
  };

  persons = persons.concat(person);
  return response.status(201).json(person);
});
app.all('/api/persons', (request, response) => response.status(405).end());

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((entry) => entry.id === id);

  if (person) {
    return response.json(person);
  }

  return response.status(404).end();
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((entry) => entry.id === id);

  if (person) {
    persons = persons.filter((entry) => entry.id !== id);
    return response.status(204).end();
  }

  return response.status(404).end();
});

/**
 * Almost tripped me when I tried PUT
 *
 * 3.9 phonebook backend step9
 * Make the backend work with the phonebook frontend from the exercises of the previous part.
 * Do not implement the functionality for making changes to the phone numbers yet, that will be implemented in exercise 3.17.
 */
app.all('/api/persons/:id', (request, response) => response.status(405).end());

app.use((request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
