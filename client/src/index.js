import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import ChartSelector from "./components/ChartSelector";
import AllSets from "./components/AllSets";
import SetCardTable from "./components/SetCardTable";
import SearchResults from "./components/SearchResults";
import NotFound from "./components/NotFound";
import PSATable from "./components/PSATable";
import AddPSA from "./components/AddPSA";
import TestChart from "./components/TestChart";
import CardPriceHistory from "./components/CardPriceHistory";
import Stats from "./components/Stats";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/charts/*" element={<ChartSelector />} />
          <Route path="/allsets" element={<AllSets />} />
          <Route path="/testchart" element={<TestChart />} />
          <Route path="/cards">
            <Route path=":set/:date" element={<SetCardTable />} />
          </Route>
          <Route path="/stats" element={<Stats />} />
          <Route path="/psa" element={<PSATable />} />
          <Route path="/psa/add" element={<AddPSA />} />
          <Route path="/search/name=:searchName" element={<SearchResults />} />
          <Route
            path="/card/:setName/:cardName"
            element={<CardPriceHistory />}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
