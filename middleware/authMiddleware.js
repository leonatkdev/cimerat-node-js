// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const authMiddleware = async (req, res, next) => {
  try {

    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 

    // Find the user associated with the token
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Invalid authentication token' });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
