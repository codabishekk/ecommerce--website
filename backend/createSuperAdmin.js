const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Admin = require("./models/Admin");
const Role = require("./models/Role");

dotenv.config();

const createSuperAdmin = async (email, password, name) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB...");

        // 1. Find the Superadmin role
        const superadminRole = await Role.findOne({ name: "superadmin" });
        if (!superadminRole) {
            console.error("Superadmin role not found. Please run seedRbac.js first.");
            process.exit(1);
        }

        // 2. Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            console.log(`Admin with email ${email} already exists. Updating to Super Admin...`);
            existingAdmin.role = superadminRole._id;
            await existingAdmin.save();
        } else {
            // 3. Create new Superadmin
            const admin = await Admin.create({
                name,
                email,
                password,
                role: superadminRole._id
            });
            console.log(`Super Admin ${name} created successfully!`);
        }

        process.exit(0);
    } catch (err) {
        console.error("Creation failed:", err);
        process.exit(1);
    }
};

// Get args from command line
const args = process.argv.slice(2);
if (args.length < 3) {
    console.log("Usage: node createSuperAdmin.js <email> <password> <name>");
    process.exit(1);
}

createSuperAdmin(args[0], args[1], args[2]);
