import React from "react";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import SearchSets from "../SearchSets";
import { Link } from "react-router-dom";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";

const NavHeader = ({ username }) => {
  return (
    <Navbar className="mainNav" color="dark" dark expand="md" fixed="top">
      <Nav className="me-auto" navbar>
        <NavbarBrand tag={Link} to="/">
          <AutoGraphIcon /> Pokemon Data Explorer
        </NavbarBrand>
        <NavItem>
          <SearchSets />
        </NavItem>
      </Nav>
      <Nav navbar>
        <NavItem>
          <NavLink tag={Link} to="/stats">
            Stats
          </NavLink>
        </NavItem>
        <NavItem>
          {username ? (
            <NavLink tag={Link} to="/">
              {username}
            </NavLink>
          ) : (
            <NavLink tag={Link} to="/login">
              Log in
            </NavLink>
          )}
        </NavItem>
      </Nav>
      {/* <NavbarText>Current market value: $</NavbarText> */}
    </Navbar>
  );
};

export default NavHeader;
