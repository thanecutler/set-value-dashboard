import React from "react";
import { Navbar, Nav, NavbarText } from "reactstrap";

const NavFooter = () => {
  return (
    <Navbar className="footNav" color="dark" dark sticky="bottom">
      <Nav navbar></Nav>
      <NavbarText>
        This website is not affiliated with The Pokemon Company International.
      </NavbarText>
    </Navbar>
  );
};

export default NavFooter;
