import { useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function TransactionForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    category: "",
    type: "income", // ✅ model expects lowercase: "income" or "expense"
    note: "",       // ✅ added optional note field
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/api/transaction/add", form); 

      setForm({ amount: "", category: "", type: "income", note: "" });

      onAdd && onAdd();
    } catch (err) {
      console.error(
        "Error adding transaction:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Add Transaction</h2>

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="w-full border p-2 rounded"
        required
      />

      <input
        type="text"
        name="category"
        value={form.category}
        onChange={handleChange}
        placeholder="Category"
        className="w-full border p-2 rounded"
        required
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <textarea
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Note (optional)"
        className="w-full border p-2 rounded"
        rows={3}
      />

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Add Transaction
      </button>
    </form>
  );
}
