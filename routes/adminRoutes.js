const express = require("express");
const router = express.Router();
const {
    protect,
    adminOnly
} = require("../middleware/authMiddleware");
const {
    getPendingUsers,
    approveUser,
    rejectUser,
    createUser,
    getResidents,
    getProfile
} = require("../controllers/adminController");

// Admin only routes
router.get("/pending-users", protect, adminOnly, getPendingUsers);
router.put("/approve/:id", protect, adminOnly, approveUser);
router.put("/reject/:id", protect, adminOnly, rejectUser);
router.post("/create-user", protect, adminOnly, createUser);

// Common routes (sabke liye)
router.get("/residents", protect, getResidents);
router.get("/profile", protect, getProfile);

module.exports = router;