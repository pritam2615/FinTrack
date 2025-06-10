const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  category: { type: String, required: true },
  month: { type: Number, required: true }, 
  year: { type: Number, required: true },
  amount: { type: Number, required: true }, 
});

module.exports = mongoose.model("Budget", budgetSchema);
