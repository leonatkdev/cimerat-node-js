require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 4005;

const cors = require("cors");
const mongoose = require('mongoose');
// const bodyParser = require("body-parser");

app.use(cors());
// app.use(bodyParser);

// Routing
const api = require("./routes/api");

app.get("/", (req, res) => {
  res.json("Server is running 🙃");
});

app.use(api);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`); 
});
