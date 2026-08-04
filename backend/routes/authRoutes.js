const express = require("express");
const router = express.Router();
const {
    registerAdmin,
    adminLogin,
    getAdminProfile,
    logoutAdmin,
} = require("../controllers/authController");
const { protect } = require("../middleware/adminAuthMiddleware");

// Public
router.post("/register", registerAdmin);
router.post("/login", adminLogin);

// Protected
router.get("/profile", protect, getAdminProfile);
router.post("/logout", protect, logoutAdmin);

module.exports = router;
