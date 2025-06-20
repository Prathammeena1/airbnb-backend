const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");
const CustomError = require("../utils/customError");

// Current User function
exports.currentuser = async (req, res) => {
    res.status(200).json({
        user: await req.user.populate("properties bookings"),
    });
};

// Signup function
exports.signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new CustomError("User already exists", 400));
        }

        // Create new user
        const user = new User({ username, email, password });
        await user.save();

        // Generate JWT token
        const token = user.generateAuthToken();

        // Respond with the created user and token
        res.status(201).json({
            message: "User created successfully",
            token: token,
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Login function
exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Authenticate the user using the static method in the User model
        const user = await User.authenticate(email, password);

        // Generate a JWT token
        const token = user.generateAuthToken();

        // Set the JWT token in the cookie
        res.cookie("token", token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV === "production",
            // maxAge: 3600000,
            // sameSite: "none",
        });

        // Return the user data along with the token
        res.status(200).json({
            message: "Login successful",
            token: token,
        });
    } catch (error) {
        next(new CustomError(error.message, 400));
    }
};

// Logout controller
exports.logout = (req, res, next) => {
    try {
        // Clear the JWT token from the cookie
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "none",
        });

        res.status(200).json({
            message: "Logout successful",
        });
    } catch (error) {
        next(new CustomError("Logout failed", 500, error));
    }
};

// View Profile function
exports.viewProfile = async (req, res, next) => {
    try {
        if (!req.user) return next(new CustomError("User not found", 404));

        res.json({ user: req.user });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Update Profile function
exports.updateProfile = async (req, res, next) => {
    const { username, email, password } = req.body;

    try {
        // Update user fields
        if (username) req.user.username = username;
        if (email) req.user.email = email;
        if (password) req.user.password = await bcrypt.hash(password, 10);

        await req.user.save();

        res.json({ message: "Profile updated successfully", user: req.user });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Reset Password function
exports.resetPassword = async (req, res, next) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return next(new CustomError("User not found", 404));

        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        const resetLink = `http://localhost:5000/api/users/reset-password/${resetToken}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Request",
            text: `Click on the link to reset your password: ${resetLink}`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset link sent to your email" });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};
