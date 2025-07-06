// backend/models/Portfolio.js
const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true },
  purchaseDate: { type: Date, required: true },
});

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  holdings: [HoldingSchema],
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);

