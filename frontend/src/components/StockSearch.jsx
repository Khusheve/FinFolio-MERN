import React, { useState } from "react";

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStock(null);

    try {
      // Call your backend API (not Alpha Vantage directly)
      const response = await fetch(
        `http://localhost:5000/api/stocks/quote?symbol=${query}`
      );
      const data = await response.json();
      if (data && data.symbol) {
        setStock(data);
      } else {
        setError(data.error || "Stock not found.");
      }
    } catch (err) {
      setError("Error fetching stock data.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-lg mx-auto mt-10">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter stock symbol (e.g. AAPL)"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {stock && (
        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold">{stock.symbol}</h2>
          <p className="text-lg">
            Price: <span className="font-semibold">${stock.price}</span>
          </p>
          <p
            className={
              "text-lg font-semibold " +
              (parseFloat(stock.change) >= 0 ? "text-green-600" : "text-red-600")
            }
          >
            {stock.change} ({stock.percent})
          </p>
        </div>
      )}
    </div>
  );
}
