import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Chart from "react-apexcharts";
import { Button, Table, Collapse } from "reactstrap";
import { formatDate, priceFormatter } from "../helper/format";

const ChartData = () => {
  const { set } = useParams();
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [chartOptions, setChartOptions] = useState({
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
          categories: res.data.map((el) => formatDate(el.time_stamp)),
        },
      });
      setSeries([{ name: "Price", data: res.data.map((el) => el.set_value) }]);
    });
  }, [set]);

  return (
    <div>
      {data.length > 0 && (
        <>
          <h3>{set}</h3>
          <h4>
            Price today:{" "}
            <strong>
              {priceFormatter.format(data[data.length - 1].set_value)}
            </strong>
          </h4>
          <span>
            <a href="#" target="_blank">
              TCGPlayer
            </a>
          </span>
          {" | "}
          <span>
            <a
              href={`https://www.ebay.com/sch/?_nkw=pokemon%20${set
                .toLowerCase()
                .replace(" ", "%20")}%20complete&_sop=16`}
              target="_blank"
            >
              eBay
            </a>
          </span>
          <Chart
            options={chartOptions}
            series={series}
            type="line"
            height="550"
          />
          <div className="tableContainer">
            <Button
              color="primary"
              onClick={() => setShowTable(!showTable)}
              style={{
                marginBottom: "1rem",
              }}
            >
              {showTable ? "Hide" : "Show"} history
            </Button>
            <Collapse isOpen={showTable}>
              <Table hover>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Price</th>
                    <th>Card count</th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    // .sort((a, b) => {
                    //   return new Date(b.time_stamp) - new Date(a.time_stamp);
                    // })
                    .map((el) => (
                      <tr key={el.uuid}>
                        <td>
                          <Link
                            to={`/cards/${el.set_name}/${
                              el.time_stamp.split("T")[0]
                            }`}
                          >
                            {formatDate(el.time_stamp)}
                          </Link>
                        </td>
                        <td>{priceFormatter.format(el.set_value)}</td>
                        <td>{el.card_count}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Collapse>
          </div>
        </>
      )}
    </div>
  );
};

export default ChartData;
