const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  symbol: { type: String, required: true },
  quantity: { type: Number, required: true },
  purchasePrice: { type: Number, required: true }
});

const PortfolioSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  holdings: [HoldingSchema]
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
