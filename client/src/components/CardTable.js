import React, { useState } from "react";
import { Table, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { priceFormatter, getColor, calcPercentChange } from "../helper/format";

const CardTable = ({ data }) => {
  const [sortBy, setSortBy] = useState(
    window.localStorage.getItem("sortBy") || "card_name"
  );
  const [filterBy, setFilterBy] = useState("");

  const setLocalSortBy = (sortBy) => {
    window.localStorage.setItem("sortBy", sortBy);
    setSortBy(sortBy);
  };

  return (
    <div>
      <Input
        placeholder="Filter"
        onChange={(e) => {
          setFilterBy(e.target.value);
        }}
        className="mb-3"
      />
      <Table hover className="allSetsDataTable">
        <thead>
          <tr key="head">
            <th onClick={() => setLocalSortBy("card_name")}>Title</th>
            <th onClick={() => setLocalSortBy("price")}>Price</th>
            <th onClick={() => setLocalSortBy("prev_value")}>Change</th>
            <th onClick={() => setLocalSortBy("prev_value")}>Week</th>
            <th onClick={() => setLocalSortBy("set_name")}>Set</th>
            <th onClick={() => setLocalSortBy("card_number")}>#</th>
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
            .sort((a, b) => {
              return b[sortBy] - a[sortBy];
            })
            .map((el) => (
              <tr key={el.id}>
                <td>
                  <a href={el.url} target="_blank" rel="noreferrer">
                    {el.card_name}
                  </a>
                </td>
                <td>{priceFormatter.format(el.price)}</td>
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
                    to={`/cards/${el.set_name}/${el.time_stamp.split("T")[0]}`}
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
    </div>
  );
};

export default CardTable;
