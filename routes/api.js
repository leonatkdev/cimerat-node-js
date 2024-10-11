const express = require("express");
const router = express.Router();


const User = require("../models/userModel");
const Property = require("../models/PropertyModel");
const Booking = require("../models/BookingModel");
const Review = require("../models/ReviewModel");

const { createUser, loginUser  } = require('../controllers/userController');

router.get("/", (req, res) => {
  res.json("This is api");
});

router.post('/signup', createUser);

router.post('/login', loginUser);

router.post("/api/getUser/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId).populate("properties");
    return user.properties;
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = router;
