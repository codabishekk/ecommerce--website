const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        image: {
            type: String,
            required: [true, "Banner image is required"],
        },
        link: {
            type: String,
            required: [true, "Banner link is required"],
            default: "/",
        },
        title: {
            type: String,
            trim: true,
            default: "",
        },
        description: {
            type: String,
            trim: true,
            default: "",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);
