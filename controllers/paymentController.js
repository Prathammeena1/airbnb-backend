const razorpayInstance = require("../config/razorpay");
const crypto = require("crypto");
const CustomError = require("../utils/customError");
const logger = require("../utils/logger");
const Booking = require("../models/Booking");
const sendEmail = require("../utils/email");
const { paymentConfirmationTemplate } = require("../utils/emailTemplates");

exports.processPayment = async (req, res, next) => {
    try {
        const { amount, currency } = req.body;

        if (!amount || !currency) {
            return next(new CustomError("Amount and currency are required", 400));
        }

        // Create a new order
        const options = {
            amount: amount * 100, // Amount in paise (e.g., 5000 = INR 50)
            currency: currency || "INR",
            receipt: `receipt_${Date.now()}`,
            payment_capture: 1, // Auto capture payment
        };

        const order = await razorpayInstance.orders.create(options);

        
        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        // logger.error(`Error creating order: ${error}`);
        console.log(error);
        next(new CustomError(error.message, error.statusCode || 500)); // Pass error to global error handler
    }
};

exports.verifyPayment = async (req, res,next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
        req.body;

    try {
        // Validate the request
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return next(new CustomError("Missing payment details", 400));
        }

        // Fetch the order details using the Razorpay order ID
        const booking = await Booking.findOne({
            razorpayOrderId: razorpay_order_id,
        })
            .populate("user", "email username")
            .populate("property", "location");

        if (!booking) {
            return next(new CustomError("Booking not found", 404));
        }

        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(`${razorpay_order_id}|${razorpay_payment_id}`)
            .digest("hex");

        if (generatedSignature !== razorpay_signature) {
            return next(new CustomError("Payment verification failed", 400));
        }

        // Update the booking status to 'Confirmed' if payment is successful
        booking.status = "Confirmed";
        booking.paymentDetails = {
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            signature: razorpay_signature,
        };
        await booking.save();

        // Send payment confirmation email to the user
        const emailTemplate = paymentConfirmationTemplate(
            booking.user.username,
            booking.totalPrice,
            booking.property.location
        );

        await sendEmail(
            booking.user.email,
            "Payment Confirmation",
            emailTemplate
        );

        res.status(200).json({
            success: true,
            message: "Payment verified and booking confirmed!",
            booking,
        });
    } catch (err) {
        next(new CustomError(err.message, err.statusCode || 500));
    }
};

