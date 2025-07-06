import React, { useEffect, useState } from "react";
import holdingsData from "./holdings.json"; // Adjust path as needed
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

// Replace with your actual Alpha Vantage API key
const ALPHA_VANTAGE_API_KEY = "yZMMXFRUCEV6AKB0S";


import { useNavigate } from "react-router-dom";

const PortfolioHoldings = () => {
  const [holdings, setHoldings] = useState(holdingsData);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch current prices for all holdings
  useEffect(() => {
    const fetchPrices = async () => {
      setLoading(true);
      setError("");
      const newPrices = {};
      for (const h of holdings) {
        try {
          const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${h.symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
          const response = await axios.get(url);
          const data = response.data["Global Quote"];
          if (data && data["05. price"]) {
            newPrices[h.symbol] = Number(data["05. price"]);
          } else {
            newPrices[h.symbol] = null;
          }
        } catch {
          newPrices[h.symbol] = null;
        }
      }
      setPrices(newPrices);
      setLoading(false);
    };
    fetchPrices();
    // eslint-disable-next-line
  }, [holdings]);

  // Calculate total investment
  const totalInvestment = holdings.reduce(
    (sum, h) => sum + h.purchasePrice * h.quantity,
    0
  );

  // Sell handler
  const handleSell = (symbol) => {
    setHoldings(holdings.filter((h) => h.symbol !== symbol));
  };

  // Prepare data for the line chart
  const chartData = holdings.map(h => {
    const invested = h.purchasePrice * h.quantity;
    const currentPrice = prices[h.symbol];
    const currentValue = currentPrice ? currentPrice * h.quantity : 0;
    const profitLoss = currentPrice ? currentValue - invested : 0;
    return {
      name: h.symbol,
      profitLoss: Number(profitLoss.toFixed(2))
    };
  });

  return (
    <div className="flex flex-col md:flex-row w-full max-w-7xl mx-auto px-2">
      {/* Holdings box on the left */}
      <div className="w-full md:w-3/4 bg-white rounded-lg shadow p-8 mt-8 md:mr-8 relative min-h-[500px] flex flex-col">
        {/* Total Investment on top right */}
        <div className="absolute right-8 top-8 text-xl font-bold text-green-700">
          Total Investment: ₹{totalInvestment.toFixed(2)}
        </div>
        <h2 className="text-3xl font-bold text-green-700 mb-6">Your Holdings</h2>
        <table className="min-w-full bg-white border mb-4">
          <thead>
            <tr className="bg-green-50">
              <th className="py-2 px-4 border-b text-left">Symbol</th>
              <th className="py-2 px-4 border-b text-left">Quantity</th>
              <th className="py-2 px-4 border-b text-left">Purchase Price</th>
              <th className="py-2 px-4 border-b text-left">Current Price</th>
              <th className="py-2 px-4 border-b text-left">Invested</th>
              <th className="py-2 px-4 border-b text-left">Current Value</th>
              <th className="py-2 px-4 border-b text-left">P/L</th>
              <th className="py-2 px-4 border-b text-left">ROI (%)</th>
              <th className="py-2 px-4 border-b text-left"></th>
            </tr>
          </thead>
          <tbody>
            {holdings.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No holdings to display.
                </td>
              </tr>
            )}
            {holdings.map((h) => {
              const invested = h.purchasePrice * h.quantity;
              const currentPrice = prices[h.symbol];
              const currentValue = currentPrice ? currentPrice * h.quantity : 0;
              const profitLoss = currentPrice ? currentValue - invested : 0;
              const roi = invested ? (profitLoss / invested) * 100 : 0;
              return (
                <tr key={h.symbol}>
                  <td className="py-2 px-4 border-b">{h.symbol}</td>
                  <td className="py-2 px-4 border-b">{h.quantity}</td>
                  <td className="py-2 px-4 border-b">₹{h.purchasePrice}</td>
                  <td className="py-2 px-4 border-b">
                    {loading
                      ? "Loading..."
                      : currentPrice
                      ? `₹${currentPrice.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">₹{invested.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b">
                    {currentPrice ? `₹${currentValue.toFixed(2)}` : "--"}
                  </td>
                  <td
                    className={`py-2 px-4 border-b ${
                      profitLoss >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {currentPrice ? `₹${profitLoss.toFixed(2)}` : "--"}
                  </td>
                  <td
                    className={`py-2 px-4 border-b ${
                      roi >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {currentPrice ? `${roi.toFixed(2)}%` : "--"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleSell(h.symbol)}
                      className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {/* Add Holding Button at the bottom */}
        <button
          onClick={() => navigate("/stock-search")}
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-3 rounded text-lg transition"
        >
          + Add Holding
        </button>
        {error && (
          <div className="mt-4 text-red-600 font-semibold">{error}</div>
        )}
      </div>
      {/* Right side: Profit/Loss Line Chart */}
      <div className="w-full md:w-1/4 flex flex-col items-center justify-center mt-8">
        <h3 className="text-xl font-bold mb-4 text-green-700">Profit/Loss per Stock</h3>
        <div className="w-full h-96 bg-white rounded-lg shadow flex items-center justify-center p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profitLoss" stroke="#16a34a" strokeWidth={3} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PortfolioHoldings;
