const mongoose  = require("mongoose")
const connectDB = require("../../config/db");

const Property =  require("../../models/PropertyModel")
const User =  require("../../models/UserModel")

connectDB();

const seedProperties = async () => {
    try {
      // Clear existing properties
      await Property.deleteMany({});
      console.log('Old properties deleted');
  
      // Fetch a random user to associate with each property (for demonstration)
      const user = await User.findOne();
      if (!user) {
        console.log("No users found in the database. Please seed users first.");
        mongoose.connection.close();
        return;
      }
  
      // Seed data
      const properties = [
        {
          title: "Cozy Apartment",
          location: "Downtown",
          coordinates: { type: "Point", coordinates: [-73.935242, 40.730610] },
          description: "A comfortable apartment in the heart of the city.",
          price: 120,
          rooms: 2,
          bathrooms: 1,
          guests: 4,
          nearbyPlaces: ["Central Park", "Museum of Modern Art"],
          user: user._id,
          images: [
            { url: "https://example.com/image1.jpg", filename: "image1.jpg" },
            { url: "https://example.com/image2.jpg", filename: "image2.jpg" }
          ]
        },
        {
          title: "Beachfront Villa",
          location: "Malibu",
          coordinates: { type: "Point", coordinates: [-118.805, 34.0259] },
          description: "Luxurious villa with an ocean view.",
          price: 450,
          rooms: 4,
          bathrooms: 3,
          guests: 8,
          nearbyPlaces: ["Malibu Pier", "Zuma Beach"],
          user: user._id,
          images: [
            { url: "https://example.com/image3.jpg", filename: "image3.jpg" },
            { url: "https://example.com/image4.jpg", filename: "image4.jpg" }
          ]
        },
        {
          title: "Mountain Cabin",
          location: "Aspen",
          coordinates: { type: "Point", coordinates: [-106.818542, 39.191099] },
          description: "A peaceful retreat in the mountains.",
          price: 200,
          rooms: 3,
          bathrooms: 2,
          guests: 6,
          nearbyPlaces: ["Aspen Mountain", "Maroon Bells"],
          user: user._id,
          images: [
            { url: "https://example.com/image5.jpg", filename: "image5.jpg" },
            { url: "https://example.com/image6.jpg", filename: "image6.jpg" }
          ]
        }
      ];
  
      // Insert properties
      await Property.insertMany(properties);
      console.log('Property data inserted');
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  seedProperties();