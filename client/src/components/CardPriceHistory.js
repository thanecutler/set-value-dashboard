import axios from "axios";
import React, { useEffect, useState } from "react";
import { formatDate } from "../helper/format";
import { Link, useNavigate, useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import Select from "react-select";
import { Spinner } from "reactstrap";

const CardPriceHistory = () => {
  const { cardName, setName } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [setList, setSetList] = useState([]);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [data.map((el) => el.time_stamp)],
    },
  });
  const [series, setSeries] = useState([
    { name: "series", data: [data.map((el) => el.price)] },
  ]);

  const goToCard = (card) => {
    navigate(`/card/${setName}/${card.replace("/", "%2F")}`);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/card/set=${setName}/card=${cardName.replace("/", "%2F")}`)
      .then((res) => {
        setData(res.data);
        setChartOptions({
          chart: {
            id: "basic-bar",
          },
          xaxis: {
            categories: res.data.map(
              (el) => formatDate(el.time_stamp).split(",")[0]
            ),
          },
        });
        setSeries([{ name: "Price", data: res.data.map((el) => el.price) }]);
        setLoading(false);
      });
    axios.get(`/api/cards/set=${setName}/today`).then((res) => {
      setSetList(res.data);
    });
  }, [cardName, setName]);
  return (
    <div>
      <div className='setCardTableHeader'>
        <div className='selectColumn'>
          <h4>{cardName}</h4>
          <h5>
            <Link to={`/charts/${setName}`}>{setName}</Link>
          </h5>
        </div>
        <div className='selectColumn'>
          {setList.length > 0 && (
            <Select
              placeholder={setName}
              options={setList.map((el) => ({
                label: el.card_name,
                value: el.card_name,
              }))}
              onChange={(e) => goToCard(e.value)}
            />
          )}
        </div>
      </div>
      {loading && <Spinner>Loading...</Spinner>}
      {!loading && (
        <Chart
          options={chartOptions}
          series={series}
          type='line'
          height='auto'
        />
      )}
    </div>
  );
};

export default CardPriceHistory;
