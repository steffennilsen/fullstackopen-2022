import { COUNTRY_DISPLAY_LIMIT } from "../App";
import Country from "./Country";

const CountryList = ({ countries, setFilter }) => {
  if (countries.length === 0) {
    return <div>No matches, specify another filter</div>;
  }

  if (countries.length > COUNTRY_DISPLAY_LIMIT) {
    return <div>Too many matches, specify another filter</div>;
  }

  if (countries.length === 1) {
    return <Country country={countries[0]}></Country>;
  }

  /**
   * Not really a fan of using setFilter in this manner, but it works
   */
  return countries.map((country) => (
    <div key={country.name.common}>
      <span>{country.name.common}</span>
      <button onClick={() => setFilter(country.name.common)}>show</button>
    </div>
  ));
};

export default CountryList;
