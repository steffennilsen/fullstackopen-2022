import { useEffect, useState } from "react";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Filter from "./components/Filter";
import personService from "./services/personService";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filter, setFilter] = useState("");
  const [filterPersons, setFilterPersons] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((persons) => setPersons(persons));
  }, []);

  useEffect(() => {
    setFilterPersons(
      filter.length === 0
        ? persons
        : persons.filter((person) =>
            person.name.toLowerCase().includes(filter.toLowerCase())
          )
    );
  }, [filter, persons]);

  /** No message queue stack pop etc */
  const addNotification = (content, type = "success", duration = 3000) => {
    setNotification({ content, type });
    setTimeout(() => setNotification(null), duration);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notification} />
      <Filter filter={filter} setFilter={setFilter} />
      <h3>add a new</h3>
      {/* At this point vuex or similar external state store looks like a better way */}
      <PersonForm
        persons={{ get: persons, set: setPersons }}
        name={{ get: newName, set: setNewName }}
        number={{ get: newNumber, set: setNewNumber }}
        addNotification={addNotification}
      />
      <h2>Numbers</h2>
      <Persons
        persons={filterPersons}
        setPersons={setPersons}
        addNotification={addNotification}
      />
    </div>
  );
};

export default App;
