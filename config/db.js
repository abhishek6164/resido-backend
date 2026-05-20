const mongoose = require("mongoose");

const connectDB = async () => {
    const maxRetries = 5;
    let retries = 0;

    const connect = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });
            console.log("MongoDB Connected ✅");
        } catch (error) {
            retries++;
            console.error(`MongoDB Error (Attempt ${retries}/${maxRetries}):`, error.message);

            if (retries < maxRetries) {
                console.log(`Retrying in 5 seconds...`);
                setTimeout(connect, 5000);
            } else {
                console.error("Failed to connect to MongoDB after multiple attempts");
                process.exit(1);
            }
        }
    };

    await connect();
};

module.exports = connectDB;