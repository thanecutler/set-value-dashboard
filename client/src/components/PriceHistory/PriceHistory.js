import React, { useEffect, useState } from "react";
import Select from "react-select";
import Calendar from "react-calendar";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PriceHistory = () => {
  const [setList, setSetList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [currentSet, setCurrentSet] = useState("");
  const [currentDate, setCurrentDate] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    axios.get(`/api/sets/list`).then((res) => {
      setSetList(res.data);
    });
  }, []);

  const handleSelectSet = (set) => {
    setCurrentSet(set);
    axios
      .get(`/api/sets/daterange/set=${set}`)
      .then((res) => setDateRange(res.data.map((el) => el.date)));
  };

  const handleSelectDate = (date) => {
    const formattedDate = JSON.stringify(date).split("T")[0].replace(/"/g, "");

    setCurrentDate(formattedDate);
  };
  const handleSubmit = () => {
    navigate(`/pricehistory/${currentSet}/${currentDate}`);
  };

  return (
    <div>
      <h5>Price History</h5>
      <h6>View price snapshot for</h6>
      <Select
        placeholder={`Select a set`}
        options={setList.map((el) => ({
          label: el.set_name,
          value: el.set_name,
        }))}
        onChange={(e) => handleSelectSet(e.value)}
        className="mb-3"
      />
      {dateRange.length > 0 && (
        <Calendar
          className="mb-3"
          calendarType="ISO 8601"
          minDate={new Date(dateRange[dateRange.length - 1].split("T")[0])}
          maxDate={new Date()}
          onClickDay={(value) => handleSelectDate(value)}
          tileContent={({ activeStartDate, date, view }) =>
            console.log(activeStartDate, date, view)
          }
        />
      )}
      <Button
        color="primary"
        disabled={!currentDate || !currentSet}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
    </div>
  );
};

export default PriceHistory;
