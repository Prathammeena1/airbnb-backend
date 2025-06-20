const express = require("express");
const {
    createBooking,
    viewUserBookings,
    cancelBooking,
} = require("../controllers/bookingController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Protected route for creating a booking
router.post("/", authenticateUser, createBooking);

// Protected route for viewing bookings by user
router.get("/user/:userId", authenticateUser, viewUserBookings);

// Protected route for cancelling a booking
router.delete("/:id", authenticateUser, cancelBooking);

module.exports = router;
