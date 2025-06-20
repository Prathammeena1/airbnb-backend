// Load environment variables
const dotenv = require("dotenv");
dotenv.config();

// ••••••••••••••••••••••••••••••••

const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const morgan = require("morgan");
const errorHandler = require("./middleware/errorHandler");

// ••••••••••••••••••••••••

// MongoDB connection
const connectDB = require("./config/db");

const app = express();

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // To parse cookies
app.use(morgan("tiny"));

// setup cors
app.use(cors({ origin: true, credentials: true }));

// API routes
app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

app.use("*", (req, res, next) => {
    const error = new Error("Route Not Found");
    error.status = 404;
    next(error);
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
