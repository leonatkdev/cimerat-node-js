const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const exisingUser = await User.findOne({ email });
    if (exisingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create new user
    const user = new User({ email, password, name });
    await user.save();

    // Jwt token created for user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d", // 1 day expiration
    });

    res
      .status(200)
      .json({
        token,
        user: { id: user._id, email: user.email, name: user.name },
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
