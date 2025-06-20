const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Property",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        checkInDate: {
            type: Date,
            required: true,
        },
        checkOutDate: {
            type: Date,
            required: true,
        },
        // status: {
        //     type: String,
        //     enum: ["Booked", "Cancelled","pe"],
        //     default: "Booked",
        // },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["Pending", "Confirmed", "Cancelled"],
            default: "Pending",
        },
        razorpayOrderId: { type: String },
        paymentDetails: {
            paymentId: { type: String },
            orderId: { type: String },
            signature: { type: String },
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
