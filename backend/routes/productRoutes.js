const express = require("express");
const router = express.Router();
const {
    createProduct,
    getAllProductsAdmin,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require("../controllers/productController");
const { protect, isAdmin, checkPermission } = require("../middleware/adminAuthMiddleware");
const { uploadMultiple } = require("../middleware/uploadMiddleware");

// Admin (must be before /:id to avoid route conflict)
router.get("/admin/all", protect, checkPermission("read:products"), getAllProductsAdmin);

// Public
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected (Admin)
router.post(
    "/",
    protect,
    checkPermission("create:products"),
    uploadMultiple("images", 15),
    createProduct
);
router.put(
    "/:id",
    protect,
    checkPermission("update:products"),
    uploadMultiple("images", 15),
    updateProduct
);
router.delete("/:id", protect, checkPermission("delete:products"), deleteProduct);

module.exports = router;
