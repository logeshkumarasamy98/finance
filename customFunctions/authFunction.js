const jwt = require('jsonwebtoken');
const User = require('../model/authModel');

const JWT_SECRET = '7Gh5ZD8J2K6Lm9N0Pq2Rs5Tu8Vx1Y'; // Replace with a secure secret key

// Middleware to check user role (admin or user)
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).send({ error: 'No authorization token provided' });
    }

    const decoded = await jwt.verify(token, JWT_SECRET);

    const userId = decoded.userId;
    const companyId = decoded.companyId;

    console.log('User ID:', userId);
    console.log('Company ID:', companyId);

    const user = await User.findOne({ _id: userId }).populate('companies');

    // console.log('User:', user);

    if (!user) {
      return res.status(404).send({ error: 'User not found' });
    }

    req.userId = userId;
    req.companyId = companyId;

    next();
  } catch (error) {
    console.error('Error:', error);

    // Consider sending a more informative error message depending on the error type
    res.status(401).send({ error: 'Authentication failed' });
  }
};

module.exports = auth;
