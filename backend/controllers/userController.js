const User = require("../models/User");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const OTP_SERVER = process.env.OTP_SERVER_URL || 'http://127.0.0.1:4001/api';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Request Registration (Send OTP)
// @route   POST /api/users/request-register
// @access  Public
const requestRegister = async (req, res) => {
  try {
    const { name, email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Call OTP server to send email
    const otpRes = await axios.post(`${OTP_SERVER}/send-otp/email`, { email, name });
    
    if (otpRes.data.success) {
      res.json({ success: true, message: "OTP sent to your email." });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('network')) {
      return res.status(503).json({ success: false, message: "OTP server is down. Please contact support." });
    }
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};


// @desc    Register a new user (Verify OTP & Save)
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email: rawEmail, password, otp } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    // 1. Verify OTP first
    const verifyRes = await axios.post(`${OTP_SERVER}/verify-otp`, { key: email, otp });
    
    if (!verifyRes.data.success) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // 2. Check if user exists again (race condition)
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // 3. Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = async (req, res) => {
  try {
    const { email: rawEmail, password } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        contact: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Forgot Password (Send OTP)
// @route   POST /api/users/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Call OTP server
    const otpRes = await axios.post(`${OTP_SERVER}/send-otp/email`, { email, name: user.name });
    
    if (otpRes.data.success) {
      res.json({ success: true, message: "Password reset OTP sent to your email." });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP." });
    }
  } catch (error) {
    if (error.code === 'ECONNREFUSED' || error.message.includes('network')) {
      return res.status(503).json({ success: false, message: "OTP server is down. Please contact support." });
    }
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};


// @desc    Reset Password (Verify OTP & Update)
// @route   POST /api/users/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email: rawEmail, otp, newPassword } = req.body;
    const email = rawEmail?.toLowerCase().trim();

    // 1. Verify OTP
    const verifyRes = await axios.post(`${OTP_SERVER}/verify-otp`, { key: email, otp });
    
    if (!verifyRes.data.success) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    // 2. Find and update user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully! You can now sign in." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.response?.data?.message || error.message });
  }
};

// @desc    Check if user exists
// @route   POST /api/users/check
// @access  Public
const checkUser = async (req, res) => {
  try {
    const { email: rawEmail } = req.body;
    const email = rawEmail?.toLowerCase().trim();
    const user = await User.findOne({ email });

    if (user) {
      res.json({ success: true, exists: true, name: user.name });
    } else {
      res.json({ success: true, exists: false });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  checkUser,
  requestRegister,
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
};
