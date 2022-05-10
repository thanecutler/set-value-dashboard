import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CardTable from "./dumb/CardTable";
import { getPerformance } from "../helper/format";
import { Spinner } from "reactstrap";

const SearchResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchName } = useParams();
  const [t1, setT1] = useState(0);
  const [t2, setT2] = useState(0);

  useEffect(() => {
    setLoading(true);
    setT1(performance.now());
    axios.get(`/api/cards/search/name=${searchName}`).then((res) => {
      setData(res.data);
      setLoading(false);
      setT2(performance.now());
    });
  }, [searchName]);

  return (
    <div>
      {loading && <Spinner className='spinner'>Loading...</Spinner>}
      {!loading && (
        <>
          <div className='mb-3'>
            Results for '<strong>{searchName}</strong>':{" "}
            {!loading && data.length}
            <div>Executed in {getPerformance(t1, t2)} seconds</div>
          </div>
          <CardTable data={data} />
        </>
      )}
    </div>
  );
};

export default SearchResults;
