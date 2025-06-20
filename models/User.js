const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// User schema definition
const userSchema = new mongoose.Schema(
    {
        properties: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Property",
            },
        ],
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking",
            },
        ],
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: false },
        isAdmin: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
    });
    return token;
};

// Static method to authenticate the user during login
userSchema.statics.authenticate = async function (email, password) {
    const user = await this.findOne({ email }).select("+password");
    if (!user) {
        throw new Error("Invalid email or password");
    }

    // Check if the provided password matches the stored password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    // Return the user if authentication is successful
    return user;
};

// Pre-save hook to hash the password before saving to DB
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Create User model
const User = mongoose.model("User", userSchema);

module.exports = User;
