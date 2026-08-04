const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Role name is required"],
            unique: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        permissions: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Permission",
            },
        ],
        isSystem: {
            type: Boolean,
            default: false, // System roles (e.g. 'superadmin') cannot be modified/deleted
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Role", roleSchema);
