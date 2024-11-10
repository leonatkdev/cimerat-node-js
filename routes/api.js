const express = require("express");
const router = express.Router();

const User = require("../models/UserModel");
const Property = require("../models/PropertyModel");
const Booking = require("../models/BookingModel");
const Review = require("../models/ReviewModel");

const { createUser, loginUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // Multer middleware
const path = require("path");

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
  try {
    const allPosts = await Property.find();

    if (!allPosts || allPosts.length === 0) {
      return res.status(404).json({ message: "No posts found." });
    }

    res.status(200).json(allPosts);
  } catch (err) {
    console.error(`All Posts Retrieval Failed: ${err.message}`);

    // Send an error response to the client
    res.status(500).json({ error: "An error occurred while fetching posts." });
  }
});

router.get("/posts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Property.findById(id); // Add await to retrieve the result

    if (!post) {
      return res.status(404).json({ message: "Post couldn't be found" });
    }

    res.status(200).json(post);
  } catch (err) {
    console.error('Error fetching post:', err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Add the create post endpoint
router.post(
  "/posts",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const { title, location, description, price } = req.body;

      if (!title || !location || !description || !price) {
        return res
          .status(400)
          .json({ message: "Please provide all required fields" });
      }

      // Dynamically generate the URLs based on backend's origin
      const imagesArr = req.files.map((file) => ({
        url: `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
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
  }
);

// POST - Add a favorite (by item ID) for the user
router.post("/favorites", authMiddleware, async (req, res) => {
  try {
    const { itemId } = req.body;

    // Ensure no duplicate favorites
    if (!req.user.favorites.includes(itemId)) {
      req.user.favorites.push(itemId);
      await req.user.save();
    }

    res
      .status(201)
      .json({ message: "Favorite added!", favorites: req.user.favorites });
  } catch (error) {
    res.status(500).json({ message: "Error adding favorite", error });
  }
});

// GET - Retrieve all favorites with full data for the logged-in user
router.get("/favorites", authMiddleware, async (req, res) => {
  try {
    console.log('req.user', req.user)
    // Find the user and populate favorites directly in the route
    const userWithFavorites = await User.findById(req.user._id).populate('favorites');

    console.log('Populated favorites:', userWithFavorites.favorites);

    res.status(200).json(userWithFavorites.favorites);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving favorites", error });
  }
});

module.exports = router;
