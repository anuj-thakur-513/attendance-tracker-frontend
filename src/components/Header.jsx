import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

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
      await axios.patch("/api/v1/auth/logout");
    } catch (e) {
    } finally {
      window.localStorage.removeItem("user");
      window.location.href = "/";
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
                  src={user.profilePicture} // Replace with user's profile picture URL
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
