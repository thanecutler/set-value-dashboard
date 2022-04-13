import React, { useState, useEffect } from "react";
import Select from "react-select";
import { Route, Routes, useNavigate } from "react-router-dom";
import ChartData from "./ChartData.js";
const axios = require("axios");

const ChartSelector = () => {
  const [setList, setSetList] = useState([]);
  const navigate = useNavigate();
  const goToSet = (set) => {
    navigate(`/charts/${set}`);
  };

  useEffect(() => {
    axios.get(`/api/sets/list`).then((res) => {
      setSetList(res.data);
    });
  }, []);

  return (
    <div className="chartContainer">
      <div className="optionsContainer">
        <div style={{ width: "100%" }}>
          <Select
            placeholder="Select a set..."
            options={setList.map((el) => ({
              label: el.set_name,
              value: el.set_name,
            }))}
            onChange={(e) => {
              goToSet(e.value);
            }}
          />
        </div>
      </div>
      <Routes>
        <Route
          path="/:set"
          element={
            <>
              <ChartData />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default ChartSelector;
