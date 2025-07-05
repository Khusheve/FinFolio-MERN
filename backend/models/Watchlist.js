const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: String,
  name: String,
  sector: String,
  addedDate: Date
});

const watchlistSchema = new mongoose.Schema({
  userId: {
    type: String, 
    required: true
  },
  stocks: [stockSchema]
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
