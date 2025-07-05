import React, { useEffect, useState } from "react";
import axios from "axios";

const PortfolioHoldings = ({ userId }) => {
  const [holdings, setHoldings] = useState([]);
  const [form, setForm] = useState({ symbol: '', quantity: '', purchasePrice: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Helper to fetch holdings safely
  const fetchHoldings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`/api/portfolio/${userId}/holdings`);
      setHoldings(Array.isArray(res.data.holdings) ? res.data.holdings : []);
    } catch (err) {
      setError('Failed to fetch holdings', err);
      setHoldings([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHoldings();
    // eslint-disable-next-line
  }, [userId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post(`/api/portfolio/${userId}/holdings`, {
        symbol: form.symbol.toUpperCase(),
        quantity: Number(form.quantity),
        purchasePrice: Number(form.purchasePrice)
      });
      await fetchHoldings();
      setForm({ symbol: '', quantity: '', purchasePrice: '' });
    } catch (err) {
      setError('Failed to add/update holding', err);
    }
    setLoading(false);
  };

  const handleDelete = async (symbol) => {
    setLoading(true);
    setError('');
    try {
      await axios.delete(`/api/portfolio/${userId}/holdings/${symbol}`);
      setHoldings(prev => prev.filter(h => h.symbol !== symbol));
    } catch (err) {
      setError('Failed to delete holding', err);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto mt-8 scale-125 origin-top">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Your Holdings</h2>

      {error && <div className="mb-4 text-red-600">{error}</div>}

     <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6 ">
  <div className="flex flex-col md:flex-row gap-2">
    <input
      type="text"
      name="symbol"
      value={form.symbol}
      onChange={handleChange}
      placeholder="Symbol (e.g., TCS)"
      className="border rounded px-3 py-2 flex-1"
      required
    />
    <input
      type="number"
      name="quantity"
      value={form.quantity}
      onChange={handleChange}
      placeholder="Quantity"
      className="border rounded px-3 py-2 flex-1"
      required
      min="1"
    />
    <input
      type="number"
      name="purchasePrice"
      value={form.purchasePrice}
      onChange={handleChange}
      placeholder="Purchase Price"
      className="border rounded px-1 py-2 flex-1"
      required
      min="0"
      step="0.01"
    />
  </div>
  <button
    type="submit"
    className="bg-green-600 hover:bg-green-700 text-white font-bold px-4 py-2 rounded mt-2 w-full md:w-auto"
    disabled={loading}
  >
    {loading ? "Saving..." : "Add / Update"}
  </button>
</form>


      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-green-50">
            <th className="py-2 px-4 border-b text-left">Symbol</th>
            <th className="py-2 px-4 border-b text-left">Quantity</th>
            <th className="py-2 px-4 border-b text-left">Purchase Price</th>
            <th className="py-2 px-4 border-b"></th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(holdings) ? holdings : []).length === 0 && !loading && (
            <tr>
              <td colSpan="4" className="text-center py-4 text-gray-500">No holdings yet.</td>
            </tr>
          )}
          {(Array.isArray(holdings) ? holdings : []).map(h => (
            <tr key={h.symbol}>
              <td className="py-2 px-4 border-b">{h.symbol}</td>
              <td className="py-2 px-4 border-b">{h.quantity}</td>
              <td className="py-2 px-4 border-b">₹{Number(h.purchasePrice).toFixed(2)}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => handleDelete(h.symbol)}
                  className="text-red-600 hover:text-red-800 font-semibold"
                  disabled={loading}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <div className="mt-4 text-gray-500">Loading...</div>}
    </div>
  );
};

export default PortfolioHoldings;

