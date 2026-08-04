const express = require("express");
const router = express.Router();
const {
    createCategory,
    getCategories,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoryController");
const { protect, isAdmin } = require("../middleware/adminAuthMiddleware");

// Public
router.get("/", getCategories);

// Protected (Admin)
router.post("/", protect, isAdmin, createCategory);
router.put("/:id", protect, isAdmin, updateCategory);
router.delete("/:id", protect, isAdmin, deleteCategory);

module.exports = router;
