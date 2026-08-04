const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Permission name is required"],
            unique: true,
            trim: true,
            // Example formats: 'create:users', 'read:products', 'delete:orders'
        },
        description: {
            type: String,
            trim: true,
        },
        resource: {
            type: String, // e.g., 'users', 'products'
            required: true,
            trim: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Permission", permissionSchema);
