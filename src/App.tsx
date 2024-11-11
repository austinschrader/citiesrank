import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import CityRankingMap from "./CityRankingMap";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-4xl text-blue-500 underline">Hello</h1>
      <CityRankingMap />
    </>
  );
}

export default App;
