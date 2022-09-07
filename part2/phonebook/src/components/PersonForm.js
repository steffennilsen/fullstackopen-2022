const PersonForm = ({ name, persons, number }) => {
  const addEntry = (event) => {
    event.preventDefault();

    /**
     * purposedly not filtering on existing numbers, since its not specified
     */
    if (persons.get.map((person) => person.name).includes(name.get)) {
      window.alert(`${name.get} is already added to phonebook`);
      return false;
    }

    /**
     * numbers set as strings due to format issues like dashes, and its not specified
     * `id: persons.get.length + 1` because dummy data is 1 indexed 🤮🤮🤮
     */
    persons.set([
      ...persons.get,
      { name: name.get, number: number.get, id: persons.get.length + 1 },
    ]);
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
