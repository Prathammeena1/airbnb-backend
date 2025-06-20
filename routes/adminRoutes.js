const express = require("express");
const {
    getUsers,
    deleteUser,
    getProperties,
    deleteProperty,
    getBookings,
    payments,
    singlePayment,
} = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const router = express.Router();

// Routes for managing users
router.get("/users", adminMiddleware, getUsers);
router.delete("/users/:id", adminMiddleware, deleteUser);

// Routes for managing properties
router.get("/properties", adminMiddleware, getProperties);
router.delete("/properties/:id", adminMiddleware, deleteProperty);

// Route for managing bookings
router.get("/bookings", adminMiddleware, getBookings);

// Route to get all payments
router.get("/payments", adminMiddleware, payments);

// Route to get payment details for a specific booking (by booking ID)
router.get("/payments/:id", adminMiddleware, singlePayment);

module.exports = router;
