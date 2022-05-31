import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import Select from "react-select";
import {
  Spinner,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { commaFormatter, formatDate, priceFormatter } from "../helper/format";
import CardTable from "./dumb/CardTable";
import classnames from "classnames";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import DonutLargeIcon from "@mui/icons-material/DonutLarge";

const ChartData = ({ setList, goToSet }) => {
  const { set } = useParams();
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: set,
      animations: {
        enabled: true,
        easing: "easein",
        speed: 800,
        animateGradually: {
          enabled: true,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
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

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };
  useEffect(() => {
    setLoading(true);
    axios.get(`/api/sets/set=${set}/orderby=time_stamp/dir=asc`).then((res) => {
      setData(res.data);
      setChartOptions({
        ...chartOptions,
        xaxis: {
          categories: res.data.map(
            (el) => formatDate(el.time_stamp).split(",")[0]
          ),
          tickAmount: res.data.length / 15,
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return "$" + commaFormatter(value);
            },
          },
        },
      });
      setSeries([
        { name: "Total set price", data: res.data.map((el) => el.set_value) },
      ]);
      setLoading(false);
    });
    axios.get(`/api/cards/set=${set}/today`).then((res) => {
      setCardData(res.data);
      setDonutOptions({
        ...donutOptions,
        labels: res.data
          .sort((a, b) => (a.price < b.price ? 1 : -1))
          .map((el) => `${el.card_name} - ${priceFormatter.format(el.price)}`)
          .slice(0, 30),
      });
      setDonutSeries(
        res.data
          .sort((a, b) => (a.price < b.price ? 1 : -1))
          .map((el) => el.price)
          .slice(0, 30)
      );
    });
  }, [set]);
  return (
    <div>
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
              <h4>
                Price today:{" "}
                <strong>
                  {priceFormatter.format(data[data.length - 1].set_value)}
                </strong>
              </h4>
              {/* <div className="mb-3">
                <span className="chartLink">
                  <a href={data[0].url} target="_blank" rel="noreferrer">
                    TCGPlayer
                  </a>
                </span>
                <span className="chartLink">
                  <a
                    href={`https://www.ebay.com/sch/?_nkw=pokemon%20${set
                      .toLowerCase()
                      .replace(" ", "%20")}%20complete&_sop=16`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    eBay
                  </a>
                </span>
                <span className="chartLink">
                  <Link
                    to={`/cards/${set}/${
                      data[data.length - 1].time_stamp.split("T")[0]
                    }`}
                  >
                    Price history
                  </Link>
                </span>
              </div> */}
            </div>
            <div className="selectColumn">
              <Select
                placeholder="Select a set..."
                options={setList.map((el) => ({
                  label: el.set_name,
                  value: el.set_name,
                }))}
                onChange={(e) => {
                  goToSet(e.value);
                }}
              />
            </div>
          </div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "1" })}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  toggle("1");
                }}
              >
                <TrendingUpIcon /> Chart data
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: activeTab === "2" })}
                style={{ cursor: "pointer" }}
                onClick={() => {
                  toggle("2");
                }}
              >
                <DonutLargeIcon /> Price composition
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">
              <Chart options={chartOptions} series={series} height="600px" />
              <div className="tableContainer">
                <CardTable
                  data={cardData}
                  series={series}
                  setSeries={setSeries}
                  dataLength={data.length}
                  addToChart
                />
              </div>
            </TabPane>
            <TabPane tabId="2">
              <Chart
                options={donutOptions}
                series={donutSeries}
                type="donut"
                height="600px"
              />
            </TabPane>
          </TabContent>
        </>
      )}
    </div>
  );
};

export default ChartData;
