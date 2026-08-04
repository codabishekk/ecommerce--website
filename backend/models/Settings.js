const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: true,
            unique: true,
        },
        value: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        description: {
            type: String,
        },
        group: {
            type: String,
            default: "general", // e.g., 'general', 'appearance', 'notifications'
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Settings", settingsSchema);
