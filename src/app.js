// MUST be first - load environment variables
require("dotenv").config();

// Debug: Verify .env is loaded (remove in production if desired)
if (!process.env.MONGODB_URI) {
  console.warn(
    "⚠️  Warning: MONGODB_URI not found. Make sure .env file exists in project root."
  );
}

const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const groupRoutes = require("./routes/groupRoutes");
const expenseRoutes = require("./routes/expenseRoutes");

const app = express();

// Middleware
app.use(bodyParser.json());

// Connect to Database
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/expenses", expenseRoutes);

app.get("/", (req, res) => {
  res.send("Expense Sharing API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
