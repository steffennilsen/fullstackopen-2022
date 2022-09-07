const Person = ({ person }) => (
  <tr>
    <td>{person.name}</td>
    <td>{person.number}</td>
  </tr>
);

const Persons = ({ persons }) => (
  <table>
    <tbody>
      {persons.map((person) => (
        <Person person={person} key={person.id} />
      ))}
    </tbody>
  </table>
);

export default Persons;
