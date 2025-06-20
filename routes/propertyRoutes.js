const express = require("express");
const {
    createProperty,
    updateProperty,
    deleteProperty,
    viewProperty,
    searchProperties,
    myProperty,
} = require("../controllers/propertyController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Protected route for hosts to create properties
router.post("/", authenticateUser, createProperty);

// Protected route for hosts to update their property
router.put("/:id", authenticateUser, updateProperty);

// Protected route for hosts to delete their property
router.delete("/:id", authenticateUser, deleteProperty);

// Public route to search for properties
router.get("/search", searchProperties);

// Public route to view a specific property
router.get("/me", authenticateUser, myProperty);

// Public route to view a specific property
router.get("/:id", viewProperty);

module.exports = router;
