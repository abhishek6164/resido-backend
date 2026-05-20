const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema({
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
        enum: ["ENTERED", "EXITED", "PENDING", "DELIVERED"],
        default: "ENTERED"
    },
    loggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    entryTime: {
        type: Date,
        default: Date.now
    },
    exitTime: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Visitor", visitorSchema);