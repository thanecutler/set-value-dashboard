import React, { useState } from "react";
import { Table, Input } from "reactstrap";
import { Link } from "react-router-dom";
import { priceFormatter } from "../helper/format";
import Checkmark from "../static/checkmark.svg";
import axios from "axios";

const CardTable = ({ cardArray, setData }) => {
  const [sortBy, setSortBy] = useState("card_name");
  const [filterBy, setFilterBy] = useState("");

  const checkCard = (card_name, set_name) => {
    axios.post(`/api/check`, { card_name, set_name }).then((res) => {
      setData(res.data);
    });
  };

  return (
    <div>
      <Input
        placeholder="Filter"
        onChange={(e) => {
          setFilterBy(e.target.value);
        }}
      />
      <Table hover className="allSetsDataTable">
        <thead>
          <tr>
            <th onClick={() => setSortBy("owned")}></th>
            <th onClick={() => setSortBy("card_name")}>Title</th>
            <th onClick={() => setSortBy("price")}>Price</th>
            <th onClick={() => setSortBy("set_name")}>Set name</th>
            <th onClick={() => setSortBy("card_number")}>Number</th>
            <th onClick={() => setSortBy("rarity")}>Rarity</th>
          </tr>
        </thead>
        <tbody>
          {cardArray
            .filter((el) => {
              return el.card_name
                .toLowerCase()
                .includes(filterBy.toLowerCase());
            })
            .sort((a, b) => {
              return b[sortBy] - a[sortBy];
            })
            .map((el) => (
              <tr key={el.id}>
                <td>
                  <img
                    src={Checkmark}
                    onClick={() => checkCard(el.card_name, el.set_name)}
                    style={{
                      width: "20px",
                      opacity: el.is_owned ? "0.8" : "0.2",
                    }}
                  />
                </td>
                <td>
                  <a href={el.url} target="_blank" rel="noreferrer">
                    {el.card_name}
                  </a>
                </td>
                <td>{priceFormatter.format(el.price)}</td>
                <td>
                  <Link
                    to={`/cards/${el.set_name}/${el.time_stamp.split("T")[0]}`}
                  >
                    {el.set_name}
                  </Link>
                </td>
                <td>{el.card_number}</td>
                <td>{el.rarity}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CardTable;
