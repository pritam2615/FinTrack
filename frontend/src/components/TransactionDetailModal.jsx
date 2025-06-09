export default function TransactionDetailModal({ transaction, onClose }) {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <p><strong>Type:</strong> {transaction.type}</p>
        <p><strong>Category:</strong> {transaction.category}</p>
        <p><strong>Amount:</strong> ₹{transaction.amount}</p>
        <p><strong>Date:</strong> {new Date(transaction.date).toLocaleDateString()}</p>
        <p><strong>Note:</strong> {transaction.note || "No note"}</p>

        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}
