import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Auth from "./pages/auth/Auth";
import "./App.css";
import Home from "./pages/home/Home";
import UserAuthProfile from "./components/UserAuthProfile";

axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

function App() {
  return (
    <>
      <UserAuthProfile />
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
