const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
});

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [orderItemSchema],
        totalPrice: {
            type: Number,
            required: true,
            default: 0.0,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "COD",
        },
        orderStatus: {
            type: String,
            enum: ["processing", "shipped", "delivered", "cancelled"],
            default: "processing",
        },
        shippingAddress: {
            street:  { type: String, required: true },
            city:    { type: String, required: true },
            state:   { type: String, required: true },
            zip:     { type: String, required: true },
            country: { type: String, default: "India" },
        },
        deliveredAt: {
            type: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
