const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmins = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected ✅");

        // Pehle se hain toh delete karo
        await User.deleteMany({
            role: {
                $in: ["ADMIN", "SECURITY"]
            }
        });

        const hashedPassword = await bcrypt.hash("admin123", 10);
        const guardPassword = await bcrypt.hash("guard123", 10);

        await User.insertMany([{
                name: "Super Admin",
                email: "admin@mygate.com",
                mobile: "9999999999",
                password: hashedPassword,
                role: "ADMIN",
                building: "A",
                flat: "1",
                status: "APPROVED"
            },
            {
                name: "Security Guard",
                email: "guard@mygate.com",
                mobile: "8888888888",
                password: guardPassword,
                role: "SECURITY",
                building: "A",
                flat: "1",
                status: "APPROVED"
            }
        ]);

        console.log("✅ Admin & Guard created!");
        console.log("Admin  → admin@mygate.com / admin123");
        console.log("Guard  → guard@mygate.com / guard123");
        process.exit(0);

    } catch (error) {
        console.error("Seeder Error:", error.message);
        process.exit(1);
    }
};

seedAdmins();