const express = require("express");
const {
    addReview,
    viewReviews,
    updateReview,
    deleteReview,
} = require("../controllers/reviewController");
const { authenticateUser } = require("../middleware/authMiddleware");
const router = express.Router();

// Protected route for adding a review
router.post("/", authenticateUser, addReview);

// Protected route for updating a review
router.put("/:id", authenticateUser, updateReview);

// Protected route for deleting a review
router.delete("/:id", authenticateUser, deleteReview);

// Public route for viewing reviews of a property
router.get("/:propertyId", viewReviews);

module.exports = router;
