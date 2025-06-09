const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", authRoutes);
app.use("/api/transaction", transactionRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is connected to port: ${PORT}`);
});