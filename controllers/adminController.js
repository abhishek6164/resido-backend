const User = require("../models/User");
const bcrypt = require("bcryptjs");

// GET - Pending Users
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({
                status: "PENDING"
            })
            .select("-password")
            .sort({
                createdAt: -1
            });

        res.status(200).json({
            users
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// PUT - Approve User
const approveUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                status: "APPROVED"
            }, {
                new: true
            }
        ).select("-password");

        if (!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "User approved!",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// PUT - Reject User
const rejectUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, {
                status: "REJECTED"
            }, {
                new: true
            }
        ).select("-password");

        if (!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            message: "User rejected!",
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// POST - Admin Direct User Create
const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            mobile,
            password,
            role,
            building,
            flat
        } = req.body;

        if (!name || !email || !mobile || !password || !role || !building || !flat) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({
            email
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword,
            role,
            building,
            flat,
            status: "APPROVED" // Admin ne banaya toh directly approved
        });

        res.status(201).json({
            message: "User created successfully!",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET - All Approved Residents (Community)
const getResidents = async (req, res) => {
    try {
        const residents = await User.find({
                status: "APPROVED",
                role: {
                    $nin: ["ADMIN", "SECURITY"]
                }
            })
            .select("-password")
            .sort({
                name: 1
            });

        res.status(200).json({
            residents
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET - My Profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({
            message: "User not found"
        });

        res.status(200).json({
            user
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    getPendingUsers,
    approveUser,
    rejectUser,
    createUser,
    getResidents,
    getProfile
};