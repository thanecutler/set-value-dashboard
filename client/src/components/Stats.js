import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "reactstrap";

const Stats = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios.get("/api/databasestats").then((res) => {
      setLoading(false);
      setData(res.data[0]);
    });
  }, []);
  return loading ? (
    <Spinner />
  ) : (
    <Table>
      <thead>
        <tr>
          <th>Card data table row count</th>
          <th>Set data table row count</th>
          <th>Last scan completed</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{data.card_row_count}</td>
          <td>{data.set_row_count}</td>
          <td>{data.time_completed}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Stats;
