import { useEffect, useState } from "react";
import axios from "axios";

const PersonForm = ({ name, persons, number }) => {
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

const Person = ({ person }) => (
  <tr>
    <td>{person.name}</td>
    <td>{person.number}</td>
  </tr>
);

const Persons = ({ persons }) => (
  <table>
    <tbody>
      {persons.map((person) => (
        <Person person={person} key={person.id} />
      ))}
    </tbody>
  </table>
);

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      <label>filter shown with</label>
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3001/persons")
      .then((response) => setPersons(response.data));
  }, []);

  const filterPersons = () =>
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      {/* Really should wait with this until event propogation gets introduced? */}
      <PersonForm
        persons={{ get: persons, set: setPersons }}
        name={{ get: newName, set: setNewName }}
        number={{ get: newNumber, set: setNewNumber }}
      />
      <h2>Numbers</h2>
      <Persons persons={filterPersons()} />
    </div>
  );
};

export default App;
