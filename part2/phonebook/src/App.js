import { useState } from "react";

const PhonebookForm = ({ name, persons, number }) => {
  const addEntry = (event) => {
    event.preventDefault();

    /**
     * purposedly not doing .toLowerCase or similiar since its not specified
     * nor filtering on existing numbers, since its not specified
     */
    if (persons.get.map((person) => person.name).includes(name.get)) {
      window.alert(`${name.get} is already added to phonebook`);
      return false;
    }

    /**
     * numbers set as strings due to format issues like dashes, and its not specified
     */
    persons.set([...persons.get, { name: name.get, number: number.get }]);
    name.set("");
    number.set("");
  };

  return (
    <form onSubmit={addEntry}>
      <div>
        <div>
          name:
          <input
            value={name.get}
            onChange={(event) => name.set(event.target.value)}
          />
        </div>
        <div>
          number:
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
        <tr key={person.name}>
          <td>{person.name}</td>
          <td>{person.number}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

function randomPhonenumber() {
  const nr = `${Math.ceil(Math.random() * 10_000_000_000) - 1}`;
  return `${nr.substring(0, 3)}-${nr.substring(3, nr.length)}`;
}

const App = () => {
  const [persons, setPersons] = useState([
    {
      name: "Arto Hellas",
      number: randomPhonenumber(),
    },
    {
      name: "Ada Lovelace",
      number: randomPhonenumber(),
    },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Really should wait with this until event propogation gets introduced? */}
      <PhonebookForm
        persons={{ get: persons, set: setPersons }}
        name={{ get: newName, set: setNewName }}
        number={{ get: newNumber, set: setNewNumber }}
      />
      <div>
        <h2>Numbers</h2>
        <NumberList persons={persons} />
      </div>
    </div>
  );
};

export default App;
