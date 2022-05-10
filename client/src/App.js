import "./App.css";
import { Outlet, Routes, Route } from "react-router-dom";
import AllSets from "./components/AllSets";
import NavHeader from "./components/NavHeader";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;
  const [username, setUsername] = useState("");
  useEffect(() => {
    axios.get(`/api/login`).then((res) => {
      if (res.data.username) {
        setUsername(res.data.username);
      }
    });
  }, []);
  return (
    <div className='app'>
      <NavHeader username={username} />
      <div className='spacer'></div>
      <main>
        <Routes>
          <Route
            path='/'
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
