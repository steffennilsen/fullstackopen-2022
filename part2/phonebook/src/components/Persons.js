import Person from "./Person";

const Persons = ({ persons, handleDeletePerson }) => (
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

export default Persons;
