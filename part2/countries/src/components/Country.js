/**
 * As for the capitals:
 * https://en.wikipedia.org/wiki/List_of_countries_with_multiple_capitals
 * Altough it turns out the API only includes it for the one case I tested, South Africa
 */
const Country = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>
      {country.capital.length > 1 ? "capitals" : "capital"}:{" "}
      {country.capital.map((name) => name).join(", ")}
    </div>
    <div>area: {country.area}</div>
    <h3>languages:</h3>
    <ul>
      {Object.entries(country.languages).map((entry) => (
        <li key={entry[0]}>{entry[1]}</li>
      ))}
    </ul>
    <div>
      <img alt={`${country} flag`} src={country.flags.png} />
    </div>
  </div>
);

export default Country;
