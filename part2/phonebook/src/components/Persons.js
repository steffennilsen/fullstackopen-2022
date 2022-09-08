import Person from "./Person";
import personService from "../services/personService";

const Persons = ({ persons, setPersons, addNotification }) => {
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

  return (
    <table>
      <tbody>
        {persons.map((person) => (
          <Person
            person={person}
            key={person.id}
            handleDeletePerson={handleDeletePerson}
          />
        ))}
      </tbody>
    </table>
  );
};

export default Persons;
