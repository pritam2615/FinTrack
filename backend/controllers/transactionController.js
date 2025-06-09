const Transaction = require("../models/transactionModel");

exports.addTransaction = async (req, res) => {
    const { type, category, amount, date, note } = req.body;

    try {
        const newTransaction = new Transaction({
            userId: req.userId,
            type,
            category,
            amount,
            date,
            note
        });

        await newTransaction.save();
        res.status(201).json({ message: "Transaction added successfully", newTransaction });

    } catch (error) {
        console.log("Error in add transaction controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getTransaction = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.userId }).sort({ date: -1 });

        res.status(200).json({
            message: "Transactions fetched successfully",
            count: transactions.length,
            transactions,
        });

    } catch (error) {
        console.log("Error in get transaction", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { type, category, amount, date, note } = req.body;

    try {
        const transaction = await Transaction.findOne({ _id: id, userId: req.userId });

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or unauthorized" });
        }

        transaction.type = type || transaction.type;
        transaction.category = category || transaction.category;
        transaction.amount = amount || transaction.amount;
        transaction.date = date || transaction.date;
        transaction.note = note || transaction.note;

        await transaction.save();

        res.status(200).json({
            message: "Transaction update successfully",
            transaction,
        });

    } catch (error) {
        console.log("Error in update transaction", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.deleteTransaction = async (req, res) => {
    const { id } = req.params;

    try {
        const transaction = await Transaction.findOneAndDelete({
            _id: id,
            userId: req.userId,
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found or unauthorized" });
        }

        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        console.log("Error in delete transaction", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getSummary = async (req, res) => {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required" });
  }

  const startDate = new Date(`${year}-${month}-01`);
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + 1);

  try {
    const transactions = await Transaction.find({
      userId: req.userId,
      date: { $gte: startDate, $lt: endDate },
    });

    let totalIncome = 0;
    let totalExpense = 0;
    let categoryBreakdown = {};

    transactions.forEach((txn) => {
      if (txn.type === "income") {
        totalIncome += txn.amount;
      } else if (txn.type === "expense") {
        totalExpense += txn.amount;
      }

      if (categoryBreakdown[txn.category]) {
        categoryBreakdown[txn.category] += txn.amount;
      } else {
        categoryBreakdown[txn.category] = txn.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    res.status(200).json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown,
    });
  } catch (error) {
    console.error("Error in summary controller:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
