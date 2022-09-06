import { useState } from "react";

const PhonebookForm = ({ name, persons, number }) => {
  const addEntry = (event) => {
    event.preventDefault();

    /**
     * purposedly not filtering on existing numbers, since its not specified
     */
    if (persons.get.map((person) => person.name).includes(name.get)) {
      window.alert(`${name.get} is already added to phonebook`);
      return false;
    }

    /**
     * numbers set as strings due to format issues like dashes, and its not specified
     * `id: persons.get.length + 1` because dummy data is 1 indexed 🤮🤮🤮
     */
    persons.set([
      ...persons.get,
      { name: name.get, number: number.get, id: persons.get.length + 1 },
    ]);
    name.set("");
    number.set("");
  };

  return (
    <form onSubmit={addEntry}>
      <div>
        <div>
          <label>name:</label>
          <input
            value={name.get}
            onChange={(event) => name.set(event.target.value)}
          />
        </div>
        <div>
          <label>number:</label>
          <input
            value={number.get}
            onChange={(event) => number.set(event.target.value)}
          />
        </div>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const NumberList = ({ persons }) => (
  <table>
    <tbody>
      {persons.map((person) => (
        <tr key={person.id}>
          <td>{person.id}</td>
          <td>{person.name}</td>
          <td>{person.number}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  const filterPersons = () =>
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <div>
        <h2>Phonebook</h2>
        <div>
          <label>filter shown with</label>
          <input
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
        </div>
      </div>
      <div>
        <h2>add a new</h2>
        {/* Really should wait with this until event propogation gets introduced? */}
        <PhonebookForm
          persons={{ get: persons, set: setPersons }}
          name={{ get: newName, set: setNewName }}
          number={{ get: newNumber, set: setNewNumber }}
        />
      </div>
      <div>
        <h2>Numbers</h2>
        <NumberList persons={filterPersons()} />
      </div>
    </div>
  );
};

export default App;