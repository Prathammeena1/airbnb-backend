const express = require("express");
const {
    processPayment,
    verifyPayment,
} = require("../controllers/paymentController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Route to initiate payment
router.post("/", authenticateUser, processPayment);

router.post("/verify-payment", verifyPayment);

module.exports = router;
