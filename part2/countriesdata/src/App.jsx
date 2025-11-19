import { useState, useEffect } from "react";
import axios from "axios";

import Results from "./components/Results";

function App() {
  const [search, setSearch] = useState("");
  const [allCountriesData, setCountriesData] = useState([]);

  const filteredData = allCountriesData.filter((country) =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountriesData(response.data);
      });
  }, []);

  return (
    <div className="App">
      Find Countries:{" "}
      <input
        type="search"
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <Results filteredData={filteredData} search={search} />
    </div>
  );
}

export default App;
