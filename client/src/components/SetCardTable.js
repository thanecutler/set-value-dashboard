import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { formatDate, priceFormatter } from "../helper/format";
import CardTable from "./CardTable";

const SetCardTable = () => {
  const { set, date } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/api/cards/set=${set}/date=${date}`).then((res) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {loading && "Loading..."}
      {data.length > 0 && (
        <>
          <h3>
            <Link to={`/charts/${set}`}>{set}</Link>
          </h3>
          <h4>
            {formatDate(date)} - {data.length} cards{" "}
            {priceFormatter.format(
              data.map((el) => el.price).reduce((sum, a) => sum + a, 0)
            )}
          </h4>
          <CardTable cardArray={data} setData={setData} />
        </>
      )}
    </div>
  );
};

export default SetCardTable;
