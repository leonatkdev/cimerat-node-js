const mongoose = require("mongoose");
require('dotenv').config();

function connectDB() {
  try { 
    mongoose.connect(process.env.MONGO_URL);
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
  const dbConnection = mongoose.connection;


  dbConnection.once("open", (_) => {
    console.log(`Database connected: `);
  });

  dbConnection.on("error", (err) => {
    console.error(`connection error: `);
  });

  return;
}

module.exports = connectDB
