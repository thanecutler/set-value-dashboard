import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Table } from "reactstrap";
import { priceFormatter, calcPercentChange } from "../helper/format";
import { Link } from "react-router-dom";
import ChartSVG from "../static/chart.svg";

const AllSets = () => {
  const [dataList, setDataList] = useState([]);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("set_name");
  useEffect(() => {
    axios.get("/api/sets/today").then((res) => {
      setDataList(res.data);
    });
  }, []);

  const getColor = (today, yesterday) => {
    if (today > yesterday) {
      return "green";
    } else if (today === yesterday) {
      return "black";
    }
    return "red";
  };

  return (
    <div>
      <h3>All sets</h3>
      {dataList.length > 0 && (
        <div>
          <div className="setFilterContainer">
            <Input
              placeholder="Filter"
              onChange={(e) => {
                setFilterBy(e.target.value);
              }}
              spellCheck="false"
            />
          </div>
          <Table hover className="allSetsDataTable">
            <thead>
              <tr>
                <th></th>
                <th onClick={() => setSortBy("set_name")}>Set name</th>
                <th onClick={() => setSortBy("card_count")}>Card count</th>
                <th onClick={() => setSortBy("set_value")}>Today</th>
                <th onClick={() => setSortBy("prev_value")}>Last week</th>
                <th>Change</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  {dataList
                    .filter((el) => {
                      return el.set_name
                        .toLowerCase()
                        .includes(filterBy.toLowerCase());
                    })
                    .map((el) => el.card_count)
                    .reduce((prev, curr) => prev + curr, 0)}
                </td>
                <td>
                  {priceFormatter.format(
                    dataList
                      .filter((el) => {
                        return el.set_name
                          .toLowerCase()
                          .includes(filterBy.toLowerCase());
                      })
                      .map((el) => el.set_value)
                      .reduce((prev, curr) => prev + curr, 0)
                  )}
                </td>
                <td>
                  {priceFormatter.format(
                    dataList
                      .filter((el) => {
                        return el.set_name
                          .toLowerCase()
                          .includes(filterBy.toLowerCase());
                      })
                      .map((el) => el.prev_value)
                      .reduce((prev, curr) => prev + curr, 0)
                  )}
                </td>
              </tr>
              {dataList
                .filter((el) => {
                  return el.set_name
                    .toLowerCase()
                    .includes(filterBy.toLowerCase());
                })
                .sort((a, b) => {
                  return b[sortBy] - a[sortBy];
                })
                .map((el, ind) => (
                  <tr
                    onDoubleClick={() => {
                      dataList.splice(ind, 1);
                      setDataList(dataList);
                    }}
                    key={el.uuid}
                  >
                    <td>
                      <Link to={`/charts/${el.set_name}`}>
                        <img
                          src={ChartSVG}
                          style={{ width: "20px", opacity: "0.4" }}
                        />
                      </Link>
                    </td>
                    <td>
                      <Link
                        to={`/cards/${el.set_name}/${
                          el.time_stamp.split("T")[0]
                        }`}
                      >
                        {el.set_name}
                      </Link>
                    </td>
                    <td>
                      <a href={el.url} target="_blank">
                        {el.card_count}
                      </a>
                    </td>
                    <td>{priceFormatter.format(el.set_value)}</td>
                    <td>{priceFormatter.format(el.prev_value)}</td>
                    <td>
                      <span
                        style={{
                          color: getColor(el.set_value, el.prev_value),
                        }}
                      >
                        {calcPercentChange(el.set_value, el.prev_value) > 0 &&
                          "+"}
                        {calcPercentChange(el.set_value, el.prev_value)}%
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AllSets;
