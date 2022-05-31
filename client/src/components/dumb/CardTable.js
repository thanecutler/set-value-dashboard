import React, { useState } from "react";
import { Table, Input, Spinner } from "reactstrap";
import { Link } from "react-router-dom";
import {
  priceFormatter,
  getColor,
  calcPercentChange,
} from "../../helper/format";
import axios from "axios";
import AddchartIcon from "@mui/icons-material/Addchart";

const CardTable = ({ data, series, setSeries, dataLength, addToChart }) => {
  const [sortBy, setSortBy] = useState(
    window.localStorage.getItem("sortBy") || "card_name"
  );
  const [filterBy, setFilterBy] = useState("");
  const [addingCard, setAddingCard] = useState("");
  const setLocalSortBy = (sortBy) => {
    window.localStorage.setItem("sortBy", sortBy);
    setSortBy(sortBy);
  };
  const [trackedCards, setTrackedCards] = useState([]);
  const addCardToSeries = (setName, cardName) => {
    if (!series || trackedCards.includes(cardName) || addingCard) {
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
            {addToChart && <th>Add</th>}
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
