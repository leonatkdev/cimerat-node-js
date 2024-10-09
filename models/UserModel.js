const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    googleId: { type: String, unique: true }, // For Google authentication
    name: { type: String },
    phone: { type: String },
    properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }], // References properties created by the user
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  

// Check if model is already compiled
const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', UserSchema);

module.exports = UserModel