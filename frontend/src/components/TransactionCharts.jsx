import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#FF6384", "#36A2EB"];

export default function TransactionCharts({ summary }) {
  if (!summary) return null;

  const { categoryBreakdown, incomeCategories = [], expenseCategories = [] } = summary;

  const pieData = Object.entries(categoryBreakdown).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const barData = [
    { name: "Income", amount: summary.totalIncome },
    { name: "Expense", amount: summary.totalExpense },
    { name: "Balance", amount: summary.netBalance },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-7 mt-8">
      {/* Pie Chart */}
      <div className="bg-white p-2 shadow rounded">
        <h3 className="text-lg font-semibold mb-3 text-center">Category Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              {pieData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-4 shadow rounded">
        <h3 className="text-lg font-semibold mb-3 text-center">Summary Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}