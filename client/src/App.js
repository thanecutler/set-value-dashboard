import "./App.css";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";
import { Link, Outlet, Routes, Route } from "react-router-dom";
import AllSets from "./components/AllSets";
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
            <NavLink tag={Link} to="/stats">
              Stats
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
                <AllSets />
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
