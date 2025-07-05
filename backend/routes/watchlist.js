
const express = require('express');
const router = express.Router();
const axios = require('axios');
const Watchlist = require('../models/Watchlist');
require('dotenv').config();

// Add stock to watchlist
router.post('/:userId/add', async (req, res) => {
  const { symbol } = req.body;
  const userId = req.params.userId;

  try {
    const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
    const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${symbol}&apikey=${apiKey}`;

    const response = await axios.get(url);
    const data = response.data;

    if (!data.Symbol) return res.status(400).json({ error: 'Invalid symbol' });

    const stockData = {
      symbol: data.Symbol,
      name: data.Name || symbol,
      sector: data.Sector || 'Unknown',
      addedDate: new Date()
    };

    let watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) {
      watchlist = new Watchlist({ userId, stocks: [] });
    }

    const alreadyExists = watchlist.stocks.some(item => item.symbol === stockData.symbol);
    if (alreadyExists) return res.status(409).json({ error: 'Stock already in watchlist' });

    watchlist.stocks.push(stockData);
    await watchlist.save();

    res.status(200).json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Get watchlist
router.get('/:userId', async (req, res) => {
  try {
    const watchlist = await Watchlist.findOne({ userId: req.params.userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });
    res.json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete stock from watchlist
router.delete('/:userId/remove/:symbol', async (req, res) => {
  const { userId, symbol } = req.params;

  try {
    const watchlist = await Watchlist.findOne({ userId });
    if (!watchlist) return res.status(404).json({ error: 'Watchlist not found' });

    watchlist.stocks = watchlist.stocks.filter(stock => stock.symbol !== symbol);
    await watchlist.save();

    res.status(200).json(watchlist);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
