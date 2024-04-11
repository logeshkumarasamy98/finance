const auth = require('./../model/authModel');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:'./config.env'});
const { updateOverdueInstallments } = require('./../customFunctions/overDueCalculator');
const bcrypt = require('bcryptjs');

// const your_secret_key = "9d7e0cf9b9a5ef1f1b4a6e5f7c8d3b2a";
const your_secret_key = process.env.SECRET_KEY;




exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
      // Connect to the default database
      await mongoose.connect(process.env.USER_DB);
      console.log('DB connected... & user authenticated.');

      // Find the user by email
      const user = await auth.findOne({ email });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Compare the hashed password with the plaintext password
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (!isPasswordMatch) {
          return res.status(401).json({ message: "Invalid password" });
      }

      console.log(`User found: ${user.email}`);

      // Generate JWT token
      const token = jwt.sign({ email: user.email }, your_secret_key, { expiresIn: '2H' });

      // Disconnect from the default database
      await mongoose.disconnect();
      const companyName = user.companyName;
      // Connect to the new database specified by the user's DB
      await mongoose.connect(`mongodb+srv://logeshpriyanga:logesh98@cluster0.i7qbne1.mongodb.net/${user.DB}`);
      console.log(token)
      console.log(`Connected to ${user.DB} database`);

      res.status(200).json({ message: "Sign-in successful", token, companyName });

      // Perform any additional operations after successful login
      await updateOverdueInstallments();

  } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
      return
  }
};



exports.signup = async (req, res) => {
    const { email, password, confirmPassword, DB, signUpKey, companyName } = req.body;

    try {
        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }

        // Verify if the provided signup key matches the one from environment variables
        if (signUpKey !== process.env.SIGNUP_KEY) {
            return res.status(401).json({ message: "Invalid signup key" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connect to the database
        await mongoose.connect(process.env.USER_DB);
        console.log('DB connected... & user authenticated.');

        // Create a new user with hashed password
        const newUser = new auth({
            email: email,
            password: hashedPassword,
            DB: DB,
            companyName:companyName
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
        return;
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
        return;
    }
}