const Budget = require("../models/budgetModel");
const Transaction = require("../models/transactionModel");

exports.setBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body;
    const userId = req.userId;

    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const budget = await Budget.findOneAndUpdate(
      { userId: userId, category, month, year },
      { $set: { amount: Number(amount) } },
      { upsert: true, new: true }
    );

    res.status(200).json({ message: "Budget set successfully", budget });
  } catch (err) {
    console.error("Budget set error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getBudget = async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.userId;

    if (!month || !year) {
      return res.status(400).json({ message: "Month and year required" });
    }

    const budgets = await Budget.find({ userId, month, year });

    const transactions = await Transaction.find({
      userId,
      type: "expense",
      date: {
        $gte: new Date(`${year}-${month}-01`),
        $lt: new Date(`${year}-${month}-31`),
      },
    });

    const spendByCategory = {};
    transactions.forEach(txn => {
      spendByCategory[txn.category] = (spendByCategory[txn.category] || 0) + txn.amount;
    });

    const result = budgets.map(b => {
      const spent = spendByCategory[b.category] || 0;
      return {
        category: b.category,
        budget: b.amount,
        spent,
        exceeded: spent > b.amount,
      };
    });

    res.status(200).json({ budgets: result });
  } catch (error) {
    console.error("Error in getBudget:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};