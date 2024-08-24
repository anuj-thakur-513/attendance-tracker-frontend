import { Route, Routes } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

import Auth from "./pages/auth/Auth";
import "./App.css";
import Home from "./pages/home/Home";
import UserAuthProfile from "./components/UserAuthProfile";

axios.defaults.baseURL = "http://localhost:8000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserAuthProfile />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
