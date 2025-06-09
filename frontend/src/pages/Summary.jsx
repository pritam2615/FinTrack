import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import TransactionSummary from "../components/TransactionSummary";

export default function Summary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/transaction/summary", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: { month, year },
      });
      setSummary(res.data);
    } catch (err) {
      console.error("Failed to fetch summary:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [month, year]);

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Summary - {month}/{year}</h2>

        <div className="flex items-center gap-3">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option value={i + 1} key={i}>
                {i + 1}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 w-24"
          />
        </div>
      </div>

      <TransactionSummary transactions={[]} />

      {loading ? (
        <p className="text-gray-500 text-center">Loading summary...</p>
      ) : summary ? (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-green-100 p-3 rounded">
              <p className="text-green-700 font-semibold">Income</p>
              <p className="text-lg font-bold">₹{summary.totalIncome}</p>
            </div>
            <div className="bg-red-100 p-3 rounded">
              <p className="text-red-700 font-semibold">Expense</p>
              <p className="text-lg font-bold">₹{summary.totalExpense}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded">
              <p className="text-blue-700 font-semibold">Net Balance</p>
              <p className="text-lg font-bold">₹{summary.netBalance}</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Category Breakdown</h3>
            <ul className="list-disc pl-6 space-y-1 text-gray-700">
              {Object.entries(summary.categoryBreakdown).map(([category, amount]) => (
                <li key={category}>
                  <span className="font-medium">{category}</span>: ₹{amount}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No summary available.</p>
      )}
    </div>
  );
}
