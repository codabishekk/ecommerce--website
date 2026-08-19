const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Product = require("../../models/Product");
const Category = require("../../models/Category");
const Order = require("../../models/Order");
const ReturnRequest = require("../../models/ReturnRequest");
const SupportTicket = require("../../models/SupportTicket");
const { checkPromptInjection } = require("./guardrails");

// ─── Helpers ──────────────────────────────────────────────────────────────────
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const asString = (v, max = 500) => String(v || "").trim().slice(0, max);

const summarizeProduct = (p) => ({
    id: p._id,
    name: p.name,
    price: p.price,
    rating: p.rating || 0,
    reviewsCount: p.numReviews || 0,
    image: (p.images && p.images[0]) || "",
    category: typeof p.category === "object" && p.category ? p.category.name : p.category || "",
    color: p.color || "",
    description: p.description || "",
    stock: p.stock,
});

const summarizeOrder = (o) => ({
    id: o._id,
    createdAt: o.createdAt,
    totalPrice: o.totalPrice,
    orderStatus: o.orderStatus,
    paymentStatus: o.paymentStatus,
    paymentMethod: o.paymentMethod,
    items: (o.products || []).map((i) => ({
        name: i.name,
        qty: i.qty,
        price: i.price,
        image: i.image || "",
    })),
    shippingAddress: o.shippingAddress || null,
});

// ─── Ownership-verified order lookup. NEVER query by _id alone. ──────────────
async function getOwnedOrder(userId, orderId) {
    if (!isValidId(orderId)) return null;
    return Order.findOne({ _id: orderId, user: userId }).lean();
}

// ─── Tools ────────────────────────────────────────────────────────────────────

async function searchProducts(userId, args = {}) {
    const limit = Math.min(Number(args.limit) || 5, 8);
    const filter = { isActive: true };

    if (args.category) {
        const cats = await Category.find({
            name: { $regex: escapeRegex(asString(args.category, 50)), $options: "i" },
        })
            .select("_id")
            .lean();
        filter.category = { $in: cats.length ? cats.map((c) => c._id) : [null] };
    }

    if (args.brand) {
        filter.brand = { $regex: escapeRegex(asString(args.brand, 50)), $options: "i" };
    }

    if (args.minPrice || args.maxPrice) {
        filter.price = {};
        if (args.minPrice) filter.price.$gte = Number(args.minPrice);
        if (args.maxPrice) filter.price.$lte = Number(args.maxPrice);
    }

    const words = [];
    if (args.query) words.push(...asString(args.query, 200).split(/\s+/));
    if (args.color) words.push(asString(args.color, 50));
    if (Array.isArray(args.tags)) words.push(...args.tags.map((t) => asString(t, 50)));
    const cleanWords = [...new Set(words.filter((w) => w.length > 1))];

    if (cleanWords.length) {
        const colorTerm = asString(args.color, 50);
        filter.$and = cleanWords.map((w) => {
            const or = [
                { name: { $regex: escapeRegex(w), $options: "i" } },
                { brand: { $regex: escapeRegex(w), $options: "i" } },
                { description: { $regex: escapeRegex(w), $options: "i" } },
            ];
            if (colorTerm) or.push({ color: { $regex: escapeRegex(colorTerm), $options: "i" } });
            return { $or: or };
        });
    }

    const sortMap = {
        "price-asc": { price: 1 },
        "price-desc": { price: -1 },
        rating: { rating: -1 },
        newest: { createdAt: -1 },
    };
    const sort = sortMap[args.sort] || { rating: -1, createdAt: -1 };

    const products = await Product.find(filter)
        .populate("category", "name")
        .sort(sort)
        .limit(limit)
        .lean();

    return { type: "product_results", count: products.length, products: products.map(summarizeProduct) };
}

async function getProductDetails(userId, args = {}) {
    const id = asString(args.productId, 64);
    if (!isValidId(id)) return { error: "invalid_product_id", message: "Invalid product id." };
    const product = await Product.findById(id)
        .populate("category", "name")
        .lean();
    if (!product || !product.isActive) return { error: "product_not_found", message: "Product not found." };
    return { type: "product_detail", product: summarizeProduct(product) };
}

async function getCustomerOrders(userId, args = {}) {
    const limit = Math.min(Number(args.limit) || 5, 10);
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 }).limit(limit).lean();
    return { type: "order_list", count: orders.length, orders: orders.map(summarizeOrder) };
}

async function getOrderDetails(userId, args = {}) {
    const order = await getOwnedOrder(userId, asString(args.orderId, 64));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };
    return { type: "order_detail", order: summarizeOrder(order) };
}

async function getOrderStatus(userId, args = {}) {
    const order = await getOwnedOrder(userId, asString(args.orderId, 64));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };
    return { type: "order_status", orderId: order._id, orderStatus: order.orderStatus, paymentStatus: order.paymentStatus };
}

