import React, { useState, useRef,useEffect } from "react";

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const timeoutRef = useRef(null);

  useEffect(() => {
  console.log("Suggestions:", suggestions);
}, [suggestions]);

 useEffect(() => {
  console.log("Stock:", stock);
}, [stock]);


  // Fetch autocomplete suggestions
  const handleInputChange = (e) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);
    setStock(null);
    setError("");
    setSuggestions([]);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (value.length < 2) return; // Only search after 2+ chars

    timeoutRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/stocks/autocomplete?keyword=${value}`
        );
        const data = await res.json();
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      }
    }, 300); // Debounce for 300ms
  };

  // When user clicks a suggestion
  const handleSuggestionClick = (symbol) => {
    setQuery(symbol);
    setSuggestions([]);
  };

  // Search for stock details
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setStock(null);

    try {
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
      <form onSubmit={handleSearch} className="flex gap-2 relative">
        <input
          type="text"
          placeholder="Enter stock symbol or name (e.g. AAPL, TATA)"
          value={query}
          onChange={handleInputChange}
          className="flex-1 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-200"
          autoComplete="off"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700 transition"
        >
          {loading ? "Searching..." : "Search"}
        </button>
        {/* Suggestions dropdown */}
        {suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-12 bg-white border rounded shadow z-10 max-h-48 overflow-y-auto">
            {suggestions.map((s, idx) => (
              <li
                key={s.symbol + idx}
                className="px-4 py-2 hover:bg-green-50 cursor-pointer"
                onClick={() => handleSuggestionClick(s.symbol)}
              >
                <span className="font-semibold">{s.symbol}</span> - {s.name} ({s.region})
              </li>
            ))}
          </ul>
        )}
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {stock && (
  <div className="mt-6 text-center">
    <h2 className="text-2xl text-green-600 font-bold">{stock.symbol}</h2>
    <p className="text-lg">
      Price: <span className="font-semibold">${stock.price}</span>
    </p>
    <p>Open: <span className="font-semibold">${stock.open || "-"}</span></p>
    <p>High: <span className="font-semibold">${stock.high || "-"}</span></p>
    <p>Low: <span className="font-semibold">${stock.low || "-"}</span></p>
    <p>Previous Close: <span className="font-semibold">${stock.previousClose || "-"}</span></p>
    <p>Volume: <span className="font-semibold">{stock.volume || "-"}</span></p>
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
