const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' }); // If no token, return unauthorized error
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify the token using your secret key
        req.user = decoded; // Attach the decoded token data to the request object
        next(); // Proceed to the next middleware or controller
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' }); // Return error for invalid token
    }
};

module.exports = authenticateUser; // Export the middleware
