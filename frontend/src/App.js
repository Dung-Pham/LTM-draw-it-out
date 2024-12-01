import logo from "./logo.svg";
import "./App.css";
import Room from "./Pages/Room.jsx";
import { Route, Routes } from "react-router-dom";
import Play from "./Pages/Play.jsx";
import LoginPage from "./Pages/LoginPage.jsx";
import HomePage from "./Pages/HomePage.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/room" element={<Room />} />
        <Route path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}

export default App;
