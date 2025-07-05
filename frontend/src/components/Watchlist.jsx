import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, X, Bell, Star } from 'lucide-react';

// ✅ Load API key from Vite environment variables
const STOCK_API_KEY = import.meta.env.VITE_STOCK_API_KEY;
const STOCK_API_URL = 'https://www.alphavantage.co/query';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef(null);

  const userId = '123'; // mock user

  // 🔃 Fetch watchlist from backend
  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/watchlist/${userId}`);
        const data = await res.json();
        if (data.stocks && Array.isArray(data.stocks)) {
          setWatchlist(data.stocks);
        } else {
          setWatchlist([]);
        }
      } catch (err) {
        console.error('Error fetching watchlist:', err);
        setError('Failed to load watchlist');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, []);

  // 🔃 Fetch stock prices
  const fetchPrices = async () => {
    if (watchlist.length === 0) return;

    try {
      const updatedStocks = await Promise.all(
        watchlist.map(async (stock) => {
          try {
            const url = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${stock.symbol}&apikey=${STOCK_API_KEY}`;
            const res = await fetch(url);
            const data = await res.json();

            const quote = data['Global Quote'];
            if (quote && Object.keys(quote).length > 0) {
              const price = parseFloat(quote['05. price']);
              const change = parseFloat(quote['09. change']);
              const changePercent = parseFloat(quote['10. change percent']?.replace('%', ''));

              return {
                ...stock,
                price: isNaN(price) ? 0 : price,
                change: isNaN(change) ? 0 : change,
                changePercent: isNaN(changePercent) ? 0 : changePercent,
                lastUpdated: new Date().toISOString(),
              };
            } else {
              return { ...stock, error: 'No quote data available' };
            }
          } catch (err) {
            return { ...stock, error: 'Failed to fetch price' };
          }
        })
      );

      setWatchlist(updatedStocks);
    } catch (err) {
      console.error('Error in fetchPrices:', err);
      setError('Failed to update prices');
    }
  };

  // ⏱️ Poll prices
  useEffect(() => {
    if (watchlist.length === 0) return;
    fetchPrices();
    intervalRef.current = setInterval(fetchPrices, 30000);
    return () => clearInterval(intervalRef.current);
  }, [watchlist.length]);

  const validateStockSymbol = async (symbol) => {
  try {
    const url = `${STOCK_API_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${STOCK_API_KEY}`;
    console.log("🔍 Fetching:", url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("🔍 API response:", data);

    if (data['Note']) {
      return { valid: false, error: 'API rate limit exceeded. Try again later.' };
    }

    if (data['Global Quote'] && Object.keys(data['Global Quote']).length > 0) {
      const quote = data['Global Quote'];
      return {
        valid: true,
        data: {
          symbol: quote['01. symbol'] || symbol.toUpperCase(),
          name: quote['01. symbol'] || symbol.toUpperCase(),
          price: parseFloat(quote['05. price']) || 0,
          change: parseFloat(quote['09. change']) || 0,
          changePercent: parseFloat(quote['10. change percent']?.replace('%', '')) || 0
        }
      };
    } else if (data['Error Message']) {
      return { valid: false, error: 'Invalid stock symbol' };
    } else if (data['Information']) {
      return { valid: false, error: data['Information'] };
    } else {
      return { valid: false, error: 'Invalid stock symbol or no data' };
    }
  } catch (err) {
    console.error('Error validating stock symbol:', err);
    return { valid: false, error: 'Failed to validate symbol' };
  }
};

  const addToWatchlist = async () => {
    if (!newStock.symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    const symbol = newStock.symbol.toUpperCase();
    if (watchlist.some(stock => stock.symbol === symbol)) {
      alert('Stock already in watchlist');
      return;
    }

    setLoading(true);
    try {
      const validation = await validateStockSymbol(symbol);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      const res = await fetch(`http://localhost:5000/api/watchlist/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          name: newStock.name || validation.data.name,
        }),
      });

      const data = await res.json();
      if (data.stocks && Array.isArray(data.stocks)) {
        setWatchlist(data.stocks);
      } else {
        const newStockEntry = {
          ...validation.data,
          addedDate: new Date().toISOString(),
        };
        setWatchlist(prev => [...prev, newStockEntry]);
      }

      setNewStock({ symbol: '', name: '' });
      setShowAddForm(false);
    } catch (err) {
      alert('Failed to add stock');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (symbol) => {
    if (!window.confirm(`Remove ${symbol} from watchlist?`)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/watchlist/${userId}/remove/${symbol}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (data.stocks && Array.isArray(data.stocks)) {
        setWatchlist(data.stocks);
      } else {
        setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
      }
    } catch {
      alert('Failed to remove stock');
    }
  };

  const getFilteredStocks = () => {
    let filtered = watchlist;
    if (filter === 'gainers') {
      filtered = filtered.filter(stock => (stock.change || 0) > 0);
    } else if (filter === 'losers') {
      filtered = filtered.filter(stock => (stock.change || 0) < 0);
    }

    if (searchTerm) {
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (stock.name && stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered;
  };

  const filteredStocks = getFilteredStocks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-yellow-400">FinFolio</h1>
          <p className="text-gray-400">Watchlist & Real-time Updates</p>
        </div>
        <div className="flex space-x-3">
          <Bell />
          <Star />
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 space-y-4 md:space-y-0">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search stocks..."
            className="w-full pl-10 pr-4 py-2 rounded bg-gray-700 text-white placeholder-gray-400"
          />
        </div>
        <div className="flex space-x-2">
          {['all', 'gainers', 'losers'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded ${
                filter === type ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 bg-yellow-400 px-4 py-2 text-black rounded"
        >
          <Plus />
          <span>Add</span>
        </button>
      </div>

      {showAddForm && (
        <div className="mb-6 p-4 bg-gray-700 rounded">
          <input
            value={newStock.symbol}
            onChange={e => setNewStock({ ...newStock, symbol: e.target.value })}
            placeholder="Stock Symbol (e.g., AAPL)"
            className="p-2 rounded mr-2 bg-gray-800 text-white"
          />
          <input
            value={newStock.name}
            onChange={e => setNewStock({ ...newStock, name: e.target.value })}
            placeholder="Company Name (optional)"
            className="p-2 rounded mr-2 bg-gray-800 text-white"
          />
          <button onClick={addToWatchlist} className="bg-green-500 px-4 py-2 rounded text-white">
            Add
          </button>
        </div>
      )}

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {filteredStocks.length === 0 ? (
        <p>No stocks found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredStocks.map(stock => (
            <div
              key={stock.symbol}
              className="p-4 rounded bg-gray-800 relative border border-gray-700 hover:border-yellow-400"
            >
              <button
                onClick={() => removeFromWatchlist(stock.symbol)}
                className="absolute top-2 right-2 text-red-500 hover:text-white"
              >
                <X />
              </button>
              <h3 className="text-xl font-bold">{stock.symbol}</h3>
              <p className="text-gray-400">{stock.name}</p>
              <p className="text-2xl mt-2">${stock.price?.toFixed(2) || '—'}</p>
              <p className={`mt-1 ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {stock.change >= 0 ? <TrendingUp /> : <TrendingDown />}
                {`${stock.change?.toFixed(2) || 0} (${stock.changePercent?.toFixed(2) || 0}%)`}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Last updated: {stock.lastUpdated && new Date(stock.lastUpdated).toLocaleTimeString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
