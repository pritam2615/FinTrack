const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { addTransaction, getTransaction, updateTransaction, deleteTransaction, getSummary } = require("../controllers/transactionController");

router.post("/add", authMiddleware, addTransaction);
router.get("/all", authMiddleware, getTransaction);
router.put("/update/:id", authMiddleware, updateTransaction);
router.delete("/delete/:id", authMiddleware, deleteTransaction);
router.get("/summary", authMiddleware, getSummary);

module.exports = router;