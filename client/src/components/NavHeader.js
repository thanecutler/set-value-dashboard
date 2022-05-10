import React from "react";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import SearchSets from "./SearchSets";
import { Link } from "react-router-dom";
const NavHeader = ({ username }) => {
  return (
    <Navbar color='dark' dark expand='md' fixed='top'>
      <Nav className='me-auto' navbar>
        <NavbarBrand tag={Link} to='/'>
          Set Price Tracker
        </NavbarBrand>
        <NavItem>
          <SearchSets />
        </NavItem>
      </Nav>
      <Nav navbar>
        <NavItem>
          <NavLink tag={Link} to='/stats'>
            Stats
          </NavLink>
        </NavItem>
        <NavItem>
          {username ? (
            <NavLink tag={Link} to='/'>
              {username}
            </NavLink>
          ) : (
            <NavLink tag={Link} to='/login'>
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
