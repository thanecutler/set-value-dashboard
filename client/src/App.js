import "./App.css";
import {
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  NavbarText,
} from "reactstrap";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import Top10 from "./components/Top10";
import SearchSets from "./components/SearchSets";

function App() {
  return (
    <div className="app">
      <Navbar color="dark" dark expand="md" fixed="top">
        <Nav className="me-auto" navbar>
          <NavbarBrand tag={Link} to="/">
            Set Price Tracker
          </NavbarBrand>
          <NavItem>
            <NavLink tag={Link} to="/allsets">
              All sets
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/charts">
              Charts
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink tag={Link} to="/psa">
              PSA
            </NavLink>
          </NavItem>
        </Nav>
        <Nav navbar>
          <NavItem>
            <SearchSets />
          </NavItem>
        </Nav>
        {/* <NavbarText>Current market value: $</NavbarText> */}
      </Navbar>
      <div className="spacer"></div>
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <h2>Set Price Tracker</h2>
                <Top10 />
              </>
            }
          />
        </Routes>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
