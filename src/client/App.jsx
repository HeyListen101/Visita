import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import LandingPage from "./pages/LandingPage";
import MapPage from "./pages/MapPage";

import "./App.css";
import "./assets/css/layout.css"

function App() {
  
  const [envVars, setEnvVars] = useState(null);

  useEffect(() => {
    fetch('/api/env')
    .then((res) => res.json())
    .then((data) => setEnvVars(data))
    .catch((err) => console.error("Failed to get env variables!", err));
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage envVars={{envVars}}/>} />
        <Route path="/map" element={<MapPage envVars={{envVars}}/>} />
      </Routes>
    </Router>
  );
}

export default App;