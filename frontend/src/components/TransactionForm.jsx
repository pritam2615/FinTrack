import { useState, useEffect } from "react";
import axiosInstance from "../services/axiosInstance";

export default function TransactionForm({
  onAdd,
  editingTransaction,
  onUpdateComplete,
}) {
  const [form, setForm] = useState({
    type: "Income",
    category: "",
    amount: "",
    date: "",
    note: "",
  });

  useEffect(() => {
    if (editingTransaction) {
      setForm({
        type:
          editingTransaction.type.charAt(0).toUpperCase() +
          editingTransaction.type.slice(1),
        category: editingTransaction.category,
        amount: editingTransaction.amount,
        date: editingTransaction.date
          ? editingTransaction.date.substring(0, 10)
          : "",
        note: editingTransaction.note || "",
      });
    }
  }, [editingTransaction]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingTransaction) {
        // Update existing transaction
        await axiosInstance.put(
          `/api/transaction/update/${editingTransaction._id}`,
          {
            ...form,
            type: form.type.toLowerCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        onUpdateComplete && onUpdateComplete();
      } else {
        // Add new transaction
        await axiosInstance.post(
          "/api/transaction/add",
          {
            ...form,
            type: form.type.toLowerCase(),
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        onAdd && onAdd();
      }

      // Clear form
      setForm({
        type: "Income",
        category: "",
        amount: "",
        date: "",
        note: "",
      });
    } catch (err) {
      console.error(
        "Error submitting transaction:",
        err.response?.data?.message || err.message
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-xl font-bold text-gray-800">
        {editingTransaction ? "Edit Transaction" : "Add Transaction"}
      </h2>

      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />

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

      <textarea
        name="note"
        value={form.note}
        onChange={handleChange}
        placeholder="Note (optional)"
        className="w-full border p-2 rounded"
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      >
        <option value="Income">Income</option>
        <option value="Expense">Expense</option>
      </select>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        {editingTransaction ? "Update Transaction" : "Add Transaction"}
      </button>
    </form>
  );
}
