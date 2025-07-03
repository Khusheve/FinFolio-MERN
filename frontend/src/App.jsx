import React, { useState } from "react";
import HomePage from "./components/HomePage";
import StockSearch from "./components/StockSearch";
import WatchlistComponent from './components/WatchlistComponent';



const App = () => {
  return (
    <div>
      <div><HomePage /></div>
    <div><StockSearch /></div>
    <div><WatchlistComponent /></div>
    </div>
  )
}

export default App;

