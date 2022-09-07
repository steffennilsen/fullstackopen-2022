import personService from "../services/personService";

const PersonForm = ({ name, persons, number }) => {
  const addEntry = async (event) => {
    event.preventDefault();

    const person = persons.get.find((person) => person.name === name.get);
    if (person) {
      return updateEntry(person);
    }

    const dbPerson = await personService.create({
      name: name.get,
      number: number.get,
    });
    persons.set([...persons.get, dbPerson]);
    name.set("");
    number.set("");
  };

  const updateEntry = async (person) => {
    const confirm = window.confirm(
      `${name.get} is already added to phonebook, replace the old number with a new one?`
    );

    if (!confirm) {
      return false;
    }

    const dbPerson = await personService.update({
      ...person,
      number: number.get,
    });
    persons.set([...persons.get.filter((_) => _.id !== person.id), dbPerson]);
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

export default PersonForm;
