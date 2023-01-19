import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import ChartSelector from "./components/ChartSelector";
import AllSets from "./components/AllSets/AllSets";
import SetCardTable from "./components/PriceHistory/SetPriceHistory";
import SearchResults from "./components/SearchResults";
import NotFound from "./components/NotFound";
import PSATable from "./components/PSA/PSATable";
import AddPSA from "./components/PSA/AddPSA";
import CardPriceHistory from "./components/PriceHistory/CardPriceHistory";
import Stats from "./components/Stats";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import PriceHistory from "./components/PriceHistory/PriceHistory";
import TrendComparison from "./components/TrendComparison/TrendComparison";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/charts/*' element={<ChartSelector />} />
          <Route path='/allsets' element={<AllSets />} />
          <Route path='/pricehistory' element={<PriceHistory />} />
          <Route path='/pricehistory/:set/:date' element={<SetCardTable />} />
          <Route path='/trendcomparison' element={<TrendComparison />} />
          <Route path='/stats' element={<Stats />} />
          <Route path='/psa' element={<PSATable />} />
          <Route path='/psa/add' element={<AddPSA />} />
          <Route path='/search/name=:searchName' element={<SearchResults />} />
          <Route
            path='/card/:setName/:cardName'
            element={<CardPriceHistory />}
          />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
