import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { convertTZ } from "../../helper/format";

const PriceHistory = ({ set, setActiveTab }) => {
  const [selectedSetData, setSelectedSetData] = useState([]);
  const [minDate, setMinDate] = useState();
  const [currentDate, setCurrentDate] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/sets/daterange/set=${set}`).then((res) => {
      setSelectedSetData(res.data);
      setMinDate(new Date(res.data[0].date));
    });
  }, []);

  const handleSelectDate = (date) => {
    const formattedDate = JSON.stringify(date).split("T")[0].replace(/"/g, "");
    setCurrentDate(formattedDate);
  };

  const handleSubmit = () => {
    navigate(`/charts/${set}/${currentDate}`);
    setActiveTab("cardList");
  };

  const getDayPrice = (inputDate) => {
    const index = selectedSetData
      .map((el) => el.date.split("T")[0])
      .indexOf(inputDate);
    if (index >= 0) {
      return `$${selectedSetData[index].set_value}`;
    }
  };

  return (
    <div>
      <h5>Price History</h5>
      <Calendar
        style={{ width: "100%" }}
        className='mb-3'
        calendarType='ISO 8601'
        minDate={minDate}
        maxDate={new Date()}
        onClickDay={(value) => handleSelectDate(value)}
        tileContent={({ activeStartDate, date, view }) => (
          <span className='grayed'>
            <br />
            {getDayPrice(date.toISOString().split("T")[0])}
          </span>
        )}
      />
      <Button
        color='primary'
        disabled={!currentDate}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </div>
  );
};

export default PriceHistory;
