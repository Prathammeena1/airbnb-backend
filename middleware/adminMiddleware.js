const jwt = require("jsonwebtoken");
const User = require("../models/User");

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(401)
                .json({ message: "No token, authorization denied" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user || !req.user.isAdmin) {
            return res
                .status(403)
                .json({ message: "Access denied: Admins only" });
        }

        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized", error });
    }
};

module.exports = adminMiddleware;
