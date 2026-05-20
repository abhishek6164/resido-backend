const Alert = require("../models/Alert");
const User = require("../models/User");
const Visitor = require("../models/Visitor");
const {
    sendPushNotification
} = require("../utils/pushNotification");

// GET - Mere flat ke alerts (Resident ke liye)
const getMyAlerts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        const alerts = await Alert.find({
            building: user.building,
            flat: user.flat,
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            alerts
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// PUT - Alert approve/reject karo (Resident)
const updateAlertStatus = async (req, res) => {
    try {
        const {
            status
        } = req.body;

        if (!["APPROVED", "REJECTED"].includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const alert = await Alert.findByIdAndUpdate(
            req.params.id, {
                status,
                actionBy: req.user.id,
                actionTime: new Date()
            }, {
                new: true
            }
        );

        if (!alert) return res.status(404).json({
            message: "Alert not found"
        });

        // Visitor entry status bhi update karo
        if (alert.visitorEntry) {
            await Visitor.findByIdAndUpdate(
                alert.visitorEntry, {
                    status: status === "APPROVED" ? "ENTERED" : "REJECTED"
                }
            );
        }

        res.status(200).json({
            message: `Entry ${status}!`,
            alert
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST - Guard entry pe alert create karo + notification bhejo
const createAlertAndNotify = async (visitorEntry, guardId) => {
    try {
        const flatMembers = await User.find({
            building: visitorEntry.building,
            flat: visitorEntry.flat,
            status: "APPROVED",
            role: {
                $in: ["FAMILY", "TENANT"]
            }
        });

        if (flatMembers.length === 0) return;

        const alert = await Alert.create({
            type: visitorEntry.type,
            name: visitorEntry.name,
            mobile: visitorEntry.mobile,
            deliveryPartner: visitorEntry.deliveryPartner || "",
            building: visitorEntry.building,
            flat: visitorEntry.flat,
            photo: visitorEntry.photo || "",
            status: "PENDING",
            visitorEntry: visitorEntry._id,
            notifiedUsers: flatMembers.map(m => m._id)
        });

        return alert;
    } catch (error) {
        console.error("Alert creation error:", error.message);
    }
};

// PUT - Push token save karo
const savePushToken = async (req, res) => {
    try {
        const {
            token
        } = req.body;
        await User.findByIdAndUpdate(req.user.id, {
            pushToken: token
        });
        res.status(200).json({
            message: "Token saved!"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getMyAlerts,
    updateAlertStatus,
    createAlertAndNotify,
    savePushToken
};