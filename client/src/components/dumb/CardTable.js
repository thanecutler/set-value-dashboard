import React, { useState } from "react";
import { Table, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import {
  priceFormatter,
  getColor,
  calcPercentChange,
} from "../../helper/format";
import axios from "axios";
import AddchartIcon from "@mui/icons-material/Addchart";
import PaginationContainer from "./PaginationContainer";
import ArrowDropUp from "@mui/icons-material/ArrowDropUp";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";

const CardTable = ({
  data,
  series,
  setSeries,
  dataLength,
  addToChart,
  pageSize = 15,
}) => {
  const [sortBy, setSortBy] = useState(
    window.localStorage.getItem("sortBy") || "card_name"
  );
  const [filterBy] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const pageCount = Math.ceil(data.length / pageSize);
  const [addingCard, setAddingCard] = useState("");
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
  const [trackedCards, setTrackedCards] = useState([]);
  const addCardToSeries = (setName, cardName) => {
    if (!series || trackedCards.includes(cardName) || addingCard !== "") {
      return;
    }
    if (!trackedCards.includes(cardName)) {
      setAddingCard(cardName);
      axios
        .get(`/api/card/set=${setName}/card=${cardName.replace("/", "%2F")}`)
        .then((res) => {
          setTrackedCards(trackedCards.concat([cardName]));
          setSeries(
            series.concat([
              {
                name: cardName,
                data: Array(dataLength - res.data.length)
                  .fill(null)
                  .concat(res.data.map((el) => el.price)),
              },
            ])
          );
          setAddingCard("");
        });
    }
  };
  const [ascending, setAscending] = useState(
    localStorage.getItem("ascending") || true
  );
  const handleSort = (a, b) => {
    if (ascending) {
      return a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0;
    }
    return a[sortBy] < b[sortBy] ? 1 : b[sortBy] < a[sortBy] ? -1 : 0;
  };
  const showArrow = (columnName) => {
    if (sortBy === columnName) {
      if (ascending) {
        return <ArrowDropUp />;
      }
      return <ArrowDropDown />;
    }
  };
  return (
    <div>
      <PaginationContainer
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Table hover className="allSetsDataTable">
        <thead>
          <tr key="head">
            {addToChart && <th>Add</th>}
            <th className="clickable" onClick={() => handleSortBy("card_name")}>
              Title {showArrow("card_name")}
            </th>
            <th className="clickable" onClick={() => handleSortBy("price")}>
              Price {showArrow("price")}
            </th>
            <th>Change</th>
            <th
              className="clickable"
              onClick={() => handleSortBy("prev_value")}
            >
              Week {showArrow("prev_value")}
            </th>
            <th className="clickable" onClick={() => handleSortBy("set_name")}>
              Set {showArrow("set_name")}
            </th>
            <th
              className="clickable"
              onClick={() => handleSortBy("card_number")}
            >
              # {showArrow("card_number")}
            </th>
            {/* <th onClick={() => setSortBy("rarity")}>Rarity</th> */}
          </tr>
        </thead>
        <tbody>
          {data
            .filter((el) => {
              return (el.card_name || "")
                .toLowerCase()
                .includes(filterBy.toLowerCase());
            })
            .sort((a, b) => handleSort(a, b))
            .slice(currentPage * pageSize, (currentPage + 1) * pageSize)
            .map((el) => (
              <tr key={el.id}>
                {addToChart && (
                  <td
                    onClick={() => addCardToSeries(el.set_name, el.card_name)}
                  >
                    {addingCard === el.card_name ? (
                      <Spinner size="sm" />
                    ) : (
                      <AddchartIcon
                        opacity={trackedCards.includes(el.card_name) ? 1 : 0.3}
                        style={{
                          cursor:
                            !trackedCards.includes(el.card_name) && "pointer",
                          zIndex: -1,
                        }}
                      />
                    )}
                  </td>
                )}
                <td>
                  {addingCard === el.card_name ? (
                    <span className="grayed">Adding {el.card_name}...</span>
                  ) : (
                    <Link
                      to={`/card/${el.set_name}/${
                        el.card_name && el.card_name.replace("/", "%2F")
                      }`}
                    >
                      {el.card_name}
                    </Link>
                  )}
                </td>
                <td>
                  <a href={el.url} target="_blank" rel="noreferrer">
                    {priceFormatter.format(el.price)}
                  </a>
                </td>
                {el.prev_value ? (
                  <td>
                    <span
                      style={{
                        color: getColor(el.price, el.prev_value),
                      }}
                    >
                      {calcPercentChange(el.price, el.prev_value) > 0 && "+"}
                      {calcPercentChange(el.price, el.prev_value)}%
                    </span>
                  </td>
                ) : (
                  <td></td>
                )}
                {el.prev_value ? (
                  <td>{priceFormatter.format(el.prev_value)}</td>
                ) : (
                  <td></td>
                )}
                <td>
                  <Link
                    to={`/pricehistory/${el.set_name}/${
                      el.time_stamp.split("T")[0]
                    }`}
                  >
                    {el.set_name}
                  </Link>
                </td>
                <td>{el.card_number}</td>
                {/* <td>{el.rarity}</td> */}
              </tr>
            ))}
        </tbody>
      </Table>
      <div className="mb-3">
        Showing <strong>{currentPage * pageSize + 1}</strong> -{" "}
        <strong>
          {(currentPage + 1) * pageSize > data.length
            ? data.length
            : (currentPage + 1) * pageSize}
        </strong>{" "}
        of {data.length}
      </div>
      <PaginationContainer
        pageCount={pageCount}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
};

export default CardTable;
