const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Category is required"],
        },
        stock: {
            type: Number,
            required: [true, "Stock is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        images: [
            {
                type: String,
            },
        ],
        brand: {
            type: String,
            default: "",
            trim: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        tagline: {
            type: String,
            trim: true,
            maxlength: [200, "Tagline cannot exceed 200 characters"],
            default: "",
        },
        promoTitle: {
            type: String,
            trim: true,
            default: "",
        },
        promoContent: {
            type: String,
            trim: true,
            default: "",
        },
        color: {
            type: String,
            trim: true,
            maxlength: 20,
            default: "#f0f0f0",
        },
        target: [
            {
                type: String,
            },
        ],
        features: [
            {
                type: String,
            },
        ],
        beforeText: {
            type: String,
            trim: true,
            default: "",
        },
        afterText: {
            type: String,
            trim: true,
            default: "",
        },
        details: {
            benefits: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            ingredients: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            beforeAfter: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            usage: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            faq: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            other: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
            legal: [
                {
                    id: String,
                    title: { type: String, required: true },
                    content: String,
                },
            ],
        },
    },
    { timestamps: true }
);

// Full-text search index
productSchema.index({ name: "text", description: "text", brand: "text" });

module.exports = mongoose.model("Product", productSchema);
