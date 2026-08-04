const express = require("express");
const router = express.Router();
const {
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} = require("../controllers/orderController");
const { protect, isAdmin, isSuperAdmin } = require("../middleware/adminAuthMiddleware");

// All order routes are admin-protected
router.use(protect);
router.use(isAdmin);

router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id/status", updateOrderStatus);
router.delete("/:id", isSuperAdmin, deleteOrder);

module.exports = router;
