import personService from "../services/personService";

const PersonForm = ({ name, persons, number }) => {
  const addEntry = async (event) => {
    event.preventDefault();

    /**
     * purposedly not filtering on existing numbers, since its not specified
     */
    if (persons.get.map((person) => person.name).includes(name.get)) {
      window.alert(`${name.get} is already added to phonebook`);
      return false;
    }

    const dbPerson = await personService.create({
      name: name.get,
      number: number.get,
    });
    persons.set([...persons.get, dbPerson]);

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
