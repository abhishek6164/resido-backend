const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["VISITOR", "DELIVERY"],
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    deliveryPartner: {
        type: String,
        default: ""
    },
    building: {
        type: String,
        required: true
    },
    flat: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
    },
    // Visitor entry reference
    visitorEntry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Visitor"
    },
    // Kaun se flat ke members ko gaya
    notifiedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    // Kisne action liya
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    actionTime: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Alert", alertSchema);