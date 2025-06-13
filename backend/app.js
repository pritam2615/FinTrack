const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "https://fintrack-1-3757.onrender.com", 
  // origin: "http://localhost:5173",
  credentials: true, 
}));

app.use("/api/user", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is connected to port: ${PORT}`);
});