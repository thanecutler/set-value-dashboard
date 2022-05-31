import axios from "axios";
import React, { useEffect, useState } from "react";
import { Spinner, Table } from "reactstrap";
import { commaFormatter } from "../helper/format";

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
      <tbody>
        <tr>
          <td>Card row count</td>
          <td>{commaFormatter(data.card_row_count)}</td>
        </tr>
        <tr>
          <td>Set row count</td>
          <td>{commaFormatter(data.set_row_count)}</td>
        </tr>
        <tr>
          <td>Last scan completed</td>
          <td>{data.time_completed}</td>
        </tr>
        <tr>
          <td>Days tracked</td>
          <td>{data.day_count}</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default Stats;
