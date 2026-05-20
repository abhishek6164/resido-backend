const PreApproval = require("../models/PreApproval");

// POST - Resident pre-approval create kare
const createPreApproval = async (req, res) => {
    try {
        const {
            type,
            name,
            mobile,
            deliveryPartner,
            building,
            flat,
            validTill
        } = req.body;

        if (!type || !name || !mobile || !building || !flat || !validTill) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const approval = await PreApproval.create({
            type,
            name,
            mobile,
            deliveryPartner: deliveryPartner || "",
            building,
            flat,
            validTill: new Date(validTill),
            status: "APPROVED",
            createdBy: req.user.id
        });

        res.status(201).json({
            message: "Pre-approval created!",
            approval
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET - Apne pre-approvals dekho (Resident)
const getMyPreApprovals = async (req, res) => {
    try {
        const approvals = await PreApproval.find({
            createdBy: req.user.id
        }).sort({
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

module.exports = {
    createPreApproval,
    getMyPreApprovals
};