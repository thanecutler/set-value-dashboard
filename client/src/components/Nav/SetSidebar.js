import DonutLarge from "@mui/icons-material/DonutLarge";
import History from "@mui/icons-material/History";
import TrendingUp from "@mui/icons-material/TrendingUp";
import ViewList from "@mui/icons-material/ViewList";
import React from "react";
import { ListGroup, ListGroupItem } from "reactstrap";
import { priceFormatter } from "../../helper/format";
import Select from "react-select";

const SetSidebar = ({
  setName,
  activeTab,
  setActiveTab,
  data,
  setList,
  goToSet,
  date,
}) => {
  return (
    <div className="sidebar">
      <Select
        className="mb-3"
        placeholder="Select a set..."
        options={setList.map((el) => ({
          label: `${el.set_name}`,
          value: el.set_name,
        }))}
        onChange={(e) => {
          goToSet(e.value, date);
        }}
        menuPortalTarget={document.body}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
      />
      <div className="ps-2 mb-2">
        <div>
          <strong>{setName}</strong>{" "}
          {data.length > 0 && (
            <span className="grayed">
              ({data[data.length - 1].card_count} cards)
            </span>
          )}
        </div>
        {data.length > 0 && (
          <>
            <div>
              Price today:{" "}
              <strong>
                {priceFormatter.format(data[data.length - 1].set_value)}
              </strong>
            </div>
            <div>
              High:{" "}
              {priceFormatter.format(
                Math.max(...data.map((el) => el.set_value))
              )}{" "}
            </div>
            <div>
              Low:{" "}
              {priceFormatter.format(
                Math.min.apply(
                  null,
                  data.map((el) => el.set_value).filter(Boolean)
                )
              )}
            </div>
          </>
        )}
      </div>
      <ListGroup flush>
        <ListGroupItem
          action
          className="clickable"
          onClick={() => setActiveTab("chartData")}
          active={activeTab === "chartData"}
        >
          <TrendingUp /> Chart data
        </ListGroupItem>
        <ListGroupItem
          action
          className="clickable"
          onClick={() => setActiveTab("cardList")}
          active={activeTab === "cardList"}
        >
          <ViewList /> Card list
        </ListGroupItem>
        <ListGroupItem
          action
          className="clickable"
          onClick={() => setActiveTab("priceComposition")}
          active={activeTab === "priceComposition"}
        >
          <DonutLarge /> Price composition
        </ListGroupItem>
        <ListGroupItem
          action
          className="clickable"
          onClick={() => setActiveTab("priceHistory")}
          active={activeTab === "priceHistory"}
        >
          <History /> Price history
        </ListGroupItem>
      </ListGroup>
    </div>
  );
};

export default SetSidebar;
