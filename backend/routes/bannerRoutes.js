const express = require("express");
const router = express.Router();
const {
    getBanners,
    getBannersAdmin,
    createBanner,
    deleteBanner,
    toggleBannerStatus,
    updateBanner,
} = require("../controllers/bannerController");
const { protect, checkPermission } = require("../middleware/adminAuthMiddleware");
const { uploadSingle } = require("../middleware/uploadMiddleware");

// Public routes
router.get("/", getBanners);

// Admin routes
router.get("/admin/all", protect, checkPermission("read:products"), getBannersAdmin);
router.post("/", protect, checkPermission("create:products"), uploadSingle("image"), createBanner);
router.put("/:id", protect, checkPermission("update:products"), uploadSingle("image"), updateBanner);
router.delete("/:id", protect, checkPermission("delete:products"), deleteBanner);
router.patch("/:id/toggle", protect, checkPermission("update:products"), toggleBannerStatus);

module.exports = router;
