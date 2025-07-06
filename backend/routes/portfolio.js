// backend/routes/portfolio.js
const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio');

// Create a new portfolio
router.post('/', async (req, res) => {
  try {
    const { userId, name } = req.body;
    const portfolio = new Portfolio({ userId, name, holdings: [] });
    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a holding to a portfolio
router.post('/:portfolioId/holdings', async (req, res) => {
  try {
    const { symbol, quantity, purchasePrice, purchaseDate } = req.body;
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });

    portfolio.holdings.push({ symbol, quantity, purchasePrice, purchaseDate });
    await portfolio.save();
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get a portfolio by ID
router.get('/:portfolioId', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.portfolioId);
    if (!portfolio) return res.status(404).json({ error: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

