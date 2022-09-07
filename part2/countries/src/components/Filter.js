const Filter = ({ get, set }) => (
  <div>
    <label>find countries</label>
    <input value={get} onChange={(event) => set(event.target.value)} />
  </div>
);

export default Filter;
