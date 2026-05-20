const mongoose = require("mongoose");

const preApprovalSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED", "USED"],
        default: "PENDING"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    validTill: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("PreApproval", preApprovalSchema);