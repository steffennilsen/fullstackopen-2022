const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;

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

app.all('/', (request, response) => response.status(405).end());

app.get('/info', (request, response) =>
  response.send(
    `<div><p>Phonebook has infor for ${
      persons.length
    } people</p><p>${Date()}</p></div>`,
  ),
);
app.all('/info', (request, response) => response.status(405).end());

app.all('/api', (request, response) => response.status(405).end());

app.get('/api/persons', (request, response) => response.json(persons));
app.post('/api/persons', (request, response) => {
  if (request.get('Content-Type') !== 'application/json') {
    return response.status(400).json({
      error: 'expect Content-Type: application/json',
    });
  }

  const body = request.body;
  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    });
  }

  /**
   * Generate a new id for the phonebook entry with the Math.random function 🤮🤮🤮
   * -1 from Number.MAX_SAFE_INTEGER just to be extra super duper safe since the rng can make it exceed it
   **/
  const id = Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 1));

  const person = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id,
  };

  persons = persons.concat(person);
  return response.json(person);
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
app.all('/api/persons/:id', (request, response) => response.status(405).end());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
