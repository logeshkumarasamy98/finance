const jwt = require('jsonwebtoken'); 

const your_secret_key = "9d7e0cf9b9a5ef1f1b4a6e5f7c8d3b2a";


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