import { useState, useEffect } from "react";
import axios from "axios";

function SingleCountry({ filteredData }) {
  const [weather, setWeather] = useState([]);

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
    axios(
      `http://api.openweathermap.org/geo/1.0/direct?q=${filteredData[0].capital}&appid=${API_KEY}`
    )
      .then((response) => {
        const lat = response.data[0].lat;
        const lon = response.data[0].lon;

        return axios(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely,hourly,alerts&appid=${API_KEY}`
        );
      })
      .then((response) => {
        return setWeather([response.data]);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
      });
  }, [filteredData]);

  return (
    <>
      <h2>{filteredData[0].name.common}</h2>
      <div>Capital City: {filteredData[0].capital}</div>
      <div>Area: {filteredData[0].area}</div>
      <div>
        Languages:
        <ul>
          {Object.entries(filteredData[0].languages).map((arr) => {
            return <li key={arr[0]}>{arr[1]}</li>;
          })}
        </ul>
      </div>
      <img src={filteredData[0].flags.png} alt="flag" />
      {weather.length > 0 && (
        <div>
          <h3>Weather in {filteredData[0].capital}</h3>
          <div>
            Temperature {weather[0].current.temp}
            <span> &#176;C</span>
          </div>
          <div>
            <img
              src={`https://openweathermap.org/img/wn/${weather[0].current.weather[0].icon}@4x.png`}
              alt="weather-icon"
            />
          </div>
          <div>Wind {weather[0].current.wind_speed} m/s</div>
        </div>
      )}
    </>
  );
}

export default SingleCountry;
