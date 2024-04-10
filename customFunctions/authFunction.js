const jwt = require('jsonwebtoken'); 
require('dotenv').config({path:'./config.env'});

const your_secret_key = process.env.SECRET_KEY;


function verifyToken(req, res, next) {
    const token = req.headers.authorization; // Assuming token is passed in the Authorization header

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token.split(' ')[1], your_secret_key, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token." });
        }
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Call next middleware
    });
}

module.exports = {verifyToken}