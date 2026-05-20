const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// SIGNUP
const signup = async (req, res) => {
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

        // Sabhi fields check karo
        if (!name || !email || !mobile || !password || !role || !building || !flat) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // ✅ Admin/Security signup block karo
        if (role === "ADMIN" || role === "SECURITY") {
            return res.status(403).json({
                message: "Admin/Security accounts cannot be created this way"
            });
        }

        // Email already exist check
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
            status: "PENDING"
        });

        res.status(201).json({
            message: "Signup successful! Wait for admin approval.",
            userId: user._id
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const {
            email,
            password
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required"
            });
        }

        const user = await User.findOne({
            email
        });
        if (!user) return res.status(404).json({
            message: "User not found"
        });

        // ✅ Status check — Admin/Security ke liye skip
        if (user.role !== "ADMIN" && user.role !== "SECURITY") {
            if (user.status === "PENDING") {
                return res.status(403).json({
                    message: "Account pending admin approval"
                });
            }
            if (user.status === "REJECTED") {
                return res.status(403).json({
                    message: "Account rejected by admin"
                });
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({
            message: "Invalid password"
        });

        const token = jwt.sign({
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET, {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                building: user.building,
                flat: user.flat,
                status: user.status
            }
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    signup,
    login
};