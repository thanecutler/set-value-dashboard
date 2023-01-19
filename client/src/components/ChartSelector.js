import React, { useState, useEffect } from "react";
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
    <div className='chartContainer'>
      <Routes>
        <Route
          path='/:set/:date'
          element={
            <>
              <ChartData setList={setList} goToSet={goToSet} />
            </>
          }
        />
      </Routes>
    </div>
  );
};

export default ChartSelector;
