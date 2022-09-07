const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      <label>filter shown with</label>
      <input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      />
    </div>
  );
};

export default Filter;
