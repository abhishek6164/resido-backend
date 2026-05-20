const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["FAMILY", "TENANT", "ADMIN", "SECURITY"],
        required: true
    },
    building: {
        type: String,
        required: true
    },
    flat: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    }
}, {
    timestamps: true
}, {
    pushToken: {
        type: String,
        default: ""
    }
});


module.exports = mongoose.model("User", userSchema);