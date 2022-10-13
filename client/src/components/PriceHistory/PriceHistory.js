import React, { useEffect, useState } from "react";
import Select from "react-select";
import Calendar from "react-calendar";
import { Button } from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PriceHistory = () => {
  const [setList, setSetList] = useState([]);
  const [selectedSetData, setSelectedSetData] = useState([]);
  const [minDate, setMinDate] = useState();
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
    axios.get(`/api/sets/daterange/set=${set}`).then((res) => {
      setSelectedSetData(
        res.data.map((el) => ({ ...el, date: new Date(el.date) }))
      );
      setMinDate(new Date(res.data[0].date));
    });
  };

  const handleSelectDate = (date) => {
    const formattedDate = JSON.stringify(date).split("T")[0].replace(/"/g, "");

    setCurrentDate(formattedDate);
  };
  const handleSubmit = () => {
    navigate(`/pricehistory/${currentSet}/${currentDate}`);
  };

  const getDayPrice = (inputDate) => {
    console.log();
    const index = selectedSetData
      .map((el) => el.date.getTime())
      .indexOf(inputDate.getTime());
    if (index >= 0) {
      return `$${selectedSetData[index].set_value}`;
    }
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
      {selectedSetData.length > 0 && (
        <Calendar
          style={{ width: "100%" }}
          className="mb-3"
          calendarType="ISO 8601"
          minDate={minDate}
          maxDate={new Date()}
          onClickDay={(value) => handleSelectDate(value)}
          tileContent={({ activeStartDate, date, view }) => (
            <span className="grayed">
              <br />
              {getDayPrice(date)}
            </span>
          )}
        />
      )}
      <Button
        color="primary"
        disabled={!currentDate || !currentSet}
        onClick={() => handleSubmit()}
      >
        Submit
      </Button>
      {setList.map((el) => el.set_value)}
    </div>
  );
};

export default PriceHistory;
