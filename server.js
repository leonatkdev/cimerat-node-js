require("dotenv").config();

const express = require("express");
const path = require('path'); 
const app = express();
const cors = require("cors");
const connectDB = require("./config/db");
const api = require("./routes/api");

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body-parser for JSON
app.use(express.urlencoded({ extended: true })); // Built-in body-parser for URL-encoded data

connectDB();

// Routing
app.get("/", (req, res) => {
  res.json("Server is running 🙃");
});

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api", api); // Prefix API routes with /api

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

// Uncaught Exception & Unhandled Rejection handlers
process.on("uncaughtException", (error) => {
  console.error(`Caught exception: ${error}\nException origin: ${error.stack}`);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});
