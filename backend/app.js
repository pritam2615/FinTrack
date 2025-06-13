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

// app.use(cors({
//   origin: "https://fintrack-1-3757.onrender.com", 
//   // origin: "http://localhost:5173",
//   credentials: true, 
// }));

const allowedOrigins = [
  "https://fintrack-1-3757.onrender.com",
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// Add this right after app.use(cors(...))
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept,Authorization");
  next();
});

app.use("/api/user", authRoutes);
app.use("/api/transaction", transactionRoutes);
app.use("/api/budget", budgetRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is connected to port: ${PORT}`);
});