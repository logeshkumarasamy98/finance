const express = require('express');
const Company = require('./../model/company');
const UserModel = require('./../model/authModel');
const { updateOverdueInstallments } = require('../customFunctions/overDueCalculator');
const jwt = require('jsonwebtoken');
const JWT_SECRET = '7Gh5ZD8J2K6Lm9N0Pq2Rs5Tu8Vx1Y';
const bcrypt = require('bcryptjs');

exports.createCompany = async (req, res) => {
    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).send(company);
    } catch (error) {
        res.status(400).send(error);
    }
};

// exports.createUser = async (req, res) => {
//     try {
//         const { name, email, password, role, companyName } = req.body;
  
//         if (!name || !email || !password || !role || !companyName) {
//             return res.status(400).send({ error: 'All fields are required' });
//         }
  
//         const company = await Company.findOne({ name: companyName });
//         if (!company) {
//             return res.status(404).send({ error: 'Company not found' });
//         }
  
//         const user = new UserModel({ name, email, password, role, companies: [company._id] });
//         await user.save();
//         res.status(201).send(user);
//     } catch (error) {
//         res.status(400).send(error);
//     }
// };

// // exports.signIn = async (req, res) => {
// //     try {
// //         const { email, password } = req.body;

// //         if (!email || !password) {
// //             return res.status(400).send({ error: 'Email and password are required' });
// //         }

// //         const user = await UserModel.findOne({ email }).populate('companies');
// //         if (!user || user.password !== password) {
// //             return res.status(401).send({ error: 'Invalid email or password' });
// //         }

// //         const companyId = user.companies.length > 0 ? user.companies[0]._id : null;
// //         const token = jwt.sign({ userId: user._id, role: user.role, companyId }, JWT_SECRET, { expiresIn: '1h' });

// //         res.cookie('token', token, { httpOnly: true });
// //         res.status(200).json({ message: "Sign-in successful", token: token });
// //         await updateOverdueInstallments();
// //     } catch (error) {
// //         res.status(400).send({ error: 'An error occurred while signing in' });
// //     }
// // };


// exports.signIn = async (req, res) => {
//   try {
//       const { email, password } = req.body;

//       if (!email || !password) {
//           return res.status(400).send({ error: 'Email and password are required' });
//       }

//       const user = await UserModel.findOne({ email }).populate('companies');
//       if (!user || user.password !== password) {
//           return res.status(401).send({ error: 'Invalid email or password' });
//       }

//       // Assuming the user has at least one company associated
//       const companyId = user.companies.length > 0 ? user.companies[0]._id : null;
      
//       // Fetch company details based on companyId
//       const company = await Company.findById(companyId);

//       if (!company) {
//           return res.status(404).send({ error: 'Company details not found' });
//       }

//       const token = jwt.sign({ userId: user._id, role: user.role, companyId }, JWT_SECRET, { expiresIn: '1h' });

//       res.cookie('token', token, { httpOnly: true });

//       // Send companyName and companyAddress in the response
//       res.status(200).json({ message: "Sign-in successful", token: token, companyName: company.name, companyAddress: company.address });

//       // Assuming updateOverdueInstallments is an asynchronous function that does not need to wait for a response
//       await updateOverdueInstallments();
//   } catch (error) {
//       console.error(error);
//       res.status(400).send({ error: 'An error occurred while signing in' });
//   }
// };



// Sign In
exports.signIn = async (req, res) => {
  try {
      const { email, password } = req.body;

      if (!email || !password) {
          return res.status(400).send({ error: 'Email and password are required' });
      }

      const user = await UserModel.findOne({ email }).populate('companies');
      if (!user) {
          return res.status(401).send({ error: 'Invalid email or password' });
      }

      // Compare the entered password with the hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
          return res.status(401).send({ error: 'Invalid email or password' });
      }

      const companyId = user.companies.length > 0 ? user.companies[0]._id : null;
      const company = await Company.findById(companyId);

      if (!company) {
          return res.status(404).send({ error: 'Company details not found' });
      }

      const token = jwt.sign({ userId: user._id, role: user.role, companyId }, JWT_SECRET, { expiresIn: '1h' });

      res.cookie('token', token, { httpOnly: true });

      res.status(200).json({ message: "Sign-in successful", token: token, companyName: company.name, companyAddress: company.address });

      await updateOverdueInstallments();
  } catch (error) {
      console.error(error);
      res.status(400).send({ error: 'An error occurred while signing in' });
  }
};

// Create User
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, companyName } = req.body;

        if (!name || !email || !password || !role || !companyName) {
            return res.status(400).send({ error: 'All fields are required' });
        }

        const company = await Company.findOne({ name: companyName });
        if (!company) {
            return res.status(404).send({ error: 'Company not found' });
        }

        // Encrypt the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ name, email, password: hashedPassword, role, companies: [company._id] });
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};
