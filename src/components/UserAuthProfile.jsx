import axios from "axios";
import { useEffect } from "react";

const UserAuthProfile = () => {
  const logout = async () => {
    window.localStorage.removeItem("user");
    try {
      await axios.patch("/api/v1/auth/logout");
    } catch (e) {
    } finally {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/v1/auth/user");
        window.localStorage.setItem("user", JSON.stringify(res.data.data.user));
        if (window.location.pathname === "/") {
          console.log("entered");
          window.location.href = "/home";
        }
      } catch (e) {
        await logout();
      }
    };
    fetchUser();
  }, []);
  return <div></div>;
};

export default UserAuthProfile;
