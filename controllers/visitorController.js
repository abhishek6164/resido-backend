const Visitor = require("../models/Visitor");
const PreApproval = require("../models/PreApproval");
const {
    createAlertAndNotify
} = require("./alertController");

const logEntry = async (req, res) => {
    try {
        const {
            type,
            name,
            mobile,
            deliveryPartner,
            building,
            flat,
            photo
        } = req.body;

        if (!type || !name || !mobile || !building || !flat) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const entry = await Visitor.create({
            type,
            name,
            mobile,
            deliveryPartner: deliveryPartner || "",
            building,
            flat,
            photo: photo || "",
            status: "ENTERED",
            loggedBy: req.user.id
        });

        // ✅ Alert create karo + notification bhejo
        await createAlertAndNotify(entry, req.user.id);

        res.status(201).json({
            message: "Entry logged! Residents notified.",
            entry
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getTodayEntries = async (req, res) => {
    try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const visitors = await Visitor.find({
            type: "VISITOR",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({
            createdAt: -1
        });

        const deliveries = await Visitor.find({
            type: "DELIVERY",
            createdAt: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            visitors,
            deliveries
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getPreApprovals = async (req, res) => {
    try {
        const now = new Date();
        const approvals = await PreApproval.find({
                status: "APPROVED",
                validTill: {
                    $gte: now
                }
            })
            .populate("createdBy", "name building flat")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            approvals
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const logExit = async (req, res) => {
    try {
        const entry = await Visitor.findByIdAndUpdate(
            req.params.id, {
                status: "EXITED",
                exitTime: new Date()
            }, {
                new: true
            }
        );
        if (!entry) return res.status(404).json({
            message: "Entry not found"
        });
        res.status(200).json({
            message: "Exit logged!",
            entry
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// PUT - Pre-approval se direct entry mark karo
const markPreApprovalUsed = async (req, res) => {
    try {
        const preApproval = await PreApproval.findById(req.params.id)
            .populate("createdBy", "name building flat");

        if (!preApproval) {
            return res.status(404).json({
                message: "Pre-approval not found"
            });
        }

        if (preApproval.status === "USED") {
            return res.status(400).json({
                message: "Already marked as used"
            });
        }

        // Pre-approval USED mark karo
        preApproval.status = "USED";
        await preApproval.save();

        // Visitor entry create karo
        const entry = await Visitor.create({
            type: preApproval.type,
            name: preApproval.name,
            mobile: preApproval.mobile,
            deliveryPartner: preApproval.deliveryPartner || "",
            building: preApproval.building,
            flat: preApproval.flat,
            status: "ENTERED",
            loggedBy: req.user.id
        });

        res.status(200).json({
            message: "Entry marked! Visitor logged.",
            entry
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    logEntry,
    getTodayEntries,
    getPreApprovals,
    logExit,
    markPreApprovalUsed
};