async function getReturnStatus(userId, args = {}) {
    const query = { user: userId };
    if (args.orderId) {
        if (!isValidId(asString(args.orderId, 64))) {
            return { error: "invalid_order_id", message: "Invalid order id." };
        }
        query.order = args.orderId;
    }
    const returns = await ReturnRequest.find(query).sort({ createdAt: -1 }).limit(5).lean();
    return {
        type: "return_list",
        count: returns.length,
        returns: returns.map((r) => ({
            id: r._id,
            orderId: r.order,
            status: r.status,
            refundStatus: r.refundStatus,
            reason: r.reason,
            createdAt: r.createdAt,
        })),
    };
}

async function escalateToHuman(userId, args = {}, context = {}) {
    const ticket = await SupportTicket.create({
        user: userId,
        reason: asString(args.reason, 500) || "Customer requested human support",
        conversationId: context.conversationId || null,
    });
    return {
        type: "ticket_created",
        ticketId: ticket._id,
        message:
            "I've forwarded your request to a human support agent. A representative will contact you shortly. Your ticket reference is " +
            String(ticket._id).slice(-6).toUpperCase() +
            ".",
    };
}

// ─── Confirmed actions (Stage 7). Return a confirmation payload, never execute. ──
const signAction = (userId, action, orderId) =>
    jwt.sign({ scope: "ai_action", action, orderId, userId: String(userId) }, process.env.JWT_SECRET, {
        expiresIn: "10m",
    });

async function requestOrderCancellation(userId, args = {}) {
    const order = await getOwnedOrder(userId, asString(args.orderId, 64));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };
    if (order.orderStatus !== "processing") {
        return { error: "not_cancellable", message: "Only orders in 'processing' status can be cancelled." };
    }
    return {
        needsConfirmation: true,
        action: "cancel_order",
        orderId: String(order._id),
        confirmationKey: signAction(userId, "cancel_order", order._id),
        orderSummary: summarizeOrder(order),
        message: `I found order #${String(order._id).slice(-6).toUpperCase()} for ₹${order.totalPrice} (status: ${order.orderStatus}). Are you sure you want to cancel it?`,
    };
}

async function requestReturn(userId, args = {}) {
    const order = await getOwnedOrder(userId, asString(args.orderId, 64));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };
    if (order.orderStatus !== "delivered") {
        return { error: "not_returnable", message: "Only delivered orders can be returned." };
    }
    return {
        needsConfirmation: true,
        action: "create_return_request",
        orderId: String(order._id),
        confirmationKey: signAction(userId, "create_return_request", order._id),
        orderSummary: summarizeOrder(order),
        message: `I found order #${String(order._id).slice(-6).toUpperCase()} (status: ${order.orderStatus}). Shall I create a return request for it?`,
    };
}

async function requestRefund(userId, args = {}) {
    const order = await getOwnedOrder(userId, asString(args.orderId, 64));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };
    if (order.orderStatus !== "delivered" || order.paymentStatus !== "paid") {
        return { error: "not_refundable", message: "A refund is only possible for paid, delivered orders." };
    }
    return {
        needsConfirmation: true,
        action: "request_refund",
        orderId: String(order._id),
        confirmationKey: signAction(userId, "request_refund", order._id),
        orderSummary: summarizeOrder(order),
        message: `I found order #${String(order._id).slice(-6).toUpperCase()} (₹${order.totalPrice}, ${order.orderStatus}). Shall I submit a refund request for it?`,
    };
}

// ─── Execution of a confirmed action (backend-verified) ──────────────────────
async function executeConfirmedAction(userId, action, orderId) {
    if (!["cancel_order", "create_return_request", "request_refund"].includes(action)) {
        return { error: "unknown_action", message: "Unknown action." };
    }

    const order = await getOwnedOrder(userId, String(orderId));
    if (!order) return { error: "order_not_found", message: "Order not found or you do not have access to it." };

    if (action === "cancel_order") {
        if (order.orderStatus !== "processing") {
            return { error: "not_cancellable", message: "Only orders in 'processing' status can be cancelled." };
        }
        const updated = await Order.findByIdAndUpdate(
            order._id,
            { orderStatus: "cancelled", ...(order.paymentStatus === "paid" ? { paymentStatus: "refunded" } : {}) },
            { new: true }
        ).lean();
        return { type: "action_result", action, orderId: String(order._id), summary: summarizeOrder(updated), message: "Your order has been cancelled successfully." };
    }

    if (action === "create_return_request") {
        if (order.orderStatus !== "delivered") {
            return { error: "not_returnable", message: "Only delivered orders can be returned." };
        }
        const returnRequest = await ReturnRequest.create({
            user: userId,
            order: order._id,
            items: (order.products || []).map((i) => ({
                product: i.product,
                name: i.name,
                qty: i.qty,
                price: i.price,
            })),
            reason: "Requested via AI support",
            status: "pending",
            refundStatus: "none",
        });
        return {
            type: "action_result",
            action,
            returnId: String(returnRequest._id),
            orderId: String(order._id),
            message: "Your return request has been submitted. Refund processing begins once approved.",
        };
    }

    // request_refund
    if (order.orderStatus !== "delivered" || order.paymentStatus !== "paid") {
        return { error: "not_refundable", message: "A refund is only possible for paid, delivered orders." };
    }
    const refund = await ReturnRequest.create({
        user: userId,
        order: order._id,
        items: (order.products || []).map((i) => ({ product: i.product, name: i.name, qty: i.qty, price: i.price })),
        reason: "Refund request via AI support",
        status: "pending",
        refundStatus: "processing",
    });
    return {
        type: "action_result",
        action,
        returnId: String(refund._id),
        orderId: String(order._id),
        message: "Your refund request has been submitted and is being processed.",
    };
}

