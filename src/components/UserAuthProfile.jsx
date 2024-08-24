import axios from "axios";
import { useEffect } from "react";

const UserAuthProfile = () => {
  const setUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    window.dispatchEvent(new Event("localStorageUserChange"));
  };

  const logout = async () => {
    window.localStorage.removeItem("user");
    try {
      await axios.patch("/api/v1/auth/logout");
    } catch (e) {
      console.error("Error logging out:", e);
    } finally {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user");
        setUser(res.data.data.user);
        if (window.location.pathname === "/") {
          window.location.href = "/home";
        }
      } catch (e) {
        if (window.location.pathname !== "/") {
          await logout();
        }
      }
    };
    fetchUser();
  }, []);
  return <div></div>;
};

export default UserAuthProfile;
