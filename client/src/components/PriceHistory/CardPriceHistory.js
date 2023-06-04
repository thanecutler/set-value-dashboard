import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  calculateAveragePercentChange,
  formatDate,
  priceFormatter,
} from "../../helper/format";
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
    stroke: {
      curve: "smooth",
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
            tickAmount: res.data.length / 15,
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
      {loading && <Spinner>Loading...</Spinner>}
      {!loading && (
        <>
          <div className="setCardTableHeader">
            <div className="selectColumn">
              <h4>{cardName}</h4>
              <h5>
                <Link
                  to={`/charts/${setName}/${
                    data[data.length - 1].time_stamp.split("T")[0]
                  }`}
                >
                  {setName}
                </Link>
              </h5>
            </div>
            <div className="selectColumn">
              {setList.length > 0 && (
                <Select
                  placeholder={`${setName} - cards`}
                  options={setList.map((el) => ({
                    label: el.card_name,
                    value: el.card_name,
                  }))}
                  onChange={(e) => goToCard(e.value)}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              )}
            </div>
          </div>
          <div>
            Current:{" "}
            <strong>
              {priceFormatter.format(data[data.length - 1].price)}
            </strong>
          </div>
          <div>
            High:{" "}
            {priceFormatter.format(Math.max(...data.map((el) => el.price)))}
            <br />
            Low:{" "}
            {priceFormatter.format(
              Math.min.apply(null, data.map((el) => el.price).filter(Boolean))
            )}
            <br />
          </div>
          <div>
            <Chart
              options={chartOptions}
              series={series}
              type="line"
              height="500"
              width="50%"
            />
            Table data container
          </div>
        </>
      )}
    </div>
  );
};

export default CardPriceHistory;
