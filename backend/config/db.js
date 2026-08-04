const mongoose = require("mongoose");
const dns = require("dns");

// Bypass ISP blocks on SRV records by using Google DNS explicitly
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        console.log("Attempting to connect to MongoDB...");
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
