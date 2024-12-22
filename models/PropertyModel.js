const mongoose = require("mongoose");

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    // required: true
  },
  location: {
    type: String,
    // required: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true
    },
    coordinates: {
      type: [Number],
      // required: true
    },
  },
  description: { type: String },
  price: {
    type: Number,
    // required: true
  },
  rooms: {
    type: Number,
    // required: true
  },
  bathrooms: {
    type: Number,
    // required: true
  },
  guests: { type: Number },
  nearbyPlaces: [{ type: String }],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true
  },
  images: [{ type: String }],
  //  [
  //   {
  //     url: {
  //       type: String,
  //       required: true,
  //       match: /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/,
  //     },
  //     filename: {
  //       type: String,
  //       required: true,
  //     },
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
});

PropertySchema.index({ coordinates: "2dsphere" });

module.exports = mongoose.model("Property", PropertySchema);
