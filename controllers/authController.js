const auth = require('./../model/authModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const your_secret_key = "9d7e0cf9b9a5ef1f1b4a6e5f7c8d3b2a";



exports.signIn = async (req, res) => {

    const { email, password } = req.body;
    mongoose.connect('mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/userdb', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB connected...& user authenticated.');
  })
  .catch((error) => {
    console.error('Error connecting to database:', error);
  });


    try {
      const user = await auth.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      console.log(`User found: ${user.email}`);
  
      // Generate JWT token
      const token = jwt.sign({ email: user.email }, your_secret_key, { expiresIn: '2M' });
  
      // Disconnect from the default database
      await mongoose.disconnect();
  
      // Connect to the new database specified by the user's DB
      await mongoose.connect(`mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/${user.DB}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
  
      console.log(`Connected to ${user.DB} database`);
  
      res.status(200).json({ message: "Sign-in successful", token });
  
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
      return;
    }
  };