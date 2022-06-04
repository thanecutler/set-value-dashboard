import React, { useEffect, useState } from "react";
import { Button, Table } from "reactstrap";
import { Link } from "react-router-dom";

const axios = require("axios");
const PSATable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const removeCard = (id) => {
    setLoading(true);
    axios.delete("/api/psa/remove", { data: { id } }).then((res) => {
      console.log(res);
      setLoading(false);
    });
  };

  useEffect(() => {
    axios.get("/api/psa/all").then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, [loading]);

  return (
    <div>
      <Link to="/psa/add">
        <Button color="primary" className="mb-3">
          + Add card
        </Button>
      </Link>
      {data.length > 0 && (
        <div>
          Cards tracked: {data.length}
          <Table>
            <thead>
              <tr>
                <th>Grade</th>
                <th>Card name</th>
                <th>Set</th>
                <th>Number</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {data.map((el) => (
                <tr key={el.id}>
                  <td>{el.card_grade}</td>
                  <td>{el.card_name}</td>
                  <td>{el.set_name}</td>
                  <td>{el.card_number}</td>
                  <td>
                    <span onClick={() => removeCard(el.id)} className="remove">
                      &#10006;
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

export default PSATable;
