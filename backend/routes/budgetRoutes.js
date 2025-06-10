const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { setBudget, getBudget } = require("../controllers/budgetController");

router.post("/set", authMiddleware, setBudget);
router.get("/all", authMiddleware, getBudget);

module.exports = router;