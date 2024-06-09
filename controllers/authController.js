const express = require('express');
const app = express();
const Company = require('./../model/company');
const UserModel = require('./../model/authModel');
const {updateOverdueInstallments} = require('../customFunctions/overDueCalculator')

const cors = require('cors');
const cookieParser = require('cookie-parser');
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());
const jwt = require('jsonwebtoken');

const JWT_SECRET = '7Gh5ZD8J2K6Lm9N0Pq2Rs5Tu8Vx1Y';
app.use(cors({
    origin: 'http://localhost:3001', // your client's origin
    credentials: true // to allow cookies to be sent
}));
app.use(express.json());
app.use(cookieParser());


exports.createCompany =  async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save(); // Use `save()` method, not `Save()`
        res.status(201).send(company);
    } catch (error) {
        res.status(400).send(error);
    }
};


exports.createUser =  async (req, res) => {
    try {
      const { name, email, password, role, companyName } = req.body;
  
      // Ensure all required fields are provided
      if (!name || !email || !password || !role || !companyName) {
        return res.status(400).send({ error: 'All fields are required' });
      }
  
      // Find the company ID based on the company name
      const company = await Company.findOne({ name: companyName });
      if (!company) {
        return res.status(404).send({ error: 'Company not found' });
      }
  
      const user = new UserModel({ name, email, password, role, companies: [company._id] });
      await user.save();
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  };


  exports.signIn = async (req, res) => {
    try {
        console.log('testSignin')
        const { email, password } = req.body;

        // Ensure email and password are provided
        if (!email || !password) {
            return res.status(400).send({ error: 'Email and password are required' });
        }

        // Find user by email
        const user = await UserModel.findOne({ email }).populate('companies');
        if (!user) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        // Compare passwords (plaintext vs hashed)
        if (user.password !== password) {
            return res.status(401).send({ error: 'Invalid email or password' });
        }

        // Extract the first company ID from the user's companies array
        const companyId = user.companies.length > 0 ? user.companies[0]._id : null;

        // Generate JWT token with userId, role, and companyId
        const token = jwt.sign({ userId: user._id, role: user.role, companyId }, JWT_SECRET, { expiresIn: '1h' });

        // Send token in response
        // res.cookie('token', token, {httpOnly: true});
        res.cookie('token', token, {httpOnly: true});
        res.status(200).json({ message: "Sign-in sucessful", token : token});
        await updateOverdueInstallments();

  
    } catch (error) {
        console.log(error)
        res.status(400).send({ error: 'An error occurred while signing in' });
    }
};
