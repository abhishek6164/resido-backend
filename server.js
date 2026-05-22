const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const alertRoutes = require("./routes/alertRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json({
    limit: "50mb"
}));
app.use(express.urlencoded({
    limit: "50mb",
    extended: true
}));

// Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);
app.use("/api/alerts", alertRoutes);

app.use("/api/admin", adminRoutes);
// Test route
app.get("/", (req, res) => {
    res.send("MyGate Backend Running ✅");
});
app.use("/api/upload", uploadRoutes);

// 404 Handler - must be before error handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        path: req.path
    });
});

// Error Handler - catches all errors
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({
        error: err.message || "Internal server error",
        details: err.details
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🚀`);
});