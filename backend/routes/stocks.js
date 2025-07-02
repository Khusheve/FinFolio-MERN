const express = require('express');
const router = express.Router();
const axios = require('axios');

const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

router.get('/quote', async (req, res) => {
  const { symbol } = req.query;
  if (!symbol) return res.status(400).json({ error: 'Symbol is required' });

   try {
    const response = await axios.get(
      `https://www.alphavantage.co/query`,
      {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol,
          apikey: ALPHA_VANTAGE_API_KEY,
        },
      }
    );
    const quote = response.data["Global Quote"];
    if (quote && quote["05. price"]) {
      res.json({
        symbol: quote["01. symbol"],
        price: quote["05. price"],
        change: quote["09. change"],
        percent: quote["10. change percent"],
      });
    } else {
      res.status(404).json({ error: "Stock not found or API limit reached." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock data." });
  }
});

module.exports = router;
