const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to authenticate user
exports.authenticateUser = async (req, res, next) => {
    try {
        // Get token from cookie
        const token = req.cookies.token;
        if (!token) return res.status(401).json({ message: "No token found" });

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ message: "No user found" });

        // Attach user to request object
        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};
