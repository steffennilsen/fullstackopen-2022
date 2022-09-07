import { useEffect, useState } from "react";
import axios from "axios";

const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;

/**
 * Taking in name as the weather api sometimes
 * didnt line up with capital despite taking its lat,lon from it,
 * less confusing this way
 */
const Weather = ({ lat, lon, name }) => {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather`, {
        params: {
          lat,
          lon,
          appid: apiKey,
          units: "metric",
        },
      })
      .then((response) => {
        setWeather(response.data);
      });
  }, [lat, lon]);

  if (weather.length === 0) {
    return <></>;
  }

  return (
    <div>
      <h2>Weather in {name}</h2>
      <div>temperature {weather.main.temp} Celcius</div>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt=""
      />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  );
};

export default Weather;
