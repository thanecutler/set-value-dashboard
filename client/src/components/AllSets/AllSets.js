import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input, Table, Spinner } from "reactstrap";
import { priceFormatter, getColor } from "../../helper/format";
import { Link } from "react-router-dom";
import PaginationContainer from "../dumb/PaginationContainer";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
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
  const handleSortBy = (sortBy) => {
    if (window.localStorage.getItem("sortBy") === sortBy) {
      setAscending(!ascending);
      window.localStorage.setItem("ascending", !ascending);
      return;
    }
    setCurrentPage(0);
    window.localStorage.setItem("sortBy", sortBy);
    setAscending(true);
    window.localStorage.setItem("ascending", ascending);
    setSortBy(sortBy);
  };
  const [ascending, setAscending] = useState(
    localStorage.getItem("ascending") || true
  );
  const showArrow = (columnName) => {
    if (sortBy === columnName) {
      if (ascending) {
        return <ArrowDropDown />;
      }
      return <ArrowDropUp />;
    }
  };
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
                <th
                  className="clickable"
                  onClick={() => handleSortBy("set_name")}
                >
                  Set name {showArrow("set_name")}{" "}
                </th>
                <th
                  className="clickable text-end"
                  onClick={() => handleSortBy("set_value")}
                >
                  Today {showArrow("set_value")}
                </th>
                <th
                  className="clickable text-end"
                  onClick={() => handleSortBy("prev_value")}
                >
                  14 day prev {showArrow("prev_value")}{" "}
                </th>
                <th
                  className="clickable text-end"
                  onClick={() => handleSortBy("percent_change")}
                >
                  Change {showArrow("percent_change")}
                </th>
                <th
                  className="clickable text-end"
                  onClick={() => handleSortBy("card_count")}
                >
                  Card count {showArrow("card_count")}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Total</td>
                <td className="text-end">
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
                <td className="text-end">
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
                <td className="text-end">
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
                  if (ascending) {
                    return a[sortBy] > b[sortBy]
                      ? 1
                      : b[sortBy] > a[sortBy]
                      ? -1
                      : 0;
                  }
                  return a[sortBy] < b[sortBy]
                    ? 1
                    : b[sortBy] < a[sortBy]
                    ? -1
                    : 0;
                })
                .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
                .map((el) => (
                  <tr key={el.uuid}>
                    <td>
                      <Link to={`/charts/${el.set_name}`}>
                        {el.set_name || el.url}
                      </Link>
                    </td>
                    <td className="text-end">
                      {priceFormatter.format(el.set_value)}
                    </td>
                    <td className="text-end">
                      {priceFormatter.format(el.prev_value)}
                    </td>
                    <td className="text-end">
                      <span
                        style={{
                          color: getColor(el.set_value, el.prev_value),
                        }}
                      >
                        {el.percent_change > 0 && "+"}
                        {el.percent_change}%
                      </span>
                    </td>
                    <td className="text-end">
                      <a href={el.url} target="_blank" rel="noreferrer">
                        {el.card_count}
                      </a>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
          <PaginationContainer
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageCount={pageCount}
            allSets
          />
        </div>
      )}
    </div>
  );
};

export default AllSets;
