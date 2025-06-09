import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await axiosInstance.get("/api/transaction/all");
      console.log("Transactions response:", res.data);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error("Error fetching transactions:", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  if (loading) return <p>Loading transactions...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Your Transactions</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul className="space-y-4">
          {transactions.map((tx) => (
            <li key={tx._id} className="p-4 border rounded shadow">
              <div className="flex justify-between">
                <span className="font-semibold">{tx.category}</span>
                <span className={tx.type === "income" ? "text-green-600" : "text-red-600"}>
                  ₹{tx.amount}
                </span>
              </div>
              <p className="text-sm text-gray-500">{new Date(tx.date).toLocaleString()}</p>
              <p className="text-gray-700">{tx.note || "No notes"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


