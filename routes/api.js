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
    const { title, location, description, price } = req.body;

    if (!title || !location || !description || !price) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Dynamically generate the URLs based on backend's origin
    const imagesArr = req.files.map(file => ({
      url: `${req.protocol}://${req.get('host')}/uploads/${file.filename}`,
      filename: file.filename,
    }));

    const newProperty = new Property({
      title,
      location,
      description,
      price,
      owner: req.user._id,
      images: imagesArr,
    });

    const savedProperty = await newProperty.save();
    req.user.properties.push(savedProperty._id);
    await req.user.save();

    res.status(201).json(savedProperty);
  } catch (error) {
    console.error("Error creating post:", error);

    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error", error: error.message });
  }
});


module.exports = router;
