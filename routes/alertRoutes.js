const express = require("express");
const router = express.Router();
const {
    protect
} = require("../middleware/authMiddleware");
const {
    getMyAlerts,
    updateAlertStatus,
    savePushToken
} = require("../controllers/alertController");

router.get("/my-alerts", protect, getMyAlerts);
router.put("/update/:id", protect, updateAlertStatus);
router.post("/save-token", protect, savePushToken);

module.exports = router;