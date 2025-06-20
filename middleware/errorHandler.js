const logger = require("../utils/logger");

// Custom error handler
const errorHandler = (err, req, res, next) => {
    // Log the error with relevant details
    logger.error(
        `${err.status || 500} - ${err.message} - ${req.originalUrl} - ${
            req.method
        } - ${req.ip}`
    );

    // Send response to the client
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
};

module.exports = errorHandler;
