import React from "react";
import Select from "react-select";
import { Route, Routes, useNavigate } from "react-router-dom";
import ChartData from "./ChartData.js";

const ChartSelector = () => {
  const setsOptions = require("../static/options.js").setsOptions;

  const navigate = useNavigate();
  const goToSet = (set) => {
    navigate(`/charts/${set}`);
  };

  return (
    <div className="chartContainer">
      <div className="optionsContainer">
        <div style={{ width: "100%" }}>
          <Select
            placeholder="Select a set..."
            options={setsOptions}
            onChange={(e) => {
              goToSet(e.value);
            }}
          />
        </div>
      </div>
      <Routes>
        <Route path="/:set" element={<ChartData />} />
      </Routes>
    </div>
  );
};

export default ChartSelector;
