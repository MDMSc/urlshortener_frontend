import React, { useContext, useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import "../styles/navbar.css";
import { FaRegUserCircle } from "react-icons/fa";
import { HiLink } from "react-icons/hi";
import { LOGOUT } from "../context/Action.type";
import axios from "axios";
import { API_USERS } from "../Global";
import { Context } from "../context/Context";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const handleToggle = () => setIsOpen(!isOpen);
  const { dispatch } = useContext(Context);

  const sendLogoutReq = async () => {
    const result = await axios.post(`${API_USERS}/logout`, null, {
      withCredentials: true,
    });

    if(result.status === 200){
      return result;
    }
    return new Error("Unable to Logout. Kindly retry.");
  };

  const handleLogout = () => {
    sendLogoutReq().then(() => {
      dispatch({
        type: LOGOUT,
      });

      localStorage.clear();
    })
  }

  return (
    <div>
      <Navbar
        className="px-4"
        style={{ backgroundColor: "transparent" }}
        expand="md"
      >
        <NavbarBrand href="/">
          <span className="navbar_brand">
            {" "}
            <HiLink /> URL Shrinker 😎
          </span>
        </NavbarBrand>
        <NavbarToggler onClick={handleToggle} />
        <Collapse className="navbar_collapse" isOpen={isOpen} navbar>
          <Nav className="ml-auto" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle nav>
                <FaRegUserCircle size="2em" />
              </DropdownToggle>
              {localStorage.getItem("isLoggedIn") ? (
                <DropdownMenu end>
                  <DropdownItem header text>
                    <b>Hi, {JSON.parse(localStorage.getItem("user")).firstName}</b>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="/" onClick={handleLogout}>Logout</DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu end>
                  <DropdownItem header text>
                    <b>Hi, User</b>
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem href="/login">Login</DropdownItem>
                  <DropdownItem href="/signup">Sign Up</DropdownItem>
                </DropdownMenu>
              )}
            </UncontrolledDropdown>
          </Nav>
        </Collapse>
      </Navbar>
    </div>
  );
}
