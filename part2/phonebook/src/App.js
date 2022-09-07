import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/personService";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  const filterPersons = () =>
    filter.length === 0
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(filter.toLowerCase())
        );

  /** This really should have been an event */
  const handleDeletePerson = (id) =>
    personService
      .remove(id)
      .then(() => setPersons(persons.filter((person) => person.id !== id)));

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
      <Persons
        persons={filterPersons()}
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
