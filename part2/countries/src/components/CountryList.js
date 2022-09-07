import { COUNTRY_DISPLAY_LIMIT } from "../App";
import Country from "./Country";

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

export default CountryList;
