import React, { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp, TrendingDown, X, Bell, Star } from 'lucide-react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newStock, setNewStock] = useState({ symbol: '', name: '' });
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);

  // Sample stock data -  this would come from your backend API
  const stockDatabase = {
    'AAPL': { name: 'Apple Inc.', sector: 'Technology' },
    'GOOGL': { name: 'Alphabet Inc.', sector: 'Technology' },
    'MSFT': { name: 'Microsoft Corporation', sector: 'Technology' },
    'TSLA': { name: 'Tesla Inc.', sector: 'Automotive' },
    'AMZN': { name: 'Amazon.com Inc.', sector: 'E-commerce' },
    'NVDA': { name: 'NVIDIA Corporation', sector: 'Technology' },
    'META': { name: 'Meta Platforms Inc.', sector: 'Technology' },
    'NFLX': { name: 'Netflix Inc.', sector: 'Entertainment' }
  };

  // Simulate real-time stock data
  const generateStockData = (symbol) => {
    const basePrice = Math.random() * 300 + 50;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      name: stockDatabase[symbol]?.name || 'Unknown Company',
      sector: stockDatabase[symbol]?.sector || 'Various',
      price: basePrice,
      change,
      changePercent,
      volume: (Math.random() * 100).toFixed(1) + 'M',
      marketCap: (Math.random() * 2000).toFixed(0) + 'B',
      high52: basePrice * 1.3,
      low52: basePrice * 0.7,
      addedDate: new Date().toLocaleDateString()
    };
  };

  // Add stock to watchlist
  const addToWatchlist = async () => {
    if (!newStock.symbol.trim()) {
      alert('Please enter a stock symbol');
      return;
    }

    const symbol = newStock.symbol.toUpperCase();

    // Check if already exists
    if (watchlist.find(stock => stock.symbol === symbol)) {
      alert('Stock already in watchlist');
      return;
    }

    // In real app, make API call to backend
    // const response = await fetch('/api/watchlist', { method: 'POST', ... });

    const stockData = generateStockData(symbol);
    if (newStock.name.trim()) {
      stockData.name = newStock.name;
    }

    setWatchlist(prev => [...prev, stockData]);
    setNewStock({ symbol: '', name: '' });
    setShowAddForm(false);
  };

  // Remove stock from watchlist
  const removeFromWatchlist = async (symbol) => {
    if (window.confirm(`Remove ${symbol} from watchlist?`)) {
      // In real app, make API call to backend
      // await fetch(`/api/watchlist/${symbol}`, { method: 'DELETE' });

      setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
    }
  };

  // Filter stocks based on current filter
  const getFilteredStocks = () => {
    let filtered = watchlist;

    // Apply performance filter
    switch (filter) {
      case 'gainers':
        filtered = filtered.filter(stock => stock.change > 0);
        break;
      case 'losers':
        filtered = filtered.filter(stock => stock.change < 0);
        break;
      default:
        break;
    }

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(stock =>
        stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // Simulate periodic price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setWatchlist(prev => prev.map(stock => ({
        ...stock,
        ...generateStockData(stock.symbol),
        name: stock.name, // Keep original name
        addedDate: stock.addedDate // Keep original date
      })));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredStocks = getFilteredStocks();

  return (
    <div className="min-h-screen" style={{ 
      background: 'linear-gradient(135deg, #1a2332 0%, #2c3e50 100%)' 
    }}>
      {/* Header */}
      <div className="bg-gray-900 bg-opacity-95 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">FinFolio</h1>
              <span className="text-gray-400">|</span>
              <h2 className="text-xl text-yellow-400 font-semibold">Watchlist & Alerts</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Bell className="w-6 h-6 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Star className="w-6 h-6 text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls Section */}
        <div className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stocks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex space-x-2">
              {['all', 'gainers', 'losers'].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filter === filterType
                      ? 'bg-yellow-400 text-gray-900'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </button>
              ))}
            </div>

            {/* Add Stock Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-6 py-3 rounded-lg transition-all transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Add Stock</span>
            </button>
          </div>

          {/* Add Stock Form */}
          {showAddForm && (
            <div className="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <input
                  type="text"
                  placeholder="Stock Symbol (e.g., AAPL)"
                  value={newStock.symbol}
                  onChange={(e) => setNewStock(prev => ({ ...prev, symbol: e.target.value.toUpperCase() }))}
                  className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  type="text"
                  placeholder="Company Name (optional)"
                  value={newStock.name}
                  onChange={(e) => setNewStock(prev => ({ ...prev, name: e.target.value }))}
                  className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={addToWatchlist}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Watchlist Grid */}
        {filteredStocks.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-bold text-gray-300 mb-2">
              {watchlist.length === 0 ? 'Your watchlist is empty' : 'No stocks match your filters'}
            </h3>
            <p className="text-gray-400">
              {watchlist.length === 0 
                ? 'Add some stocks to start tracking their performance!' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl relative group"
              >
                {/* Remove Button */}
                <button
                  onClick={() => removeFromWatchlist(stock.symbol)}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-600 bg-opacity-0 group-hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4 text-white" />
                </button>

                {/* Stock Header */}
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">{stock.symbol}</h3>
                    <span className="text-sm text-gray-400">{stock.sector}</span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{stock.name}</p>
                </div>

                {/* Price Info */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-white mb-2">
                    ${stock.price.toFixed(2)}
                  </div>
                  <div className={`flex items-center space-x-2 ${
                    stock.change >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {stock.change >= 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span className="font-semibold">
                      {stock.change >= 0 ? '+' : ''}${stock.change.toFixed(2)}
                    </span>
                    <span className="font-semibold">
                      ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>

                {/* Stock Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Volume</span>
                    <span className="text-white font-medium">{stock.volume}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Market Cap</span>
                    <span className="text-white font-medium">${stock.marketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">52W High</span>
                    <span className="text-white font-medium">${stock.high52.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">52W Low</span>
                    <span className="text-white font-medium">${stock.low52.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 mt-3">
                    <span className="text-gray-400">Added</span>
                    <span className="text-white font-medium">{stock.addedDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {filteredStocks.length > 0 && (
          <div className="mt-8 bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-4">Portfolio Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{filteredStocks.length}</div>
                <div className="text-gray-400">Total Stocks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {filteredStocks.filter(s => s.change > 0).length}
                </div>
                <div className="text-gray-400">Gainers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">
                  {filteredStocks.filter(s => s.change < 0).length}
                </div>
                <div className="text-gray-400">Losers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {filteredStocks.filter(s => Math.abs(s.change) < 1).length}
                </div>
                <div className="text-gray-400">Neutral</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;