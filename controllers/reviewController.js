const Review = require("../models/Review");
const Property = require("../models/Property");
const CustomError = require("../utils/customError");

// Add Review
exports.addReview = async (req, res, next) => {
    try {
        const { propertyId, rating, comment } = req.body;

        const property = await Property.findById(propertyId);
        if (!property) {
            return next(new CustomError("Property not found", 404));
        }

        const existingReview = await Review.findOne({
            property: propertyId,
            user: req.user._id,
        });
        if (existingReview) {
            return next(
                new CustomError("You have already reviewed this property", 400)
            );
        }

        const newReview = new Review({
            property: propertyId,
            user: req.user._id,
            rating,
            comment,
        });

        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        next(new CustomError("Error adding review", 500, error));
    }
};

// Update Review
exports.updateReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating, comment } = req.body;

        const review = await Review.findById(id);
        if (!review) {
            return next(new CustomError("Review not found", 404));
        }

        if (review.user.toString() !== req.user._id.toString()) {
            return next(
                new CustomError(
                    "You are not authorized to update this review",
                    401
                )
            );
        }

        review.rating = rating;
        review.comment = comment;

        const updatedReview = await review.save();
        res.status(200).json(updatedReview);
    } catch (error) {
        next(new CustomError("Error updating review", 500, error));
    }
};

// Delete Review
exports.deleteReview = async (req, res, next) => {
    try {
        const { id } = req.params;
        const review = await Review.findById(id);
        if (!review) {
            return next(new CustomError("Review not found", 404));
        }
        if (review.user.toString() !== req.user._id.toString()) {
            return next(
                new CustomError(
                    "You are not authorized to delete this review",
                    401
                )
            );
        }
        await review.remove();
        res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
        next(new CustomError("Error deleting review", 500, error));
    }
};

// View Reviews for a Property
exports.viewReviews = async (req, res, next) => {
    try {
        const { propertyId } = req.params;

        const reviews = await Review.find({ property: propertyId })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        // if (reviews.length === 0) {
        //     return next(
        //         new CustomError("No reviews found for this property", 404)
        //     );
        // }

        res.status(200).json(reviews);
    } catch (error) {
        next(new CustomError("Error fetching reviews", 500, error));
    }
};
