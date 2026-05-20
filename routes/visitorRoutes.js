const express = require("express");
const router = express.Router();
const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");
const {
    logEntry,
    getTodayEntries,
    getPreApprovals,
    logExit,
    markPreApprovalUsed
} = require("../controllers/visitorController");

const {
    createPreApproval,
    getMyPreApprovals
} = require("../controllers/preApprovalController");

// Guard routes
router.post("/entry", protect, logEntry);
router.get("/today", protect, getTodayEntries);
router.get("/pre-approvals", protect, getPreApprovals);
router.put("/exit/:id", protect, logExit);
router.put("/mark-used/:id", protect, markPreApprovalUsed);

// Resident routes
router.post("/pre-approval", protect, createPreApproval);
router.get("/my-approvals", protect, getMyPreApprovals);

module.exports = router;