import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import {
  Spinner,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";
import { formatDate, priceFormatter } from "../helper/format";
import CardTable from "./CardTable";

const ChartData = () => {
  const { set } = useParams();
  const [data, setData] = useState([]);
  const [activeTab, setActiveTab] = useState("1");
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartOptions, setChartOptions] = useState({
    chart: {
      id: set,
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
    axios.get(`/api/sets/set=${set}/orderby=time_stamp/dir=asc`).then((res) => {
      setData(res.data);
      setChartOptions({
        ...chartOptions,
        xaxis: {
          categories: res.data.map(
            (el) => formatDate(el.time_stamp).split(",")[0]
          ),
        },
      });
      setSeries([
        { name: "Total set price", data: res.data.map((el) => el.set_value) },
      ]);
    });
    axios.get(`/api/cards/set=${set}/today`).then((res) => {
      setCardData(res.data);
      setDonutOptions({
        ...donutOptions,
        labels: res.data
          .sort((a, b) => (a.price < b.price ? 1 : -1))
          .map((el) => el.card_name)
          .slice(0, 30),
      });
      setDonutSeries(
        res.data
          .sort((a, b) => (a.price < b.price ? 1 : -1))
          .map((el) => el.price)
          .slice(0, 30)
      );
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
          <div className='mb-3'>
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
          </div>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={{ active: activeTab === "1" }}
                onClick={() => {
                  toggle("1");
                }}
              >
                Chart data
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={{ active: activeTab === "2" }}
                onClick={() => {
                  toggle("2");
                }}
              >
                Price composition
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId='1'>
              <Chart options={chartOptions} series={series} height='auto' />
              <div className='tableContainer'>
                <CardTable
                  data={cardData}
                  series={series}
                  setSeries={setSeries}
                />
              </div>
            </TabPane>
            <TabPane tabId='2'>
              <Chart
                options={donutOptions}
                series={donutSeries}
                type='donut'
                height='600px'
              />
            </TabPane>
          </TabContent>
        </>
      )}
    </div>
  );
};

export default ChartData;
