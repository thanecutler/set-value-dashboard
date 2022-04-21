import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import { Spinner } from "reactstrap";
import { formatDate, priceFormatter } from "../helper/format";
import CardTable from "./CardTable";

const ChartData = () => {
  const { set } = useParams();
  const [data, setData] = useState([]);
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({
    series: [
      {
        name: set,
      },
    ],
    chart: {
      id: "basic-bar",
    },
    xaxis: {
      categories: [data.map((el) => el.time_stamp)],
    },
  });
  const [series, setSeries] = useState([
    { name: "series", data: [data.map((el) => el.set_value)] },
  ]);

  useEffect(() => {
    axios.get(`/api/sets/set=${set}/orderby=time_stamp/dir=asc`).then((res) => {
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
      setSeries([{ name: "Price", data: res.data.map((el) => el.set_value) }]);
    });
    axios.get(`/api/cards/set=${set}/today`).then((res) => {
      setCardData(res.data);
      setLoading(false);
    });
  }, [set]);

  return (
    <div>
      {loading && <Spinner>Loading...</Spinner>}
      {!loading && (
        <>
          <h3>{set}</h3>
          <h4>
            Price today:{" "}
            <strong>
              {priceFormatter.format(data[data.length - 1].set_value)}
            </strong>
          </h4>
          <span className='chartLink'>
            <a href={data[0].url} target='_blank' rel='noreferrer'>
              TCGPlayer
            </a>
          </span>
          <span className='chartLink'>
            <a
              href={`https://www.ebay.com/sch/?_nkw=pokemon%20${set
                .toLowerCase()
                .replace(" ", "%20")}%20complete&_sop=16`}
              target='_blank'
              rel='noreferrer'
            >
              eBay
            </a>
          </span>
          <span className='chartLink'>
            <Link
              to={`/cards/${set}/${
                data[data.length - 1].time_stamp.split("T")[0]
              }`}
            >
              Price history
            </Link>
          </span>
          <Chart options={chartOptions} series={series} height='auto' />
          <div className='tableContainer'>
            <CardTable data={cardData} />
          </div>
        </>
      )}
    </div>
  );
};

export default ChartData;
