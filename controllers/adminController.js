const User = require("../models/User");
const Property = require("../models/Property");
const Booking = require("../models/Booking");
const CustomError = require("../utils/customError");
const { error } = require("winston");

// Manage Users
exports.getUsers = async (req, res,next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

exports.deleteUser = async (req, res,next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        console.log(new CustomError("User Not Found",404))
        if (!user) {
            return next(new CustomError("User Not Found",404));
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Manage Properties
exports.getProperties = async (req, res,next) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

exports.deleteProperty = async (req, res,next) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);
        if (!property) {
            return next(new CustomError("Property not found", 404));
        }
        res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

// Manage Bookings
exports.getBookings = async (req, res,next) => {
    try {
        const bookings = await Booking.find().populate("property user");
        res.status(200).json(bookings);
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};

exports.payments = async (req, res, next) => {
    try {
        // Optional: Add query filters to allow the admin to filter by status or other criteria
        const { status, paymentStatus, page = 1, limit = 10 } = req.query;
        // console.log(status)

        // Create filter criteria based on query parameters
        const filters = {};
        if (status) filters.status = status; // e.g., Pending, Confirmed, Cancelled
        if (paymentStatus) filters["paymentDetails.paymentId"] = paymentStatus; // Payment ID for filtering

        // Pagination logic
        const payments = await Booking.find(filters)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("user", "username email") // Populate user data
            .populate("property", "location price") // Populate property data
            .sort({ createdAt: -1 }); // Sort by most recent

        res.status(200).json({
            success: true,
            data: payments,
            page,
            limit,
        });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};

exports.singlePayment = async (req, res, next) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findById(bookingId)
            .populate("user", "username email")
            .populate("property", "location price");

        if (!booking) {
            return next(new CustomError("Booking not found", 404));
        }

        res.status(200).json({
            success: true,
            data: booking,
        });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};
