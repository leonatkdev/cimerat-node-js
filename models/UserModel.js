// models/UserModel.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true }, // For Google authentication
  name: { type: String },
  phone: { type: String },
  createdAt: { type: Date, default: Date.now },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }], // References properties created by the user
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }] // Reference to Property model or other favorite items
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserModel = mongoose.models.UserModel || mongoose.model('UserModel', UserSchema);
module.exports = UserModel;