// ─── Tool registry (OpenAI function-calling schema) ──────────────────────────
const TOOLS = [
    {
        type: "function",
        function: {
            name: "search_products",
            description:
                "Search the product catalogue. Converts natural language into structured criteria. Use for 'show me X', 'find products', recommendations.",
            parameters: {
                type: "object",
                properties: {
                    query: { type: "string", description: "Free text search (name, brand, description)." },
                    category: { type: "string", description: "Category name, e.g. shoes, skincare, serum." },
                    color: { type: "string", description: "Colour word, e.g. black, white." },
                    brand: { type: "string" },
                    minPrice: { type: "number" },
                    maxPrice: { type: "number" },
                    sort: { type: "string", enum: ["rating", "price-asc", "price-desc", "newest"] },
                    limit: { type: "number", description: "Max results (1-8)." },
                },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_product_details",
            description: "Get full details of a single product by id.",
            parameters: {
                type: "object",
                properties: { productId: { type: "string" } },
                required: ["productId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_customer_orders",
            description: "List the authenticated customer's recent orders.",
            parameters: { type: "object", properties: { limit: { type: "number" } }, required: [] },
        },
    },
    {
        type: "function",
        function: {
            name: "get_order_details",
            description: "Get details of a specific order. Only returns the authenticated customer's orders.",
            parameters: {
                type: "object",
                properties: { orderId: { type: "string" } },
                required: ["orderId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_order_status",
            description: "Get the current status of an order.",
            parameters: {
                type: "object",
                properties: { orderId: { type: "string" } },
                required: ["orderId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "get_return_status",
            description: "Check return/refund status for the authenticated customer. Pass orderId optionally.",
            parameters: {
                type: "object",
                properties: { orderId: { type: "string" } },
                required: [],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "escalate_to_human",
            description:
                "Create a human support ticket when the customer asks for an agent, is unhappy, or the issue can't be resolved by the assistant.",
            parameters: {
                type: "object",
                properties: { reason: { type: "string" } },
                required: ["reason"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "request_order_cancellation",
            description:
                "Ask the customer to confirm cancelling one of their own orders. Returns a confirmation request; never cancels directly.",
            parameters: {
                type: "object",
                properties: { orderId: { type: "string" } },
                required: ["orderId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "request_return",
            description:
                "Ask the customer to confirm a return request for a delivered order. Returns a confirmation request.",
            parameters: {
                type: "object",
                properties: {
                    orderId: { type: "string" },
                    reason: { type: "string" },
                },
                required: ["orderId"],
            },
        },
    },
    {
        type: "function",
        function: {
            name: "request_refund",
            description:
                "Ask the customer to confirm a refund request for a paid, delivered order. Returns a confirmation request.",
            parameters: {
                type: "object",
                properties: { orderId: { type: "string" } },
                required: ["orderId"],
            },
        },
    },
];

// ─── Dispatch ─────────────────────────────────────────────────────────────────
async function executeTool(userId, name, args = {}, context = {}) {
    const argText = JSON.stringify(args || {});
    const check = checkPromptInjection(argText);
    if (check.flagged) {
        return { error: "rejected", message: "This tool request was blocked by security checks." };
    }

    switch (name) {
        case "search_products":
            return searchProducts(userId, args);
        case "get_product_details":
            return getProductDetails(userId, args);
        case "get_customer_orders":
            return getCustomerOrders(userId, args);
        case "get_order_details":
            return getOrderDetails(userId, args);
        case "get_order_status":
            return getOrderStatus(userId, args);
        case "get_return_status":
            return getReturnStatus(userId, args);
        case "escalate_to_human":
            return escalateToHuman(userId, args, context);
        case "request_order_cancellation":
            return requestOrderCancellation(userId, args);
        case "request_return":
            return requestReturn(userId, args);
        case "request_refund":
            return requestRefund(userId, args);
        default:
            return { error: "unknown_tool", message: "Unknown tool." };
    }
}

module.exports = {
    TOOLS,
    executeTool,
    executeConfirmedAction,
};
