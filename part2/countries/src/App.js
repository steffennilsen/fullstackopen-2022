import axios from "axios";
import { useEffect, useState } from "react";
import CountryList from "./components/CountryList";
import Filter from "./components/Filter";

export const COUNTRY_DISPLAY_LIMIT = 10;

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
