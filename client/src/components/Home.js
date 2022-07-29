import React from "react";
import { useNavigate } from "react-router-dom";
import { CardBody, Card, CardTitle, CardSubtitle, Button } from "reactstrap";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import HistoryIcon from "@mui/icons-material/History";
import TimelineIcon from "@mui/icons-material/Timeline";
import ThermostatIcon from "@mui/icons-material/Thermostat";

const Home = () => {
  const navigate = useNavigate();
  const goToLink = (link) => {
    navigate(link);
  };
  const tools = [
    {
      icon: <FormatListBulletedIcon />,
      title: "All sets",
      subtitle: "Browse price data in chart format for all available sets",
      link: "/allsets",
    },
    {
      icon: <HistoryIcon />,
      title: "Price history",
      subtitle: "See detailed, complete set price snapshots by day",
      link: "/pricehistory",
    },
    {
      icon: <TimelineIcon />,
      title: "Trend comparison",
      subtitle: "Compare card price trends on a blank chart - coming soon",
      link: "/trendcomparison",
    },
    {
      icon: <ThermostatIcon />,
      title: "Forecasting",
      subtitle:
        "Analyze past data to estimate future performance - coming soon",
      link: "/forecasting",
      disabled: true,
    },
  ];
  return (
    <div>
      <h5>Welcome to Pokemon Data Explorer!</h5>
      <div className="mb-3">
        This site maintains historical information about Pokemon card market
        prices. Data is available as far back as March 6th, 2022 for total set
        prices and March 23rd, 2022 for individual card prices. Note that some
        prices may be incorrect due to multiple factors, such as errors during
        collection or inaccurate calculation.
      </div>
      <div className="mb-3">
        Use the tools below to start exploring the data.
      </div>
      {tools.map((el, ind) => (
        <Card className="mb-2" key={ind}>
          <CardBody>
            <CardTitle tag="h5">
              {el.icon} {el.title}
            </CardTitle>
            <CardSubtitle className="mb-2 text-muted" tag="h6">
              {el.subtitle}
            </CardSubtitle>
            <Button
              color="primary"
              onClick={() => goToLink(el.link)}
              disabled={el.disabled}
            >
              View
            </Button>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default Home;
