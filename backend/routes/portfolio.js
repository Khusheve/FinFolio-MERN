const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');
const calculateReturns = require('../utils/calculateReturns');
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Helper to fetch current price from Alpha Vantage
async function fetchCurrentPrice(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
    const response = await axios.get(url);
    const data = response.data["Global Quote"];
    if (data && data["05. price"]) {
      return parseFloat(data["05. price"]);
    }
    return null;
  } catch (err) {
    console.error("Alpha Vantage fetch error:", err.message);
    return null;
  }
}

// Add or update a holding with current price
router.post('/:userId/holdings', async (req, res) => {
  const { userId } = req.params;
  const { symbol, quantity, purchasePrice } = req.body;

  // Fetch the current price
  const currentPrice = await fetchCurrentPrice(symbol);
  if (!currentPrice) {
    return res.status(400).json({ error: "Could not fetch current price for symbol." });
  }

  let portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) {
    portfolio = new Portfolio({ user: userId, holdings: [] });
  }

  const holding = portfolio.holdings.find(h => h.symbol === symbol);
  if (holding) {
    holding.quantity = quantity;
    holding.purchasePrice = purchasePrice;
    holding.currentPrice = currentPrice;
  } else {
    portfolio.holdings.push({ symbol, quantity, purchasePrice, currentPrice });
  }
  await portfolio.save();
  res.json(portfolio);
});

// Get holdings
router.get('/:userId/holdings', async (req, res) => {
  const { userId } = req.params;
  const portfolio = await Portfolio.findOne({ user: userId });
  res.json({ holdings: portfolio ? portfolio.holdings : [] });
});



// Delete holding
router.delete('/:userId/holdings/:symbol', async (req, res) => {
  const { userId, symbol } = req.params;
  const portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
  portfolio.holdings = portfolio.holdings.filter(h => h.symbol !== symbol);
  await portfolio.save();
  res.json(portfolio);
});


router.get('/:userId/returns', async (req, res) => {
  const { userId } = req.params;
  const portfolio = await Portfolio.findOne({ user: userId });
  if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

  // Ensure holdings have currentPrice (update this field when fetching live prices)
  const returns = calculateReturns(portfolio.holdings);

  res.json(returns);
});

module.exports = router;
