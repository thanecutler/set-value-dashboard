import React, { useEffect, useState } from "react";
import Select from "react-select";
import Calendar from "react-calendar";
import { Button } from "reactstrap";
import axios from "axios";

const PriceHistory = () => {
  const [setList, setSetList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  useEffect(() => {
    axios.get(`/api/sets/list`).then((res) => {
      setSetList(res.data);
    });
  }, []);
  const getDateRange = (set) => {
    axios
      .get(`/api/sets/daterange/set=${set}`)
      .then((res) => setDateRange(res.data.map((el) => el.date)));
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
        onChange={(e) => getDateRange(e.value)}
        className="mb-3"
      />
      {dateRange.length > 0 && (
        <Calendar
          className="mb-3"
          calendarType="ISO 8601"
          minDate={new Date(dateRange[dateRange.length - 1].split("T")[0])}
          maxDate={new Date()}
          onClickDay={(value) => console.log(value)}
        />
      )}
      <Button color="primary">Submit</Button>
    </div>
  );
};

export default PriceHistory;
