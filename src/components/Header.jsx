import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import Cookies from "js-cookie";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [profilePicture, setProfilePicture] = useState("./user-profile.png");
  const profileRef = useRef(null);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  const handleLogout = async () => {
    window.localStorage.removeItem("user");
    try {
      await axios.patch("/api/v1/auth/logout", {
        headers: {
          "Access-Token": Cookies.get("accessToken"),
          "Refresh-Token": Cookies.get("refreshToken"),
        },
      });
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      console.log(Cookies.get("accessToken"));
    } catch (e) {
      console.error("Error logging out:", e);
    } finally {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    const handleCustomStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (userData && userData.profilePicture) {
        setProfilePicture(userData.profilePicture);
      }
    };

    window.addEventListener(
      "localStorageUserChange",
      handleCustomStorageChange
    );

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener(
        "localStorageUserChange",
        handleCustomStorageChange
      );
    };
  }, []);

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="header">
      <Container fluid className="justify-content-between">
        <Navbar.Brand href="/home">Attendance Tracker</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            <Dropdown
              show={showDropdown}
              onToggle={handleProfileClick}
              ref={profileRef}
            >
              <Dropdown.Toggle
                as="div"
                id="dropdown-custom-components"
                onClick={handleProfileClick}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="rounded-circle"
                  width="40"
                  height="40"
                />
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item
                  as="button"
                  onClick={handleLogout}
                  className="text-danger"
                >
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
