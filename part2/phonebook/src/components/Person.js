const Person = ({ person, handleDeletePerson }) => (
  <tr>
    <td>{person.name}</td>
    <td>{person.number}</td>
    <td>
      <button onClick={() => handleDeletePerson(person)}>delete</button>
    </td>
  </tr>
);

export default Person;
