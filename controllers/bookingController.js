const Booking = require("../models/Booking");
const Property = require("../models/Property");
const Razorpay = require("razorpay");
const CustomError = require("../utils/customError");
const razorpayInstance = require("../config/razorpay");
const { sendEmail } = require("../utils/email");
const { bookingConfirmationTemplate } = require("../utils/emailTemplates");

// Create Booking
exports.createBooking = async (req, res, next) => {
    const { userId, propertyId, checkInDate, checkOutDate, totalAmount } =
        req.body;

    try {
        const property = await Property.findById(propertyId);

        if (!property) {
            return res.status(400).json({ message: "Property not found" });
        }

        // Validate booking details
        if (
            !userId ||
            !propertyId ||
            !checkInDate ||
            !checkOutDate ||
            !totalAmount
        ) {
            return next(
                new CustomError("Missing required booking details", 400)
            );
        }

        // Create a new booking record in the database (but don't confirm yet)
        const booking = await Booking.create({
            user:userId,
            property:propertyId,
            checkInDate,
            checkOutDate,
            totalPrice:totalAmount,
            status: "Pending", // Booking is in pending status until payment is verified
        });

        // Create a payment order with Razorpay
        const options = {
            amount: totalAmount * 100, // Convert amount to paise (Razorpay accepts amount in paise)
            currency: "INR",
            receipt: `receipt_${booking._id}`,
            payment_capture: 1, // Auto capture payment once it's successful
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Save Razorpay order ID in the booking document
        booking.razorpayOrderId = razorpayOrder.id;
        await booking.save();

        // Send booking confirmation email
        const emailTemplate = bookingConfirmationTemplate(
            req.user.username,
            property.location,
            checkInDate,
            checkOutDate
        );

        await sendEmail(req.user.email, "Booking Confirmation", emailTemplate);

        res.status(200).json({
            success: true,
            booking,
            orderId: razorpayOrder.id,
            currency: "INR",
            amount: totalAmount,
        });
    } catch (err) {
        next(new CustomError(err.message, 500));
    }
};

// View Bookings for a User
exports.viewUserBookings = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const bookings = await Booking.find({ user: userId })
            .populate("property", "title location price")
            .populate("user", "username email");

        res.status(200).json(bookings);
    } catch (error) {
        next(new CustomError("Error fetching bookings", 500, error));
    }
};

// Cancel Booking
exports.cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id);
        if (!booking) {
            return next(new CustomError("Booking not found", 404));
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return next(new CustomError("Unauthorized to cancel this booking", 403));
        }

        booking.status = "Cancelled";
        await booking.save();

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking,
        });
    } catch (error) {
        next(new CustomError(error.message, 500));
    }
};
