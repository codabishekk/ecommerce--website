const Order = require("../models/Order");
const { sendOrderEmail } = require("../utils/mailUtils");

// ─── @desc   Get All Orders (Paginated)
// ─── @route  GET /api/orders
// ─── @access Private (Admin)
const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const [orders, total] = await Promise.all([
            Order.find()
                .populate("user", "name email")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Order.countDocuments(),
        ]);

        res.status(200).json({
            success: true,
            message: "Orders fetched",
            data: orders,
            pagination: { page, limit, total, pages: Math.ceil(total / limit) },
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Get Single Order by ID
// ─── @route  GET /api/orders/:id
// ─── @access Private (Admin)
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email phone")
            .populate("products.product", "name price images");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order fetched",
            data: order,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Update Order Status
// ─── @route  PUT /api/orders/:id/status
// ─── @access Private (Admin)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id).populate("user", "name email");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        const oldStatus = order.orderStatus;
        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        if (orderStatus === "delivered") order.deliveredAt = new Date();

        const updated = await order.save();

        // Send Email Notification if status changed
        if (orderStatus && orderStatus !== oldStatus) {
            // Map status for mail template if needed, or pass directly
            const validMailStatuses = ['processing', 'shipped', 'delivered'];
            if (validMailStatuses.includes(orderStatus) && order.user?.email) {
                // Tracking info would ideally come from req.body too if available
                const extraData = {
                    trackingNumber: req.body.trackingNumber,
                    trackingUrl: req.body.trackingUrl
                };
                sendOrderEmail(order.user.email, order.user.name, order._id, orderStatus, extraData);
            }
        }

        res.status(200).json({
            success: true,
            message: "Order status updated",
            data: updated,
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Delete an Order
// ─── @route  DELETE /api/orders/:id
// ─── @access Private (SuperAdmin)
const deleteOrder = async (req, res, next) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Order deleted",
            data: {},
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllOrders, getOrderById, updateOrderStatus, deleteOrder };
