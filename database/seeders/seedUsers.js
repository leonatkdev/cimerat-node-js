const mongoose  = require("mongoose")
const connectDB = require("../../config/db");

const User =  require("../../models/UserModel")

connectDB();

const seedUsers = async () => {
    try {
      // Clear existing data
      await User.deleteMany({});
      console.log('Old users deleted');
  
      // Insert new seed data with plain passwords (they'll be hashed automatically)
      const users = [
        { name: 'John Doe', email: 'john@example.com', password: 'password123', phone: '1234567890' },
        { name: 'Jane Smith', email: 'jane@example.com', password: 'password123',  phone: '0987654321' },
        { name: 'Alice Johnson', email: 'alice@example.com', password: 'password123', phone: '1122334455' }
      ];
  
      for (const userData of users) {
        const user = new User(userData);
        await user.save();
      }
      
      console.log('Seed data inserted');
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.connection.close();
    }
  };
  
  seedUsers();




