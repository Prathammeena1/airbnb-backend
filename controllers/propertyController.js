const Property = require("../models/Property");
const CustomError = require("../utils/customError");

// Create Property
exports.createProperty = async (req, res,next) => {
  try {
    const { title, description, location, price, amenities, images } = req.body;

    if (!title || !description || !location || !price || !amenities || !images) {
      next(new CustomError("All fields are required", 400));
    }

    const newProperty = new Property({
      title,
      description,
      location,
      price,
      amenities,
      images,
      host: req.user._id, // Assuming `req.user` is set by the auth middleware
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    next(new CustomError("Error creating property", 500));
  }
};

// Update Property
exports.updateProperty = async (req, res,next) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(new CustomError("Property ID is required", 400));
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProperty) {
      next(new CustomError("Property not found", 404));
    }

    res.status(200).json(updatedProperty);
  } catch (error) {
    next(new CustomError("Error updating property", 500));
  }
};

// Delete Property
exports.deleteProperty = async (req, res,next) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(new CustomError("Property ID is required", 400));
    }

    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      next(new CustomError("Property not found", 404));
    }

    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    next(new CustomError("Error deleting property", 500));
  }
};

// View Property
exports.viewProperty = async (req, res,next) => {
  try {
    const { id } = req.params;

    if (!id) {
      next(new CustomError("Property ID is required", 400));
    }

    console.log(id)

    const property = await Property.findById(id).populate(
      "host",
      "username email"
    );

    if (!property) {
      next(new CustomError("Property not found", 404));
    }

    res.status(200).json(property);
  } catch (error) {
    next(new CustomError("Error fetching property details", 500));
  }
};

exports.myProperty = async (req, res,next) => {
  try {
    const id  = req.user._id;

    if (!id) {
      next(new CustomError("Property ID is required", 400));
    }

    console.log(id)

    const property = await Property.find({ host: id }).populate(
      "host",
      "username email"
    );

    if (!property) {
      next(new CustomError("Property not found", 404));
    }

    res.status(200).json(property);
  } catch (error) {
    next(new CustomError("Error fetching property details", 500));
  }
};

// Search Properties
exports.searchProperties = async (req, res,next) => {
  try {
    const { location, minPrice, maxPrice } = req.query;

    const query = {
      ...(location && { location: { $regex: location, $options: "i" } }),
      ...(minPrice && { price: { $gte: minPrice } }),
      ...(maxPrice && { price: { $lte: maxPrice } }),
    };

    const properties = await Property.find(query);
    res.status(200).json(properties);
  } catch (error) {
    next(new CustomError("Error searching for properties", 500));
  }
};
