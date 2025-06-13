import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";
// import { useAuth } from "../context/AuthContext"; // Uncomment if using context for token

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [avgTransaction, setAvgTransaction] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const { token } = useAuth(); // Uncomment if token is from context

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/transaction/all", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // or use token
        },
      });

      const txns = res?.data?.transactions || [];
      setTransactions(txns);

      const incomeTotal = txns
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = txns
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      setIncome(incomeTotal);
      setExpense(expenseTotal);

      const avgTxn =
        txns.length > 0 ? (incomeTotal + expenseTotal) / txns.length : 0;
      setAvgTransaction(avgTxn.toFixed(2));

      const categoryTotals = {};
      txns.forEach((t) => {
        categoryTotals[t.category] =
          (categoryTotals[t.category] || 0) + t.amount;
      });
      const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(top?.[0] || "N/A");
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const balance = income - expense;

  // Monthly Line Chart
  const lineChartData = {
    labels: [],
    datasets: [
      {
        label: "Income",
        data: [],
        borderColor: "#4ade80",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: [],
        borderColor: "#f87171",
        tension: 0.4,
      },
    ],
  };

  const spendByCategory = {};
  const monthlyIncome = {};
  const monthlyExpense = {};

  transactions.forEach((txn) => {
    const month = dayjs(txn.date).format("MMM");
    if (txn.type === "income") {
      monthlyIncome[month] = (monthlyIncome[month] || 0) + txn.amount;
    } else {
      monthlyExpense[month] = (monthlyExpense[month] || 0) + txn.amount;
      spendByCategory[txn.category] =
        (spendByCategory[txn.category] || 0) + txn.amount;
    }
  });

  const months = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpense)])].sort(
    (a, b) => dayjs().month(a).month() - dayjs().month(b).month()
  );

  months.forEach((month) => {
    lineChartData.labels.push(month);
    lineChartData.datasets[0].data.push(monthlyIncome[month] || 0);
    lineChartData.datasets[1].data.push(monthlyExpense[month] || 0);
  });

  const pieData = {
    labels: Object.keys(spendByCategory),
    datasets: [
      {
        data: Object.values(spendByCategory),
        backgroundColor: [
          "#f87171", "#60a5fa", "#facc15", "#34d399", "#c084fc", "#f472b6",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      {loading ? (
        <p>Loading data...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <>
          {/* Summary + Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard label="Income" value={income} color="green" />
              <SummaryCard label="Expenses" value={expense} color="red" />
              <SummaryCard label="Balance" value={balance} color="blue" />
            </div>

            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
              <div className="w-64 h-64">
                {Object.keys(spendByCategory).length ? (
                  <Pie data={pieData} />
                ) : (
                  <p className="text-gray-500 text-sm">No expense data</p>
                )}
              </div>
            </div>
          </div>

          {/* Extra Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard title="Total Transactions" value={transactions.length} />
            <StatCard title="Top Category" value={topCategory} />
            <StatCard title="Avg. Transaction" value={`₹${avgTransaction}`} />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            {transactions.length ? (
              <ul className="divide-y divide-gray-200">
                {transactions.slice(0, 5).map((t) => (
                  <li key={t._id} className="flex justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-700">{t.description}</p>
                      <p className="text-sm text-gray-500">{t.category}</p>
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        t.type === "income" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      ₹{t.amount}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No transactions found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Reusable UI components
function SummaryCard({ label, value, color }) {
  const colorMap = {
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    blue: "text-blue-600 bg-blue-50",
  };
  return (
    <div className={`p-4 rounded-xl shadow ${colorMap[color]}`}>
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      <p className={`text-2xl font-bold ${colorMap[color].split(" ")[0]}`}>₹{value.toFixed(2)}</p>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="text-xl font-bold text-indigo-700">{value}</p>
    </div>
  );
}
