import React, { useEffect, useState } from "react";
import axios from "axios";

const PortfolioReturns = ({ userId }) => {
  const [returns, setReturns] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    axios
      .get(`/api/portfolio/${userId}/returns`)
      .then(res => setReturns(res.data))
      .catch(() => setError("Failed to fetch returns"));
  }, [userId]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8 text-red-600">
        {error}
      </div>
    );
  }

  if (!returns) return <div className="text-center mt-8">Loading...</div>;

  // Defensive helpers
  const safe = val => Number(val || 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Your Returns</h2>
      <div className="mb-4">
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Total Invested:</span>
          <span>₹{safe(returns.totalInvested).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Current Value:</span>
          <span>₹{safe(returns.totalCurrent).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Total Profit/Loss:</span>
          <span className={safe(returns.totalPL) >= 0 ? "text-green-600" : "text-red-600"}>
            ₹{safe(returns.totalPL).toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="font-medium text-gray-700">Total ROI:</span>
          <span className={safe(returns.totalROI) >= 0 ? "text-green-600" : "text-red-600"}>
            {safe(returns.totalROI).toFixed(2)}%
          </span>
        </div>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-green-50">
            <th className="py-2 px-4 border-b text-left">Symbol</th>
            <th className="py-2 px-4 border-b text-left">Qty</th>
            <th className="py-2 px-4 border-b text-left">Invested</th>
            <th className="py-2 px-4 border-b text-left">Current</th>
            <th className="py-2 px-4 border-b text-left">P/L</th>
            <th className="py-2 px-4 border-b text-left">ROI (%)</th>
          </tr>
        </thead>
        <tbody>
          {(returns.detailed || []).length === 0 && (
            <tr>
              <td colSpan="6" className="text-center py-4 text-gray-500">
                No holdings found.
              </td>
            </tr>
          )}
          {(returns.detailed || []).map(h => (
            <tr key={h.symbol}>
              <td className="py-2 px-4 border-b">{h.symbol}</td>
              <td className="py-2 px-4 border-b">{safe(h.quantity)}</td>
              <td className="py-2 px-4 border-b">₹{safe(h.invested).toFixed(2)}</td>
              <td className="py-2 px-4 border-b">₹{safe(h.current).toFixed(2)}</td>
              <td className={`py-2 px-4 border-b ${safe(h.profitLoss) >= 0 ? "text-green-600" : "text-red-600"}`}>
                ₹{safe(h.profitLoss).toFixed(2)}
              </td>
              <td className={`py-2 px-4 border-b ${safe(h.roi) >= 0 ? "text-green-600" : "text-red-600"}`}>
                {safe(h.roi).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PortfolioReturns;

