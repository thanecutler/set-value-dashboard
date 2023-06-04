import React from "react";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
} from "reactstrap";
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
          <NavLink tag={Link} to="/allsets">
            Sets
          </NavLink>
        </NavItem>
        <UncontrolledDropdown nav inNavbar>
          <DropdownToggle nav caret>
            Admin
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem>
              <Link to="/stats">Stats</Link>
            </DropdownItem>
            <DropdownItem>
              <Link to="/metadataviewer">Metadata Viewer</Link>
            </DropdownItem>
            <DropdownItem>Logs</DropdownItem>
          </DropdownMenu>
        </UncontrolledDropdown>
      </Nav>
      <Nav navbar>
        <NavItem>
          <SearchSets />
        </NavItem>
      </Nav>
      {/* <NavbarText>Current market value: $</NavbarText> */}
    </Navbar>
  );
};

export default NavHeader;
