import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import { Spinner, TabContent, TabPane } from "reactstrap";
import { commaFormatter, formatDate, priceFormatter } from "../helper/format";
import CardTable from "./dumb/CardTable";
import SetSidebar from "./Nav/SetSidebar";
import PriceHistory from "./PriceHistory/PriceHistory";

const ChartData = ({ setList, goToSet }) => {
  const { set, date } = useParams();
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("chartData");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cardTableLoading, setCardTableLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: set,
      animations: {
        enabled: true,
        easing: "linear",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 1,
        },
      },
    },
    title: {
      text: set,
      align: "left",
    },
  });
  const [series, setSeries] = useState([]);
  const [donutOptions, setDonutOptions] = useState({
    chart: {
      type: "donut",
    },
  });
  const [donutSeries, setDonutSeries] = useState([]);
  useEffect(() => {
    setLoading(true);
    setCardTableLoading(true);
    axios.get(`/api/sets/set=${set}`).then((res) => {
      setData(res.data);
      setChartOptions({
        ...chartOptions,
        xaxis: {
          categories: res.data.map(
            (el) => formatDate(el.time_stamp).split(",")[0]
          ),
          tickAmount: res.data.length / 15 + 1,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "$" + commaFormatter(value);
            },
          },
        },
        title: {
          text: set,
        },
      });
      setSeries([
        { name: "Total set price", data: res.data.map((el) => el.set_value) },
      ]);
      setLoading(false);
    });
    axios.get(`/api/cards/set=${set}/date=${date}`).then((res) => {
      res.data.sort((a, b) => (a.price < b.price ? 1 : -1));
      let remainingCardsTotal = 0;
      let remainingCards = res.data
        .slice(21, res.data.length)
        .map((el) => el.price);
      let remainingCardsObj = {
        card_name: "Remaining cards",
        price: remainingCards.reduce((a, b) => a + b, remainingCardsTotal),
      };
      setCardData(res.data);
      setCardTableLoading(false);
      setDonutOptions({
        ...donutOptions,
        labels: res.data
          .map((el) => `${el.card_name} - ${priceFormatter.format(el.price)}`)
          .slice(0, 20),
      });
      setDonutSeries(res.data.map((el) => el.price).slice(0, 20));
    });
  }, [set, date]);
  return (
    <div>
      <SetSidebar
        setName={set}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        data={data}
        setList={setList}
        goToSet={goToSet}
        date={date}
      />
      <div className="setMainContent">
        {loading ? (
          <Spinner>Loading...</Spinner>
        ) : (
          <>
            <div className="setCardTableHeader">
              <div className="selectColumn">
                <h3>
                  {set}{" "}
                  <span className="grayed">
                    ({data[data.length - 1].card_count} cards)
                  </span>
                </h3>
                <h4>{formatDate(date)}</h4>
              </div>
              <div className="selectColumn">
                <div>
                  <Link
                    to={`/pricehistory/${set}/${
                      data[0].time_stamp.split("T")[0]
                    }`}
                    className="grayed"
                  >
                    Data available from {formatDate(data[0].time_stamp)}
                  </Link>
                </div>
              </div>
            </div>
            <TabContent activeTab={activeTab}>
              <TabPane tabId="chartData">
                <div>
                  Cost of Secret Rares:{" "}
                  {priceFormatter.format(
                    data[data.length - 1].secret_rare_total
                  )}
                </div>
                <div>
                  Cost of Ultra Rares:{" "}
                  {priceFormatter.format(
                    data[data.length - 1].ultra_rare_total
                  )}
                </div>
                <div>
                  Cost of remaining cards: $
                  {data[data.length - 1].other_cards_total}
                </div>
                <Chart options={chartOptions} series={series} height="600px" />
              </TabPane>
              <TabPane tabId="cardList">
                <CardTable
                  data={cardData}
                  series={series}
                  setSeries={setSeries}
                  dataLength={data.length}
                  addToChart
                />
              </TabPane>
              <TabPane tabId="priceComposition">
                <Chart
                  options={donutOptions}
                  series={donutSeries}
                  type="donut"
                  height="600px"
                />
              </TabPane>
              <TabPane tabId="priceHistory">
                <PriceHistory set={set} setActiveTab={setActiveTab} />
              </TabPane>
            </TabContent>
          </>
        )}
      </div>
    </div>
  );
};

export default ChartData;
