const express = require("express");
const userController = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

// current user route
router.get("/current-user", authenticateUser, userController.currentuser);

// Signup route
router.post("/signup", userController.signup);

// Login route
router.post("/login", userController.login);

// Login route
router.get("/logout", authenticateUser, userController.logout);

// View profile route
router.get("/profile", authenticateUser, userController.viewProfile);

// Update profile route
router.put("/profile", authenticateUser, userController.updateProfile);

// Reset password route
router.post("/reset-password", userController.resetPassword);

module.exports = router;
