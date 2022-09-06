import { useState } from "react";

const PhonebookForm = ({ name, persons }) => {
  const addEntry = (event) => {
    event.preventDefault();
    persons.set(persons.get.concat({ name: name.get }));
    name.set("");
  };

  return (
    <form onSubmit={addEntry}>
      <div>
        name:
        <input
          value={name.get}
          onChange={(event) => name.set(event.target.value)}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Numbers = ({ persons }) => (
  <table>
    <tbody>
      {persons.map((person) => (
        <tr key={person.name}>
          <td>{person.name}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas" },
    { name: "Ada Lovelace" },
  ]);
  const [newName, setNewName] = useState("");

  return (
    <div>
      <h2>Phonebook</h2>
      {/* Really should wait with this until event propogation gets introduced? */}
      <PhonebookForm
        name={{ get: newName, set: setNewName }}
        persons={{ get: persons, set: setPersons }}
      />
      <div>
        <h2>Numbers</h2>
        <Numbers persons={persons} />
      </div>
    </div>
  );
};

export default App;
