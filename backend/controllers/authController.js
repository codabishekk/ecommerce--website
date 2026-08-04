const Admin = require("../models/Admin");
const generateToken = require("../utils/generateToken");

// ─── @desc   Register a new Admin
// ─── @route  POST /api/admin/register
// ─── @access Public (or restrict with a secret header in production)
const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and password",
            });
        }

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({
                success: false,
                message: "An admin with this email already exists",
            });
        }

        const admin = await Admin.create({ name, email, password, role });

        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: generateToken(admin._id, admin.role),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Admin Login
// ─── @route  POST /api/admin/login
// ─── @access Public
const adminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide email and password",
            });
        }

        const admin = await Admin.findOne({ email }).select("+password");

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        if (!admin.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated",
            });
        }

        const isMatch = await admin.matchPassword(password);
        
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = generateToken(admin._id, admin.role);

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            data: {
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                token: token,
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Get Admin Profile
// ─── @route  GET /api/admin/profile
// ─── @access Private (Admin)
const getAdminProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        message: "Admin profile fetched",
        data: req.user,
    });
};

// ─── @desc   Update Admin Profile
// ─── @route  PUT /api/admin/profile
// ─── @access Private (Admin)
const updateAdminProfile = async (req, res, next) => {
    try {
        const admin = await Admin.findById(req.user._id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        admin.name = req.body.name || admin.name;
        admin.email = req.body.email || admin.email;

        if (req.body.password) {
            admin.password = req.body.password;
        }

        const updatedAdmin = await admin.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                _id: updatedAdmin._id,
                name: updatedAdmin.name,
                email: updatedAdmin.email,
                role: updatedAdmin.role,
                token: generateToken(updatedAdmin._id, updatedAdmin.role),
            },
        });
    } catch (error) {
        next(error);
    }
};

// ─── @desc   Logout Admin (stateless – client drops the token)
// ─── @route  POST /api/admin/logout
// ─── @access Private (Admin)
const logoutAdmin = (req, res) => {
    res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};

module.exports = { registerAdmin, adminLogin, getAdminProfile, logoutAdmin, updateAdminProfile };
