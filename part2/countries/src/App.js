import axios from "axios";
import { useEffect, useState } from "react";

const COUNTRY_DISPLAY_LIMIT = 10;

const Country = ({ country }) => (
  <div>
    <h1>{country.name.common}</h1>
    <div>capital: {country.capital}</div>
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

const CountryList = ({ countries }) => {
  if (countries.length === 0) {
    return <div>No matches, specify another filter</div>;
  }

  if (countries.length > COUNTRY_DISPLAY_LIMIT) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]}></Country>;
  }

  return countries.map((country) => (
    <div key={country.name.common}>{country.name.common}</div>
  ));
};

const Filter = ({ get, set }) => (
  <div>
    <label>find countries</label>
    <input value={get} onChange={(event) => set(event.target.value)} />
  </div>
);

const App = () => {
  const [countries, setCountries] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    /**
     * Notice that React.StrictMode from index.js makes this call goes twice,
     * because thats part of strictmodes check it renders twice
     *
     * https://stackoverflow.com/a/61254432/2029532
     **/
    axios.get("https://restcountries.com/v3.1/all").then((response) => {
      setCountries(response.data);
    });
  }, []);

  const filterCountries = () => {
    const filterLowerCase = filter.toLowerCase();
    const filtered =
      filter.length === 0
        ? countries
        : countries.filter((country) =>
            country.name.common.toLowerCase().includes(filterLowerCase)
          );

    /**
     * Cornercase where name of country is part of another
     */
    if (filtered.length < COUNTRY_DISPLAY_LIMIT) {
      const country = filtered.find(
        (country) => country.name.common.toLowerCase() === filterLowerCase
      );
      if (country) {
        return [country];
      }
    }

    return filtered;
  };

  return (
    <div>
      <Filter get={filter} set={setFilter}></Filter>
      <CountryList countries={filterCountries()}></CountryList>
    </div>
  );
};

export default App;
