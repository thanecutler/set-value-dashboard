import axios from "axios";
import React, { useEffect, useState } from "react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from "recharts";
import { formatDate } from "../helper/format";

const TestChart = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axios.get(`/api/sets/set=swsh09 brilliant stars`).then((res) => {
      setData(
        res.data.map((el) => ({
          set_value: el.set_value,
          time: formatDate(el.time_stamp),
        }))
      );
    });
    console.log(data);
  }, []);
  return (
    <div>
      {data.length > 0 && (
        <LineChart width={800} height={400} data={data}>
          <Line type="monotone" dataKey="set_value" stroke="#8884d8" />
          <XAxis dataKey="time_stamp" />
        </LineChart>
      )}
    </div>
  );
};

export default TestChart;
