import personService from '../services/personService';

const PersonForm = ({ name, persons, number, addNotification }) => {
  const addEntry = async (event) => {
    event.preventDefault();

    if (!name.get || !number.get) {
      addNotification('Fill out all fields', 'warn');
      return false;
    }

    const person = persons.get.find((person) => person.name === name.get);
    if (person) {
      return updateEntry(person);
    }

    personService
      .create({
        name: name.get,
        number: number.get,
      })
      .then((dbPerson) => {
        persons.set([...persons.get, dbPerson]);
        name.set('');
        number.set('');
        addNotification(`Added ${dbPerson.name}`);
      })
      .catch((error) => {
        const msg = error.response.data.error || error.message;
        addNotification(msg, 'error');
      });
  };

  const updateEntry = async (person) => {
    const confirm = window.confirm(
      `${name.get} is already added to phonebook, replace the old number with a new one?`,
    );

    if (!confirm) {
      return false;
    }

    personService
      .update({
        ...person,
        number: number.get,
      })
      .then((dbPerson) => {
        persons.set([
          ...persons.get.filter((_) => _.id !== person.id),
          dbPerson,
        ]);
        name.set('');
        number.set('');
        addNotification(`Updated ${dbPerson.name}`);
      })
      .catch((error) => {
        const msg = error.response.data.error || error.message;
        addNotification(msg, 'error');
      });
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

export default PersonForm;
