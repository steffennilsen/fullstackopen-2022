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

  /** This really should be redux type global store action kind of thing  */
  const handleDeletePerson = (person) => {
    const confirm = window.confirm(`Delete ${person.name}?`);

    if (confirm) {
      personService
        .remove(person.id)
        .then(() => {
          setPersons(persons.filter((_person) => _person.id !== person.id));
          addNotification(`Removed ${person.name}`, "warn");
        })
        .catch((error) => {
          if (error.response.status === 404) {
            // remove locally
            setPersons(persons.filter((_person) => _person.id !== person.id));
            addNotification(
              `Information of ${person.name} has already been removed from server`,
              "error"
            );
          }
        });
    }
  };

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
        handleDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default App;
