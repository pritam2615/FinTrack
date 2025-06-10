// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/api/transaction/all", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const txns = res.data.transactions;
      setTransactions(txns);

      const incomeTotal = txns
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = txns
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setIncome(incomeTotal);
      setExpense(expenseTotal);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const balance = income - expense;

  const spendByCategory = {};
  transactions.forEach(txn => {
    if (txn.type === "expense") {
      spendByCategory[txn.category] =
        (spendByCategory[txn.category] || 0) + txn.amount;
    }
  });

  const pieData = {
    labels: Object.keys(spendByCategory),
    datasets: [
      {
        data: Object.values(spendByCategory),
        backgroundColor: [
          "#f87171",
          "#60a5fa",
          "#facc15",
          "#34d399",
          "#c084fc",
          "#f472b6",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded shadow">
          <h3 className="text-lg">Income</h3>
          <p className="text-2xl font-bold text-green-600">₹{income.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow">
          <h3 className="text-lg">Expenses</h3>
          <p className="text-2xl font-bold text-red-600">₹{expense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow">
          <h3 className="text-lg">Balance</h3>
          <p className="text-2xl font-bold text-blue-600">₹{balance.toFixed(2)}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <Pie data={pieData} />
      </div>

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul>
          {transactions.slice(0, 5).map(t => (
            <li key={t._id} className="flex justify-between py-2 border-b">
              <span>{t.description}</span>
              <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
                ₹{t.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
