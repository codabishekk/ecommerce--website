const express = require("express");
const router = express.Router();
const { 
    checkUser,
    requestRegister, 
    registerUser, 
    authUser, 
    forgotPassword, 
    resetPassword 
} = require("../controllers/userController");

// Regular User Authentication Routes
router.post("/check", checkUser);
router.post("/request-register", requestRegister);
router.post("/register", registerUser);
router.post("/login", authUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
