export default function TransactionSummary({ transactions = [] }) {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded shadow mb-4">
        <h2 className="text-xl font-semibold mb-2">Summary</h2>
        <p className="text-center text-gray-500">No transactions to summarize.</p>
      </div>
    );
  }

  const income = transactions
    .filter(txn => txn.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const expense = transactions
    .filter(txn => txn.type === "expense")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const balance = income - expense;

  return (
    <div className="bg-gray-100 p-4 rounded shadow mb-4">
      <h2 className="text-xl font-semibold mb-2">Summary</h2>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-green-100 p-3 rounded">
          <p className="text-green-700 font-bold">Income</p>
          <p className="text-lg font-semibold">₹{income.toFixed(2)}</p>
        </div>
        <div className="bg-red-100 p-3 rounded">
          <p className="text-red-700 font-bold">Expense</p>
          <p className="text-lg font-semibold">₹{expense.toFixed(2)}</p>
        </div>
        <div className="bg-blue-100 p-3 rounded">
          <p className="text-blue-700 font-bold">Balance</p>
          <p className="text-lg font-semibold">₹{balance.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}
