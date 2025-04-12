const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({ email, password, name });

    console.log('user before save', user);

    // Save user with error handling
    try {
      await user.save();
      console.log('user after save', user);
    } catch (error) {
      console.error('Error saving user:', error);
      return res.status(500).json({ message: 'Server error during saving user', error: error.message });
    }

    // JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Send response
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Server error", error: error.stack || error.message });
  }
};


exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Verify password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate new JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 day
    });

    // Send response
    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

