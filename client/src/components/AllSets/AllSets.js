import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Table, Spinner } from "reactstrap";
import {
  priceFormatter,
  calcPercentChange,
  getColor,
} from "../../helper/format";
import { Link } from "react-router-dom";
import PaginationContainer from "../dumb/PaginationContainer";

const AllSets = () => {
  const [loading, setLoading] = useState(true);
  const [dataList, setDataList] = useState([]);
  const [filterBy, setFilterBy] = useState("");
  const [sortBy, setSortBy] = useState("set_name");
  const [currentPage, setCurrentPage] = useState(0);
  useEffect(() => {
    axios.get("/api/sets/today").then((res) => {
      setLoading(false);
      setDataList(res.data);
    });
  }, []);
  const pageSize = 30;
  const pageCount = Math.ceil(dataList.length / pageSize);
  return (
    <div>
      <h3>All sets {!loading && `(${dataList.length})`}</h3>
      {loading && <Spinner>Loading...</Spinner>}
      {dataList.length > 0 && (
        <div>
          <PaginationContainer
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount}
            allSets
          />
          <div className="setFilterContainer">
            <Input
              placeholder="Filter"
              onChange={(e) => {
                setFilterBy(e.target.value);
                setCurrentPage(0);
              }}
              spellCheck="false"
            />
          </div>
          <Table hover className="allSetsDataTable">
            <thead>
              <tr>
                <th onClick={() => setSortBy("set_name")}>Set name</th>
                <th onClick={() => setSortBy("set_value")}>Today</th>
                <th onClick={() => setSortBy("prev_value")}>14 day prev</th>
                <th>Change</th>
                <th onClick={() => setSortBy("card_count")}>Card count</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total</td>
                <td>
                  {priceFormatter.format(
                    dataList
                      .filter((el) => {
                        return (el.set_name || el.url)
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
                        return (el.set_name || el.url)
                          .toLowerCase()
                          .includes(filterBy.toLowerCase());
                      })
                      .map((el) => el.prev_value)
                      .reduce((prev, curr) => prev + curr, 0)
                  )}
                </td>
                <td></td>
                <td>
                  {dataList
                    .filter((el) => {
                      return (el.set_name || el.url)
                        .toLowerCase()
                        .includes(filterBy.toLowerCase());
                    })
                    .map((el) => el.card_count)
                    .reduce((prev, curr) => prev + curr, 0)}
                </td>
              </tr>
              {dataList
                .filter((el) => {
                  return (el.set_name || el.url)
                    .toLowerCase()
                    .includes(filterBy.toLowerCase());
                })
                .sort((a, b) => {
                  return b[sortBy] - a[sortBy];
                })
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map((el) => (
                  <tr key={el.uuid}>
                    <td>
                      <Link to={`/charts/${el.set_name}`}>
                        {el.set_name || el.url}
                      </Link>
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
                    <td>
                      <a href={el.url} target="_blank" rel="noreferrer">
                        {el.card_count}
                      </a>
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
