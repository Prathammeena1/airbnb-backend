const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        amenities: {
            type: [String], // Array of amenities like 'WiFi', 'Air Conditioning', etc.
            default: [],
        },
        images: {
            type: [String], // Array of image URLs
            default: [],
        },
        host: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Property = mongoose.model("Property", propertySchema);
module.exports = Property;
