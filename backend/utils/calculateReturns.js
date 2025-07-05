function calculateReturns(holdings) {
  let totalInvested = 0;
  let totalCurrent = 0;

  const detailed = holdings.map(h => {
    const invested = h.purchasePrice * h.quantity;
    const current = h.currentPrice * h.quantity;
    const profitLoss = current - invested;
    const roi = invested === 0 ? 0 : (profitLoss / invested) * 100;
    totalInvested += invested;
    totalCurrent += current;
    return {
      ...h._doc, // Spread the holding fields
      invested,
      current,
      profitLoss,
      roi
    };
  });

  const totalPL = totalCurrent - totalInvested;
  const totalROI = totalInvested === 0 ? 0 : (totalPL / totalInvested) * 100;

  return {
    detailed,
    totalInvested,
    totalCurrent,
    totalPL,
    totalROI
  };
}

module.exports = calculateReturns;
