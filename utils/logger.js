const winston = require("winston");

// Create a logger instance
const logger = winston.createLogger({
    level: "info", // Default log level (can be changed)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        // Log to console
        new winston.transports.Console({ format: winston.format.simple() }),
        // Optionally, log to a file
        new winston.transports.File({
            filename: "logs/error.log",
            level: "error",
        }),
        new winston.transports.File({ filename: "logs/combined.log" }),
    ],
});

module.exports = logger;
