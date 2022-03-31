import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CardTable from "./CardTable";
import { getPerformance } from "../helper/format";

const SearchResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchName } = useParams();
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);

  useEffect(() => {
    setT1(performance.now());
    axios.get(`/api/cards/search/name=${searchName}`).then((res) => {
      setData(res.data);
      setLoading(false);
      setT2(performance.now());
    });
  }, []);

  return (
    <div>
      {loading && "Loading..."}
      {data.length > 0 && (
        <>
          <div className="mb-3">
            Results for '<strong>{searchName}</strong>':{" "}
            {!loading && data.length}
            <div>Executed in {getPerformance(t1, t2)} seconds</div>
          </div>
          <CardTable cardArray={data} setData={setData} />
        </>
      )}
    </div>
  );
};

export default SearchResults;
