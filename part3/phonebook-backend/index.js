const express = require('express');
const app = express();
app.use(express.json());

const PORT = 3001;

let data = [
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
      data.length
    } people</p><p>${Date()}</p></div>`,
  ),
);
app.all('/info', (request, response) => response.status(405).end());

app.all('/api', (request, response) => response.status(405).end());

app.get('/api/persons', (request, response) => response.json(data));
app.all('/api/persons', (request, response) => response.status(405).end());

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find((entry) => entry.id === id);

  if (person) {
    return response.json(person);
  }

  return response.status(404).end();
});
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = data.find((entry) => entry.id === id);

  if (person) {
    data = data.filter((entry) => entry.id !== id);
    return response.status(204).end();
  }

  return response.status(404).end();
});
app.all('/api/persons/:id', (request, response) => response.status(405).end());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
