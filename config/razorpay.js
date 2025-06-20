const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID, // Your API key ID
    key_secret: process.env.RAZORPAY_KEY_SECRET, // Your API secret
});

module.exports = razorpayInstance;
