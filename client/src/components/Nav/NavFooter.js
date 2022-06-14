import React from "react";
import { Navbar, Nav, NavbarText, NavItem, NavbarBrand } from "reactstrap";
import GitHubPNG from "../../static/GitHub-Mark/PNG/GitHub-Mark-Light-32px.png";

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
