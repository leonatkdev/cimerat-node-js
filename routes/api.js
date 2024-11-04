const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const Property = require("../models/PropertyModel");
const Booking = require("../models/BookingModel");
const Review = require("../models/ReviewModel");

const { createUser, loginUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require('../middleware/multer'); // Multer middleware
const path = require('path');


router.get("/", (req, res) => {
  res.json("This is api");
});

router.post("/signup", createUser);

router.post("/login", loginUser);

router.get("/user/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("properties");
    res.json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all/posts", async (req, res) => {
  try{
    const allPosts = await Property.find();

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ message: 'No posts found.' });
    }

    res.status(200).json(allPosts);
  } catch(err){
    console.error(`All Posts Retrieval Failed: ${err.message}`);

    // Send an error response to the client
    res.status(500).json({ error: 'An error occurred while fetching posts.' });
  }
});

// Add the create post endpoint
router.post("/posts", authMiddleware, upload.array('images', 10), async (req, res) => {
  try {
    const { title, location, 
      // coordinates,
       description, price } = req.body;

    // Validate the input
    if (!title || !location  || !description || !price) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    let images = [];

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        path: file.path, // e.g., 'uploads/image-uniqueId.jpg'
        filename: file.filename, // e.g., 'image-uniqueId.jpg'
      }));
    }

    // // Parse coordinates if sent as a JSON string
    // let parsedCoordinates;
    // if (typeof coordinates === 'string') {
    //   parsedCoordinates = JSON.parse(coordinates);
    // } else {
    //   parsedCoordinates = coordinates;
    // }

    // Create a new property
    const newProperty = new Property({
      title,
      location,
      // coordinates: parsedCoordinates,
      description,
      price,
      owner: req.user._id, // Associate the property with the authenticated user
      images, // Add images array
    });

    // Save the property to the database
    const savedProperty = await newProperty.save();

    // Optionally, add the property to the user's properties array
    req.user.properties.push(savedProperty._id);
    await req.user.save();

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error creating post:", error);
    
    // Handle Multer-specific errors
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
