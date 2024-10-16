const express = require("express");
const router = express.Router();


const User = require("../models/UserModel");
const Property = require("../models/PropertyModel");
const Booking = require("../models/BookingModel");
const Review = require("../models/ReviewModel");

const { createUser, loginUser  } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware')

router.get("/", (req, res) => {
  res.json("This is api");
});

router.post('/signup', createUser);

router.post('/login', loginUser);

router.get('/api/user/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('properties');
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add the create post endpoint
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { title, location, description, price } = req.body;

    // Validate the input
    if (!title || !location || !description || !price) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create a new property
    const newProperty = new Property({
      title,
      location,
      description,
      price,
      owner: req.user._id, // Associate the property with the authenticated user
    });

    // Save the property to the database
    const savedProperty = await newProperty.save();

    // Optionally, add the property to the user's properties array
    req.user.properties.push(savedProperty._id);
    await req.user.save();

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
