import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDate, priceFormatter } from "../helper/format";
import CardTable from "./dumb/CardTable";
import { Spinner } from "reactstrap";
import Select from "react-select";

const SetCardTable = () => {
  const { set, date } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const url = `/api/cards/set=${set}/date=${date}`;
  const [dateList, setDateList] = useState([]);
  const [setList, setSetList] = useState([]);
  const navigate = useNavigate();

  const goToSet = (set, date) => {
    navigate(`/cards/${set}/${date}`);
  };

  useEffect(() => {
    axios.get(url).then((res) => {
      setData(res.data);
      setLoading(false);
    });
    axios.get(`/api/sets/dates/set=${set}`).then((res) => {
      setDateList(res.data);
    });
    axios.get(`/api/sets/list`).then((res) => {
      setSetList(res.data);
    });
  }, [set, date, url]);

  return (
    <div>
      {loading && <Spinner>Loading...</Spinner>}
      {date < "2022-03-22" && "Card data not available before Mar 23, 2022"}
      {data.length > 0 && (
        <>
          <div>
            <h4>
              <Link to={`/charts/${set}`}>{set}</Link>
            </h4>
          </div>
          <div className='setCardTableHeader'>
            <div className='selectColumn'>
              <Select
                className='setDataSelect'
                placeholder='Set name'
                options={setList.map((el) => ({
                  label: el.set_name,
                  value: el.set_name,
                }))}
                onChange={(e) => goToSet(e.value, date)}
              />
            </div>
            <div className='selectColumn'>
              <strong>
                {formatDate(date)} - {data.length} cards{" "}
                {priceFormatter.format(
                  data.map((el) => el.price).reduce((sum, a) => sum + a, 0)
                )}
              </strong>
            </div>
            <div className='selectColumn'>
              <Select
                className='setDateSelect'
                placeholder='Card prices by date'
                options={dateList.map((el) => ({
                  label: `${formatDate(el.date)} - ${priceFormatter.format(
                    el.set_value
                  )}`,
                  value: el.date.split("T")[0],
                }))}
                onChange={(e) => {
                  goToSet(set, e.value);
                }}
              />
            </div>
          </div>
          <CardTable data={data} setData={setData} />
        </>
      )}
    </div>
  );
};

export default SetCardTable;
