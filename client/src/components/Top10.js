import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner, Table } from "reactstrap";
import { priceFormatter } from "../helper/format";
import { Link } from "react-router-dom";

const Top10 = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cards/top/today`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h3>Today's Top 10 Cards</h3>
          <Table>
            <thead>
              <tr>
                <th>Card name</th>
                <th>Price</th>
                <th>Set name</th>
                <th>Rarity</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((el) => (
                  <tr key={el.id}>
                    <td>
                      <a href={el.url} target="_blank">
                        {el.card_name}
                      </a>
                    </td>
                    <td>{priceFormatter.format(el.price)}</td>
                    <td>
                      <Link
                        to={`/cards/${el.set_name}/${
                          el.time_stamp.split("T")[0]
                        }`}
                      >
                        {el.set_name}
                      </Link>
                    </td>
                    <td>{el.rarity}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
};

export default Top10;
