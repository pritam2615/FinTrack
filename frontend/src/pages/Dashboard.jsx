// // src/pages/Dashboard.jsx
// import { useEffect, useState } from "react";
// import axiosInstance from "../services/axiosInstance";
// import { Pie } from "react-chartjs-2";
// import "chart.js/auto";

// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axiosInstance.get("/api/transaction/all", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//       });

//       const txns = res.data.transactions;
//       setTransactions(txns);

//       const incomeTotal = txns
//         .filter(t => t.type === "income")
//         .reduce((sum, t) => sum + t.amount, 0);
//       const expenseTotal = txns
//         .filter(t => t.type === "expense")
//         .reduce((sum, t) => sum + t.amount, 0);

//       setIncome(incomeTotal);
//       setExpense(expenseTotal);
//     } catch (err) {
//       console.error("Dashboard fetch error:", err);
//     }
//   };

//   const balance = income - expense;

//   const spendByCategory = {};
//   transactions.forEach(txn => {
//     if (txn.type === "expense") {
//       spendByCategory[txn.category] =
//         (spendByCategory[txn.category] || 0) + txn.amount;
//     }
//   });

//   const pieData = {
//     labels: Object.keys(spendByCategory),
//     datasets: [
//       {
//         data: Object.values(spendByCategory),
//         backgroundColor: [
//           "#f87171",
//           "#60a5fa",
//           "#facc15",
//           "#34d399",
//           "#c084fc",
//           "#f472b6",
//         ],
//       },
//     ],
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

//       {/* Summary + Pie Chart */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-green-50 p-4 rounded-xl shadow">
//             <h3 className="text-sm font-medium text-gray-600">Income</h3>
//             <p className="text-2xl font-bold text-green-600">₹{income.toFixed(2)}</p>
//           </div>
//           <div className="bg-red-50 p-4 rounded-xl shadow">
//             <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
//             <p className="text-2xl font-bold text-red-600">₹{expense.toFixed(2)}</p>
//           </div>
//           <div className="bg-blue-50 p-4 rounded-xl shadow">
//             <h3 className="text-sm font-medium text-gray-600">Balance</h3>
//             <p className="text-2xl font-bold text-blue-600">₹{balance.toFixed(2)}</p>
//           </div>
//         </div>

//         {/* Pie Chart */}
//         <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
//           <div className="w-64 h-64">
//             <Pie data={pieData} />
//           </div>
//         </div>
//       </div>

//       {/* Recent Transactions */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
//         <ul className="divide-y divide-gray-200">
//           {transactions.slice(0, 5).map(t => (
//             <li key={t._id} className="flex justify-between py-3">
//               <div>
//                 <p className="font-medium text-gray-700">{t.description}</p>
//                 <p className="text-sm text-gray-500">{t.category}</p>
//               </div>
//               <p
//                 className={`text-lg font-semibold ${
//                   t.type === "income" ? "text-green-600" : "text-red-600"
//                 }`}
//               >
//                 ₹{t.amount}
//               </p>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }


// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../services/axiosInstance";
import { Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import dayjs from "dayjs";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [topCategory, setTopCategory] = useState("");
  const [avgTransaction, setAvgTransaction] = useState(0);

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

      const incomeTotal = txns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
      const expenseTotal = txns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);

      setIncome(incomeTotal);
      setExpense(expenseTotal);

      const totalTxns = txns.length;
      const avgTxn = totalTxns > 0 ? (incomeTotal + expenseTotal) / totalTxns : 0;
      setAvgTransaction(avgTxn.toFixed(2));

      // Top category
      const categoryTotals = {};
      txns.forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
      const top = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
      setTopCategory(top?.[0] || "N/A");

    } catch (err) {
      console.error("Dashboard fetch error:", err);
    }
  };

  const balance = income - expense;

  const spendByCategory = {};
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

  const monthlyIncome = {};
  const monthlyExpense = {};
  transactions.forEach(txn => {
    const month = dayjs(txn.date).format("MMM");
    if (txn.type === "income") {
      monthlyIncome[month] = (monthlyIncome[month] || 0) + txn.amount;
    } else {
      monthlyExpense[month] = (monthlyExpense[month] || 0) + txn.amount;
    }

    if (txn.type === "expense") {
      spendByCategory[txn.category] = (spendByCategory[txn.category] || 0) + txn.amount;
    }
  });

  const months = [...new Set([...Object.keys(monthlyIncome), ...Object.keys(monthlyExpense)])].sort(
    (a, b) => dayjs().month(a).month() - dayjs().month(b).month()
  );

  months.forEach(month => {
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

      {/* Summary + Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600">Income</h3>
            <p className="text-2xl font-bold text-green-600">₹{income.toFixed(2)}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600">Expenses</h3>
            <p className="text-2xl font-bold text-red-600">₹{expense.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl shadow">
            <h3 className="text-sm font-medium text-gray-600">Balance</h3>
            <p className="text-2xl font-bold text-blue-600">₹{balance.toFixed(2)}</p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center">
          <div className="w-64 h-64">
            <Pie data={pieData} />
          </div>
        </div>
      </div>

      {/* Extra Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-600">Total Transactions</h3>
          <p className="text-xl font-bold text-indigo-700">{transactions.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-600">Top Category</h3>
          <p className="text-xl font-bold text-indigo-700">{topCategory}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <h3 className="text-sm font-medium text-gray-600">Avg. Transaction</h3>
          <p className="text-xl font-bold text-indigo-700">₹{avgTransaction}</p>
        </div>
      </div>

      {/* Line Chart */}
      {/* <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Monthly Income vs Expense</h3>
        <Line data={lineChartData} />
      </div> */}

      {/* Recent Transactions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul className="divide-y divide-gray-200">
          {transactions.slice(0, 5).map(t => (
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
      </div>
    </div>
  );
}
