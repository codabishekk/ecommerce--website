const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Role = require("./models/Role");
const Permission = require("./models/Permission");

dotenv.config();

const permissions = [
    // Products
    { name: "read:products", resource: "products", description: "View products" },
    { name: "create:products", resource: "products", description: "Add new products" },
    { name: "update:products", resource: "products", description: "Edit existing products" },
    { name: "delete:products", resource: "products", description: "Delete products" },
    
    // Users
    { name: "read:users", resource: "users", description: "View users/admins" },
    { name: "create:users", resource: "users", description: "Create new admins" },
    { name: "update:users", resource: "users", description: "Update user account" },
    { name: "delete:users", resource: "users", description: "Remove user accounts" },

    // Orders
    { name: "read:orders", resource: "orders", description: "View customer orders" },
    { name: "update:orders", resource: "orders", description: "Update order status" },

    // System
    { name: "manage:settings", resource: "settings", description: "System configuration" },
    { name: "view:analytics", resource: "analytics", description: "View dashboard metrics" },
];

const seedRbac = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB for RBAC seeding...");

        // 1. Clear existing (optional - be careful in production!)
        await Permission.deleteMany({});
        await Role.deleteMany({});

        // 2. Insert Permissions
        const createdPerms = await Permission.insertMany(permissions);
        console.log(`Inserted ${createdPerms.length} permissions.`);

        const getPermIds = (names) => createdPerms.filter(p => names.includes(p.name)).map(p => p._id);

        // 3. Define Roles
        const roles = [
            {
                name: "superadmin",
                description: "Full system access",
                isSystem: true,
                permissions: createdPerms.map(p => p._id) // All permissions
            },
            {
                name: "admin",
                description: "Business management access",
                permissions: getPermIds(["read:products", "create:products", "update:products", "delete:products", "read:users", "update:users", "read:orders", "update:orders", "view:analytics"])
            },
            {
                name: "moderator",
                description: "Content moderation access",
                permissions: getPermIds(["read:products", "read:orders", "view:analytics"])
            },
            {
                name: "editor",
                description: "Content creation access",
                permissions: getPermIds(["read:products", "create:products", "update:products", "view:analytics"])
            },
            {
                name: "viewer",
                description: "Read-only auditor access",
                permissions: getPermIds(["read:products", "read:orders", "view:analytics"])
            }
        ];

        await Role.insertMany(roles);
        console.log("RBAC Roles seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedRbac();
