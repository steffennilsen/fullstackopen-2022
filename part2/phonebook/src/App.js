import { useEffect, useState } from "react";
import axios from "axios";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";

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
