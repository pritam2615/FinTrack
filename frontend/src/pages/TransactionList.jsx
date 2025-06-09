import { useEffect, useState } from "react";
import TransactionForm from "../components/TransactionForm";
import axiosInstance from "../services/axiosInstance";
import TransactionDetailModal from "../components/TransactionDetailModal";
import TransactionSummary from "../components/TransactionSummary";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [viewTransaction, setViewTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get("/api/transaction/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error(
        "Error fetching transactions:",
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/transaction/delete/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchTransactions();
    } catch (err) {
      console.error(
        "Error deleting transaction:",
        err.response?.data?.message || err.message
      );
    }
  };

  const handleUpdateComplete = () => {
    setEditingTransaction(null);
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div>
        <TransactionSummary transactions={transactions} />
      <TransactionForm
        editingTransaction={editingTransaction}
        onUpdateComplete={handleUpdateComplete}
        onAdd={fetchTransactions}
      />

      {transactions.map((txn) => (
        <div key={txn._id} className="bg-white p-4 shadow rounded mb-3">
          <p>
            <strong>{txn.category}</strong> - ₹{txn.amount}
          </p>
          <p className="text-sm text-gray-500">
            {txn.type} • {new Date(txn.date).toLocaleDateString()}
          </p>

          <div className="space-x-2 mt-2">
            <button
              className="bg-blue-500 text-white px-3 py-1 rounded"
              onClick={() => setViewTransaction(txn)}
            >
              View
            </button>
            <button
              className="bg-yellow-500 text-white px-3 py-1 rounded"
              onClick={() => setEditingTransaction(txn)}
            >
              Edit
            </button>
            <button
              className="bg-red-500 text-white px-3 py-1 rounded"
              onClick={() => handleDelete(txn._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* View Transaction Modal */}
      <TransactionDetailModal
        transaction={viewTransaction}
        onClose={() => setViewTransaction(null)}
      />
    </div>
  );
}
