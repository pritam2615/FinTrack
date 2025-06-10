import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function BudgetView() {
  const [budgets, setBudgets] = useState([]);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [newBudget, setNewBudget] = useState({
    category: "",
    amount: "",
  });

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    try {
      const res = await axiosInstance.get("/api/budget/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        params: { month, year },
      });
      setBudgets(res.data.budgets);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSetBudget = async () => {
    if (!newBudget.category || !newBudget.amount) {
      return alert("Please fill in both category and amount.");
    }

    try {
      await axiosInstance.post(
        "/api/budget/set",
        {
          category: newBudget.category,
          amount: Number(newBudget.amount),
          month,
          year,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setNewBudget({ category: "", amount: "" }); // reset form
      fetchBudgets(); // refresh
    } catch (err) {
      console.error("Failed to set budget", err);
      alert("Error setting budget. Check console.");
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Budget Overview</h2>

      <div className="flex gap-3 mb-4">
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border p-2 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border p-2 rounded w-28"
        />
      </div>

      <div className="mb-6 border p-4 rounded bg-gray-50">
        <h3 className="font-semibold mb-2">Set Budget for Category</h3>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Category"
            value={newBudget.category}
            onChange={(e) =>
              setNewBudget({ ...newBudget, category: e.target.value })
            }
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            value={newBudget.amount}
            onChange={(e) =>
              setNewBudget({ ...newBudget, amount: e.target.value })
            }
            className="border p-2 rounded w-32"
          />
          <button
            onClick={handleSetBudget}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save Budget
          </button>
        </div>
      </div>

      <table className="w-full text-left border mt-4">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Spent</th>
            <th className="p-2 border">Budget</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {budgets.map((b, i) => (
            <tr key={i} className="border-b">
              <td className="p-2 border">{b.category}</td>
              <td className="p-2 border">₹{(b.spent ?? 0).toFixed(2)}</td>
              <td className="p-2 border">₹{(b.budget ?? 0).toFixed(2)}</td>
              <td className="p-2 border">
                {b.exceeded ? (
                  <span className="text-red-600 font-bold">Over Budget 🚨</span>
                ) : (
                  <span className="text-green-600">Within Budget ✅</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
